import createNextIntlPlugin from "next-intl/plugin"
import { withPayload } from "@payloadcms/next/withPayload"

// `next-intl` eklentisini oluşturun
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ortak Next.js yapılandırmalarınızı buraya ekleyebilirsinizz
}

// Eklentileri zincirleyerek birleştiriyoruz
export default withPayload(withNextIntl(nextConfig))
