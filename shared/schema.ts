import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  balance: text("balance").notNull().default("0"),
  accountNumber: text("account_number").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  date: integer("date", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("posted"),
});

export const transfers = sqliteTable("transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromAccountId: integer("from_account_id").notNull().references(() => accounts.id),
  toAccountId: integer("to_account_id").notNull().references(() => accounts.id),
  amount: text("amount").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  memo: text("memo"),
  status: text("status").notNull().default("completed"),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertTransferSchema = createInsertSchema(transfers).omit({ id: true });

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
