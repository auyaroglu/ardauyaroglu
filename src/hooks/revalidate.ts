import { CollectionAfterChangeHook } from "payload"
import axios from "axios"

export const revalidateHook: CollectionAfterChangeHook = async ({ doc }) => {
    try {
        const revalidateUrl = `${process.env.NEXT_PUBLIC_NEXTJS_URL}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&path=${doc.slug}`

        await axios.get(revalidateUrl)
    } catch (error) {
        console.error("Revalidate request failed:", error)
    }
}
