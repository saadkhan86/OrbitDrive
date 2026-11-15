import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./Src/Database/schemas/*.ts",
  out: "./Src/Drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URI!,
  },
});
