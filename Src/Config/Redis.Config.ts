import Redis from "ioredis";
export const RedisConfig = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  maxRetriesPerRequest: null,
});
RedisConfig.on("connect", () => {
  console.log("✅ Redis Connected");
});
RedisConfig.on("error", () => {
  console.log("❌ Redis Error");
});
