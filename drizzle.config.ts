import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schemas/*.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URI!,
  },
});
