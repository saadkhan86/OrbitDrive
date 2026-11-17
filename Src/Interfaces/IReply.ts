export declare namespace IReply {
    interface queryReturn {
        data: any[]
        pagination: {
            limit: number
            hasNextPage: boolean
            totalCount?: number | null
            nextCursor?: string | null
        }
    }
}