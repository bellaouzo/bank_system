import { db } from "./db.ts";
import { users, accounts, transactions, transfers } from "@shared/schema";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  console.log("Clearing all database data...");

  try {
    await db.delete(transfers);
    console.log("✓ Cleared transfers");
    
    await db.delete(transactions);
    console.log("✓ Cleared transactions");
    
    await db.delete(accounts);
    console.log("✓ Cleared accounts");
    
    await db.delete(users);
    console.log("✓ Cleared users");

    console.log("\nDatabase cleared successfully!");
    console.log("You can now run 'npm run db:push' to recreate the schema if needed.");
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }

  process.exit(0);
}

resetDatabase();

