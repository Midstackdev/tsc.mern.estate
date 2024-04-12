import { NextFunction, Request, Response } from "express";
import { cache } from "../../libs/cache/redis";
import { log } from "../../libs/logger";

type RateLimiter = {
  time: number;
  limit: number;
};

export const rateLimit = (rule: RateLimiter) => {
  const { time, limit } = rule;

  return async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress =
      req.ip ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress?.split(":").pop();
    const endpoint = `${req.baseUrl}${req.path}`;
    const method = req.method.toLocaleLowerCase();
    const search = "/";
    const replace = "*";
    const redisId = `${method}${endpoint}*${ipAddress}`
      .split(search)
      .join(replace);

    // console.log("-----1-----", redisId);

    const requests = await cache.incr(redisId);

    log.info(`cached requests: ${JSON.stringify(requests)}`);

    if (requests === 1) {
      await cache.expire(redisId, time);
    }

    if (requests > limit) {
      return res.status(429).send({
        message: "too much requests",
      });
    }

    next();
  };
};
