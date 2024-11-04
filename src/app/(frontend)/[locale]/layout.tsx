import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { mergeOpenGraph } from "@/utilities/mergeOpenGraph"

import "./globals.css"

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link href="/favicon.ico" rel="icon" sizes="32x32" />
                <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    )
}

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SERVER_URL || "https://ardauyaroglu.com"
    ),
    openGraph: mergeOpenGraph(),
    twitter: {
        card: "summary_large_image",
        creator: "@ardauyaroglu",
    },
}
