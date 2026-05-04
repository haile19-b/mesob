import * as zod from "zod"
import dotenv from "dotenv"
dotenv.config()

const envSchema = zod.object({
    PORT: zod.string().default("5000"),
    JWT_SECRET: zod.string(),
    DATABASE_URL: zod.string(),
})

export const env = envSchema.parse(process.env);