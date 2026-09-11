import "dotenv/config";
import { Pool } from "pg";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: Pool;
};
export declare function checkDatabaseConnection(): Promise<void>;
//# sourceMappingURL=index.d.ts.map