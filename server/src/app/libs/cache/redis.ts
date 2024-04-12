import { RedisClientType, createClient } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_URL } from "../../config";

export class RedisCache {
  private static defaultInstance: RedisCache;
  private readonly cache: RedisClientType;
  private cacheOptions;
  private url: string;
  private host: string;
  private port: number;
  private ttl: number;
  private isReady: boolean;

  constructor(url?: string, host?: string, port?: number) {
    // [1] define ttl and create redis connection
    this.isReady = false;
    this.ttl = 60;
    this.url = url || REDIS_URL;
    this.host = host || REDIS_HOST;
    this.port = port || REDIS_PORT;
    this.cacheOptions = {
      url: this.url,
      socket: {
        host: this.host,
        port: this.port,
      },
    };
    this.cache = createClient({
      ...this.cacheOptions,
    });

    this.connect();
  }

  async get(key: string) {
    return this.cache.get(key);
  }

  async set(key: string, value: string, seconds?: number) {
    this.ttl = seconds ?? this.ttl;
    this.cache.set(key, value, { ...(seconds && { EX: this.ttl }) });
  }

  // [2] generic function, takes `fetcher` argument which is meant to refresh the cache
  async remember<T>(
    key: string,
    seconds: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // [3] if we're not connected to redis, bypass cache
    const connected = this.isReady;
    if (!connected) {
      return await fetcher();
    }

    return new Promise(async (resolve, reject) => {
      try {
        const cached = await this.get(key);
        // console.log("====old====", cached);

        if (typeof cached === "string") {
          // [4] if value is found in cache, return it
          return resolve(JSON.parse(cached));
        }

        // [5] if value is not in cache, fetch it and return it
        if (!cached) {
          const result = await fetcher();
          await this.set(key, JSON.stringify(result), seconds);
          //   console.log("====fresh====", result);
          return resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  // [6]
  del(key: string) {
    this.cache.del(key);
  }

  incr(key: string) {
    return this.cache.incr(key);
  }

  flush() {
    this.cache.flushAll();
  }

  expire(key: string, time: number) {
    return this.cache.expire(key, time);
  }

  public static instance(
    url?: string,
    host?: string,
    port?: number
  ): RedisCache {
    if (!RedisCache.defaultInstance) {
      RedisCache.defaultInstance = new RedisCache(url, host, port);
    }
    return RedisCache.defaultInstance;
  }

  private events() {
    this.cache.on("connect", () => {
      console.log(`Redis connection established`);
    });

    this.cache.on("reconnecting", () => {
      console.log(`Redis is reconnecting`);
    });

    this.cache.on("error", (error) => {
      console.error(`Redis error, service degraded: ${error}`);
    });

    this.cache.on("ready", () => {
      this.isReady = true;
      console.error(`Redis service is ready`);
    });
  }

  private async connect() {
    this.events();
    await this.cache.connect();
  }

  disconnect() {
    this.cache.quit();
  }
}

export const cache = new RedisCache();
