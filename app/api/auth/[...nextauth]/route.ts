import DBClient from "@/lib/db";
import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { NextRequest } from "next/server";
const prisma = DBClient.getInstance().prisma

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
  }
}

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret:process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks:{
        async signIn(params){
            if(!params.user.email){
                return false;
            }
            try{
                let existingUser = await prisma.user.findUnique({
                    where: { email: params.user.email }
                });

                if (!existingUser) {
                    existingUser = await prisma.user.create({
                        data: {
                            email: params.user.email,
                            provider: "Google"
                        }
                    });
                }
                params.user.id = existingUser.id;
            }catch(err){
               console.log(err)
               return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // Fetch user from database to get `id`
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email || "" }
                });

                if (dbUser) {
                    token.id = dbUser.id; // Store id in the token
                }
            }
            console.log("JWT token:", token);
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string; // Attach `id` to session
            }
            console.log("Session:", session);
            return session;
        }
    }
})

export { handler as GET, handler as POST };

