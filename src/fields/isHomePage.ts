import { Field } from "payload"

export const isHomePage: Field = {
    name: "homepage",
    label: {
        en: "Is Home Page?",
        tr: "Anasayfa mı?",
    },
    type: "select",
    defaultValue: "no",
    options: [
        {
            label: {
                en: "Yes",
                tr: "Evet",
            },
            value: "yes",
        },
        {
            label: {
                en: "No",
                tr: "Hayır",
            },
            value: "no",
        },
    ],
    admin: {
        position: "sidebar",
    },
    validate: async (
        value: string | null | undefined,
        { req, siblingData }: { req: any; siblingData: any }
    ): Promise<string | true> => {
        const payload = req.payload
        const currentLocale = req.locale || process.env.NEXT_PUBLIC_DEFAULT_LANG

        const messages: Record<string, string> = {
            tr: "Sadece bir sayfa anasayfa olabilir.",
            en: "Only one page can be the home page.",
        }

        // Eğer "yes" seçilmişse, diğer sayfalarda kontrol yap
        if (value === "yes") {
            // Anasayfa olarak ayarlanmış başka bir sayfa var mı kontrol et
            const existingHomePage = await payload.find({
                collection: "pages",
                where: {
                    homepage: { equals: "yes" },
                    _id: { not_equals: siblingData?.id }, // Kendisi hariç
                },
            })

            // Eğer zaten "yes" olarak ayarlanmış başka bir sayfa varsa, hatayı döndür
            if (existingHomePage.totalDocs > 0) {
                return messages[currentLocale] || messages.tr // Geçerli dile göre mesaj döndür
            }
        }

        return true // Validation başarılı
    },
}
