import type { Metadata } from "next"

import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import "../globals.css"

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    return (
        <html lang={locale}>
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
    twitter: {
        card: "summary_large_image",
        creator: "@ardauyaroglu",
    },
}
