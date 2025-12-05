import { 
  type User, 
  type InsertUser, 
  type Account, 
  type InsertAccount, 
  type Transaction, 
  type InsertTransaction,
  type Transfer,
  type InsertTransfer,
  users,
  accounts,
  transactions,
  transfers
} from "@shared/schema";
import { db } from "./db.ts";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAccounts(userId: string): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(id: number, newBalance: string): Promise<Account>;
  
  getTransactions(accountId?: number): Promise<Transaction[]>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  getTransfers(userId: string): Promise<Transfer[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAccounts(userId: string): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.userId, userId));
  }

  async getAccount(id: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account || undefined;
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db.insert(accounts).values(account).returning();
    return newAccount;
  }

  async updateAccountBalance(id: number, newBalance: string): Promise<Account> {
    const [updated] = await db
      .update(accounts)
      .set({ balance: newBalance })
      .where(eq(accounts.id, id))
      .returning();
    return updated;
  }

  async getTransactions(accountId?: number): Promise<Transaction[]> {
    if (accountId) {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, accountId))
        .orderBy(desc(transactions.date));
    }
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const userAccounts = await this.getAccounts(userId);
    const accountIds = userAccounts.map(acc => acc.id);
    
    if (accountIds.length === 0) return [];
    
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountIds[0]))
      .orderBy(desc(transactions.date));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async createTransfer(transfer: InsertTransfer): Promise<Transfer> {
    const [newTransfer] = await db.insert(transfers).values(transfer).returning();
    return newTransfer;
  }

  async getTransfers(userId: string): Promise<Transfer[]> {
    const userAccounts = await this.getAccounts(userId);
    const accountIds = userAccounts.map(acc => acc.id);
    
    if (accountIds.length === 0) return [];
    
    return await db
      .select()
      .from(transfers)
      .orderBy(desc(transfers.date));
  }
}

export const storage = new DatabaseStorage();
