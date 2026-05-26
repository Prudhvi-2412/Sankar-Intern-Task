import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;