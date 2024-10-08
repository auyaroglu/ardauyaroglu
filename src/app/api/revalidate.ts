import { NextApiRequest, NextApiResponse } from "next"

// Revalidate API route handler
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Secret kontrolü yapıyoruz
    if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
        return res.status(401).json({ message: "Invalid token" })
    }

    // path query parametresini alıyoruz
    const path = req.query.path as string

    try {
        // Belirtilen path'i revalidate ediyoruz
        await res.revalidate(path)
        return res.json({ revalidated: true })
    } catch (err) {
        // Eğer bir hata oluşursa
        return res
            .status(500)
            .json({ message: "Error revalidating", error: err })
    }
}
