import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/opengraph-image",
    "/twitter-image",
    "/faq",
    "/faq/opengraph-image",
    "/faq/twitter-image",
    "/exercises/opengraph-image",
    "/exercises/twitter-image",
    "/workouts/opengraph-image",
    "/workouts/twitter-image",
    "/templates/opengraph-image",
    "/templates/twitter-image",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
