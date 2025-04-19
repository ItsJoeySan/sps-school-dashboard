import { betterAuth, object } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Fasthand } from "next/font/google";
const superAdmin = process.env.adminUserId as string;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
      surname: {
        type: "string",
        required: false,
      },
      username: {
        type: "string",
        required: false,
      },
      image:{
        type:"string",
        required:false
      }
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      impersonationSessionDuration: 60 * 60 * 24,
      adminUserIds: [superAdmin],
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  advanced: {
    generateId: false,
  },
});


