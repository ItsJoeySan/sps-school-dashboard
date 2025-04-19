import { NextRequest } from "next/server";

export default function createRouteMatcher(patterns: string[]) {
  const regexes = patterns.map((pattern) => new RegExp(`^${pattern}$`));

  return (req: NextRequest) => {
    const path = req.nextUrl.pathname;
    const matched = regexes.some((regex) => regex.test(path));
    if (matched) {
      console.log(`Matched path: ${path} with one of ${patterns}`);
    }
    return matched;
  };
}