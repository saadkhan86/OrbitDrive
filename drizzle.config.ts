import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./Src/Database/schemas/*.ts",
  out: "./Src/Drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:sk8613013@localhost:5432/orbitdrive",
  },
});
