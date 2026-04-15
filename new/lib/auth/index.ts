import { betterAuth } from "better-auth";
import { admin, jwt, oidcProvider, openAPI, username } from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";
import { Pool } from "pg";

export type Session = typeof auth.$Infer.Session
export type User = Session["user"]


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function createInternalClients(headers: Headers) {
  return await auth.api.adminCreateOAuthClient({
    headers,
    body: {
      redirect_uris: ["https://app.hauptspeicher.trichter.com/oauth/callback"],
      scope: "openid profile",
      client_name: "trichter-app",
      client_secret_expires_at: 0,
      skip_consent: true,
      enable_end_session: true,
    }
  })


}

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  plugins: [admin(), username(), openAPI(), jwt(), oauthProvider({
    loginPage: "/auth/login",
    consentPage: "/auth/consent",
    trustedClients: [
      {
        clientId: "trichter-app",
        clientSecret: process.env.TRICHTER_APP_OIDC_CLIENT_SECRET as string,
        name: "Trichter App",
        type: "native",
        redirectURLs: [],
        disabled: false,
        skipConsent: true,
        metadata: {}
      }
    ]

  })],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.username && user.name) {
            let generatedUsername = user.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            if (!generatedUsername) {
              generatedUsername = 'user';
            }

            const timestamp = Date.now().toString().slice(-4);
            const finalUsername = `${generatedUsername}-${timestamp}`;

            return {
              data: {
                ...user,
                username: finalUsername,
                displayUsername: user.name
              }
            };
          } else if (user.username && !user.displayUsername) {
            return {
              data: {
                ...user,
                displayUsername: user.username
              }
            };
          }

          return;
        }
      }
    }
  }
});
