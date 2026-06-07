import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                empNo: { label: "社員番号" },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.empNo || !credentials?.password) return null;

                const employee = await prisma.employee.findUnique({
                    where: { empNo: credentials.empNo as string },
                });

                if (!employee) return null;
                if (employee.password !== credentials.password) return null;

                return {
                    id: String(employee.id),
                    name: employee.name,
                    role: employee.role,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = (user).role;
            return token;
        },
        session({ session, token }) {
            session.user.role = token.role as string;
            return session;
        },
    },
});