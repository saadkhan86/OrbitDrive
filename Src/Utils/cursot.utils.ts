import { decode } from "punycode"
import { CustomError } from "../ErrorHandler/CustomError"
import { ICursor } from "../Interfaces/ICursor"


export const cusrorUtils = {
    encode: (payload: ICursor.CursorPayload): string => {
        return Buffer.from(JSON.stringify(payload)).toString("base64url")
    },
    decode: (cursor?: string): ICursor.CursorPayload | null => {
        if (!cursor) return null
        try {
            console.log(cursor)
            const decoded = Buffer.from(cursor, "base64url").toString("utf-8")
            const payload: unknown = JSON.parse(decoded)
            if (
                typeof payload !== "object" ||
                payload == null ||
                !("createdAt" in payload) ||
                !("id" in payload) ||
                typeof payload.id !== "string" ||
                typeof payload.createdAt !== "string" ||
                Number.isNaN(Date.parse(payload.createdAt))
            ) {
                throw new CustomError(400, "Invalid cursor payload", "INVALID_INPUT")
            }
            return payload as ICursor.CursorPayload
        }
        catch (error: any) {
            throw new Error("Invalid cursor")
        }
    }
}