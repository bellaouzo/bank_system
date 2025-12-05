import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { insertAccountSchema, insertTransactionSchema, insertTransferSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/accounts", async (req, res) => {
    try {
      const userId = "user_1";
      const accounts = await storage.getAccounts(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.getAccount(id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = "user_1";
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : undefined;
      
      let transactions;
      if (accountId) {
        transactions = await storage.getTransactions(accountId);
      } else {
        transactions = await storage.getTransactionsByUser(userId);
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      const account = await storage.getAccount(validatedData.accountId);
      if (account) {
        const currentBalance = parseFloat(account.balance);
        const transactionAmount = parseFloat(validatedData.amount);
        const newBalance = (currentBalance + transactionAmount).toFixed(2);
        await storage.updateAccountBalance(validatedData.accountId, newBalance);
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const validatedData = insertTransferSchema.parse(req.body);
      
      const fromAccount = await storage.getAccount(validatedData.fromAccountId);
      const toAccount = await storage.getAccount(validatedData.toAccountId);
      
      if (!fromAccount || !toAccount) {
        return res.status(404).json({ error: "Account not found" });
      }
      
      const transferAmount = parseFloat(validatedData.amount);
      const fromBalance = parseFloat(fromAccount.balance);
      
      if (fromBalance < transferAmount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }
      
      const newFromBalance = (fromBalance - transferAmount).toFixed(2);
      const newToBalance = (parseFloat(toAccount.balance) + transferAmount).toFixed(2);
      
      await storage.updateAccountBalance(validatedData.fromAccountId, newFromBalance);
      await storage.updateAccountBalance(validatedData.toAccountId, newToBalance);
      
      await storage.createTransaction({
        accountId: validatedData.fromAccountId,
        description: `Transfer to ${toAccount.name}`,
        amount: (-transferAmount).toString(),
        type: "debit",
        category: "Transfer",
        status: "posted",
      });
      
      await storage.createTransaction({
        accountId: validatedData.toAccountId,
        description: `Transfer from ${fromAccount.name}`,
        amount: transferAmount.toString(),
        type: "credit",
        category: "Transfer",
        status: "posted",
      });
      
      const transfer = await storage.createTransfer(validatedData);
      res.status(201).json(transfer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to process transfer" });
    }
  });

  return httpServer;
}
