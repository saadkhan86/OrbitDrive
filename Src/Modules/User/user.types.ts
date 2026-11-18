export declare namespace UserTypes {
    interface UserProfile {
        avatar: {
            url: string | null
            publicId: string | null
        };
        bio: string | null
    }
    interface UploadedProfileResult {
        url: string
        publicId: string
    }
    interface UpdateUser {
        userId: string
        fullName?: string
        password?: string
        profile?: UserProfile
    }
}
