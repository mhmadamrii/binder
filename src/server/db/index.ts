// import postgres from "postgres";
// import * as schema from "./schema";

// import { drizzle } from "drizzle-orm/postgres-js";
// import { env } from "~/env";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   conn: postgres.Sql | undefined;
// };

// const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// export const db = drizzle(conn, { schema });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { env } from "~/env";

/**
 * Use a global cached pool in development to prevent creating
 * a new DB connection on every hot reload (HMR).
 */
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
  db: ReturnType<typeof drizzle> | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    ssl:
      env.NODE_ENV === "production"
        ? { rejectUnauthorized: false } // Supabase requires SSL in prod
        : false,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = globalForDb.db ?? drizzle(pool, { schema });

if (env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
