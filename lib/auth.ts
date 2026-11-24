import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db, mongoClient } from "./mongodb";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
    baseURL: appUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [appUrl],

    database: mongodbAdapter(db, { client: mongoClient }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: true,
            },
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            businessName: {
                type: "string",
                required: false,
                input: true,
            },
            subscriptionPlan: {
                type: "string",
                required: false,
                defaultValue: "free",
                input: false,
            },
            subscriptionExpiresAt: {
                type: "date",
                required: false,
                input: false,
            },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Public sign-up can only create "vendor" or "customer".
                    // Anything else (including "admin") becomes "customer".
                    const role = user.role === "vendor" ? "vendor" : "customer";
                    return {
                        data: {
                            ...user,
                            role,
                            isBlocked: false,
                            subscriptionPlan: "free",
                        },
                    };
                },
            },
            update: {
                before: async (data) => {
                    // Users can never change these fields through profile updates.
                    const {
                        role: _role,
                        isBlocked: _isBlocked,
                        subscriptionPlan: _plan,
                        subscriptionExpiresAt: _expires,
                        ...safeData
                    } = data as Record<string, unknown>;
                    return { data: safeData };
                },
            },
        },
    },

    plugins: [
        jwt({
            jwt: {
                expirationTime: "15m",
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    role: (user as { role?: string }).role ?? "customer",
                }),
            },
        }),
        nextCookies(), // must always be the LAST plugin
    ],
});