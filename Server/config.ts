import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
export const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
export const OPENAI_API = process.env.OPENAI_API;