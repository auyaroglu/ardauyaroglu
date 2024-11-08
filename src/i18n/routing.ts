import { defineRouting } from "next-intl/routing"
import { createSharedPathnamesNavigation } from "next-intl/navigation"
import createMiddleware from "next-intl/middleware"

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["tr", "en"],

    // Used when no locale matches
    defaultLocale: "tr",
    localePrefix: "as-needed",
})

export default createMiddleware(routing, {
    localeDetection: false,
    alternateLinks: false,
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation(routing)
