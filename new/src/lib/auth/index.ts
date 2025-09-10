import { betterAuth } from "better-auth";
import { admin, openAPI, username } from "better-auth/plugins";
import { Pool } from "pg";

export type Session = typeof auth.$Infer.Session
export type User = Session["user"]



export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
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
  plugins: [admin(), username(), openAPI()],
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
