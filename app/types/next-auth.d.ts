import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role: string;
            empNo: string;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        empNo: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        empNo: string;
    }
}