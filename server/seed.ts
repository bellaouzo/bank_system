import { db } from "./db.ts";
import { accounts, transactions, users } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const [user] = await db
    .insert(users)
    .values({
      username: "johndoe",
      password: "hashed_password_placeholder",
    })
    .onConflictDoNothing()
    .returning();

  const userId = user?.id || "user_1";

  const existingAccounts = await db.select().from(accounts).limit(1);
  
  if (existingAccounts.length === 0) {
    const accountsData = [
      {
        userId,
        type: "Checking",
        name: "Total Checking",
        balance: "4523.50",
        accountNumber: "...8842",
      },
      {
        userId,
        type: "Savings",
        name: "Premier Savings",
        balance: "12500.00",
        accountNumber: "...9921",
      },
      {
        userId,
        type: "Credit Card",
        name: "Freedom Unlimited",
        balance: "842.15",
        accountNumber: "...4550",
      },
      {
        userId,
        type: "Investment",
        name: "Self-Directed Investing",
        balance: "34250.75",
        accountNumber: "...2210",
      },
    ];

    const createdAccounts = await db.insert(accounts).values(accountsData).returning();

    const transactionsData = [
      {
        accountId: createdAccounts[0].id,
        description: "Grocery Store Market",
        amount: "-154.32",
        type: "debit",
        category: "Groceries",
        status: "posted",
        date: new Date("2024-05-15"),
      },
      {
        accountId: createdAccounts[0].id,
        description: "Direct Deposit - Employer Inc",
        amount: "3200.00",
        type: "credit",
        category: "Income",
        status: "posted",
        date: new Date("2024-05-14"),
      },
      {
        accountId: createdAccounts[0].id,
        description: "Electric Company Util",
        amount: "-85.00",
        type: "debit",
        category: "Utilities",
        status: "posted",
        date: new Date("2024-05-14"),
      },
      {
        accountId: createdAccounts[0].id,
        description: "Coffee Shop Brew",
        amount: "-5.40",
        type: "debit",
        category: "Dining",
        status: "posted",
        date: new Date("2024-05-13"),
      },
      {
        accountId: createdAccounts[0].id,
        description: "Transfer to Savings",
        amount: "-500.00",
        type: "debit",
        category: "Transfer",
        status: "posted",
        date: new Date("2024-05-12"),
      },
      {
        accountId: createdAccounts[2].id,
        description: "Gas Station Fuel",
        amount: "-45.00",
        type: "debit",
        category: "Transport",
        status: "pending",
        date: new Date("2024-05-12"),
      },
    ];

    await db.insert(transactions).values(transactionsData);

    console.log("Database seeded successfully!");
  } else {
    console.log("Database already contains data, skipping seed.");
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
