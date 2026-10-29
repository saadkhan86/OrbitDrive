
import type { Redis } from "ioredis";
import { redis } from "../../Config/Redis.Config";

class RedisCache {
    constructor(private readonly redis: Redis) { }

    async get<T>(key: string): Promise<T | null> {
        const cached = await this.redis.get(key);

        if (cached === null) {
            return null;
        }

        try {
            return JSON.parse(cached) as T;
        } catch {
            await this.redis.del(key);
            return null;
        }
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds = 300,
    ): Promise<void> {
        if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
            throw new Error("ttlSeconds must be a positive integer");
        }

        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1;
    }

    async expire(key: string, ttlSeconds: number): Promise<void> {
        if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
            throw new Error("ttlSeconds must be a positive integer");
        }

        await this.redis.expire(key, ttlSeconds);
    }
}
export default new RedisCache(redis)