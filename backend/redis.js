import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.REDIS_URL, // Ensure this includes the correct protocol
  token: process.env.REDIS_PASSWORD,
})

export default redis
