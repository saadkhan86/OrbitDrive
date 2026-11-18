import cloudinary from "../Config/coudinary.config"

export const cloudinaryService = {
    upload: async (userId: string, base64: string) => {
        const upload = await cloudinary.uploader.upload(base64, {
            folder: "OrbitDrive/users",
            public_id: `${userId}/profile`,
            overwrite: true,
            resource_type: "image",
            transformation: {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "face:auto"
            }
        })
        return { url: upload.url, publicId: upload.public_id }
    },
    delete: async (publicId: string) => {
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
    }
}