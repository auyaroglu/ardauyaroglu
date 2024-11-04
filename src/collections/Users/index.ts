import type { CollectionConfig } from "payload"

const Users: CollectionConfig = {
    slug: "users",
    admin: {
        defaultColumns: ["name", "email"],
        useAsTitle: "name",
    },
    auth: true,
    fields: [
        {
            name: "name",
            type: "text",
        },
    ],
    timestamps: true,
}

export default Users
