import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn("Turso credentials missing. Using mock data.");
}

export const db = createClient({
  url: url || "",
  authToken: authToken || "",
});
