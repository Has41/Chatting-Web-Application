import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_PASSWORD,
})

export default redis
