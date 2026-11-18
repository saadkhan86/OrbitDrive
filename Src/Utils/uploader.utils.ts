import { ICloudinary } from "../Interfaces/ICloudinary"
import { cloudinaryService } from "../Services/cloudinary.utils"

export const uploaderUtils = {
    isValidUrl: (url: string) => {
        if (!url || url.trim() === '') return false
        if (!url.startsWith("http")) return false
        try {
            new URL(url)
            return true
        } catch (error) {
            return false
        }
    },
    isValidBase64: (base64: string) => {
        if (!base64 || base64.trim() === '') return false
        try {
            const check = Buffer.from(base64, 'base64').toString('utf-8')
            return check
        } catch (error) {
            return false
        }
    },
    convertToUrl: async (id: string, image: string): Promise<string | null> => {
        if (!image || image.trim() == '') {
            return null
        }
        if (uploaderUtils.isValidUrl(image)) {
            return image
        }
        if (uploaderUtils.isValidBase64(image)) {
            return await cloudinaryService.upload(image, id)
        }
        return null
    }
}