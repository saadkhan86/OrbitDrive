import cloudinary from "../Config/coudinary.config"

export const cloudinaryService = {
    upload: async (id: string, base64: string): Promise<string> => {
        const upload = await cloudinary.uploader.upload(base64, {
            folder: "OrbitDrive/users",
            public_id: `${id}/profile`,
            overwrite: true,
            invalidate: true,
            resource_type: "image",
            transformation: {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "face:auto"
            }
        })
        return upload.url
    },
}