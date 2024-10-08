import type { CollectionBeforeChangeHook } from "payload"

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0") // Get the day and pad with '0' if needed
    const month = String(date.getMonth() + 1).padStart(2, "0") // Get the month (0-11, so add 1) and pad with '0'
    const year = date.getFullYear() // Get the full year
    return `${day}.${month}.${year}` // Return formatted date
}

export const populatePublishedAt: CollectionBeforeChangeHook = ({
    data,
    operation,
    req,
}) => {
    if (operation === "create" || operation === "update") {
        if (req.data && !req.data.publishedAt) {
            const now = new Date()
            return {
                ...data,
                publishedAt: formatDate(now), // Use the formatted date
            }
        }
    }

    return data
}
