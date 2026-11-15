
import { SocketUser } from "./types.socket";

export type SocketCallback = (response: SocketResponse<any>) => void;

export type SocketData<T = any> = {
    user: SocketUser;
} & Partial<T>

export type SocketResponse<T = any> = {
    success: boolean;
    message: string;
    data: SocketData<T> | null;
    code: string;
    timestamp: string;
}

export const response = <T>(res: { success: boolean, message: string, data?: SocketData<T> }): SocketResponse<T> => {
    return {
        success: res.success,
        message: res.message,
        data: res.data || null,
        code: res.success ? "SUCCESS" : "FAILURE",
        timestamp: new Date().toISOString()
    }
}
