import { NextRequest, NextResponse } from "next/server"

// Revalidate API route handler
export async function GET(req: NextRequest) {
    // URL parametrelerini alıyoruz
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    const path = searchParams.get("path")

    // Secret kontrolü
    if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    try {
        // Belirtilen path'i revalidate ediyoruz
        await revalidate(path || "/") // res.revalidate değil, doğrudan revalidate çağrılır
        return NextResponse.json({ revalidated: true })
    } catch (err) {
        return NextResponse.json(
            { message: "Error revalidating", error: err },
            { status: 500 }
        )
    }
}

// Revalidate fonksiyonunu tanımlamayı unutmayın
async function revalidate(path: string) {
    // Next.js'in dahili revalidate fonksiyonu
    // Not: Burada Next.js ile nasıl revalidate edileceğini göstermek için basit bir yer tutucu yapıdır.
    console.log(`Revalidating path: ${path}`)
}
