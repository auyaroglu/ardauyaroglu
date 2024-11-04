import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing, {
    localeDetection: false, // Yerel algılamayı kapatıyoruz
})

export const config = {
    matcher: [
        "/", // Anasayfa
        "/(tr|en)/:path*", // Yerelleştirilmiş yollar için
        "/((?!_next|_vercel|.*\\..*|admin|api/).*)", // admin ve api dizinlerini hariç tut
    ],
}
