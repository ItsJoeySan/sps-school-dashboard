import { routeAccessMap } from "./lib/settings";
import createRouteMatcher from "./lib/createRouteMatcher";

import { NextRequest, NextResponse } from "next/server";

import {getSessionCookie} from "better-auth/cookies";


const authRoutes = ["/login", "/signup"];

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export const middleware = async (req: NextRequest) => {
  const pathName = req.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName); //true or false

  const sessionCookie = getSessionCookie(req);

  //no session, if authRoute then go other wise login
  if(!sessionCookie){
    if(isAuthRoute){
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

// we are here means there is sessionCookie


//session yes, isAuthRoute yes, why are you trying to login again go back,
if(isAuthRoute){

  return NextResponse.redirect(new URL(`/`, req.url));
}


  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    // "/(api|trpc)(.*)",
  ],
};
