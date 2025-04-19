import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      console.log("session from getUserSession ",session);
      return NextResponse.json(session?.user.role);
}