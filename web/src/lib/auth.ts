import { betterAuth } from 'better-auth';
import { admin, openAPI, username } from 'better-auth/plugins';
import { env } from '$env/dynamic/private';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import { GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import * as auth_schema from '$lib/server/db/schema/auth-schema';
import { logger } from './logger';

interface UserCreationHookData {
	id?: string;
	name?: string;
	email?: string;
	username?: string;
	displayUsername?: string;
	[key: string]: unknown;
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...auth_schema
		}
	}),
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: PUBLIC_GOOGLE_CLIENT_ID as string,
			clientSecret: GOOGLE_CLIENT_SECRET as string
		}
	},
	plugins: [admin(), username(), openAPI()],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					logger.info('Creating user:', user);
					const userData = user as UserCreationHookData;

					if (!userData.username && userData.name) {
						let generatedUsername = userData.name
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
								displayUsername: userData.name
							}
						};
					} else if (userData.username && !userData.displayUsername) {
						return {
							data: {
								...user,
								displayUsername: userData.username
							}
						};
					}

					return;
				}
			}
		}
	}
});
