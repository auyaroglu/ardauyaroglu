import type { FieldHook } from "payload"

// Türkçe karakterleri İngilizce karşılıklarına dönüştürmek için bir fonksiyon
export const replaceTurkishChars = (val: string): string =>
    val
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "G")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "U")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "S")
        .replace(/ı/g, "i")
        .replace(/İ/g, "I")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "O")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C")

export const formatSlug = (val: string): string =>
    replaceTurkishChars(val)
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") // Sadece alfanumerik karakterler ve "-" işaretine izin verilir
        .toLowerCase()

export const formatSlugHook =
    (fallback: string): FieldHook =>
    ({ data, operation, originalDoc, value }) => {
        if (typeof value === "string") {
            return formatSlug(value)
        }

        if (operation === "create" || !data?.slug) {
            const fallbackData = data?.[fallback] || data?.[fallback]

            if (fallbackData && typeof fallbackData === "string") {
                return formatSlug(fallbackData)
            }
        }

        return value
    }
