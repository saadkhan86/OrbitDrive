export declare namespace ICursor {
    interface CursorPayload {
        createdAt: string
        id: string
    }
    interface query {
        cursor: {
            createdAt: Date,
            id: string
        } | null
    }
}