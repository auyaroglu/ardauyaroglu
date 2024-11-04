import type { CollectionBeforeChangeHook } from "payload"

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
                publishedAt: now, // Use the Date object directly
            }
        }
    }

    return data
}
