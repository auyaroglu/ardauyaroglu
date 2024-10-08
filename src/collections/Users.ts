import type { CollectionConfig } from "payload"

export const Users: CollectionConfig = {
    slug: "users",
    labels: {
        singular: {
            en: "User",
            tr: "Kullanıcı",
        },
        plural: {
            en: "Users",
            tr: "Kullanıcılar",
        },
    },
    admin: {
        useAsTitle: "email",
    },
    auth: true,
    fields: [
        // Email added by default
        // Add more fields as needed
    ],
}
