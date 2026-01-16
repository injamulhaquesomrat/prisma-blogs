import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token${token}`;
        (async () => {
          const info = await transporter.sendMail({
            from: '"Prisma Blog" <prismablog@gmail.com>',
            to: user.email,
            subject: "Email Verification - Prisma",
            text: "Verify your email address", // Plain-text version of the message
            html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #4CAF50; color: #ffffff;">
                <h1>Prisma Blog</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; color: #333333;">
                <h2>Email Verification</h2>
                <p>Hi ${user.name},</p>
                <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
                <p style="text-align: center; margin: 40px 0;">
                  <a href="${verificationUrl}" 
                     style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Verify Email
                  </a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #4CAF50;">${verificationUrl}</p>
                <p>Cheers,<br/>The Prisma Blog Team</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; font-size: 12px; color: #999999; background-color: #f4f4f4;">
                © 2026 Prisma Blog. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, // HTML version of the message
          });

          console.log("Message sent:", info.messageId);
        })();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
