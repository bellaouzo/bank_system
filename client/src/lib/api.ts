import type { Account, Transaction, Transfer } from "@shared/schema";

const API_BASE = "/api";

export async function fetchAccounts(): Promise<Account[]> {
  const response = await fetch(`${API_BASE}/accounts`);
  if (!response.ok) throw new Error("Failed to fetch accounts");
  return response.json();
}

export async function fetchAccount(id: number): Promise<Account> {
  const response = await fetch(`${API_BASE}/accounts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch account");
  return response.json();
}

export async function fetchTransactions(accountId?: number): Promise<Transaction[]> {
  const url = accountId 
    ? `${API_BASE}/transactions?accountId=${accountId}`
    : `${API_BASE}/transactions`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
}

export async function createAccount(data: {
  userId: string;
  type: string;
  name: string;
  balance?: string;
  accountNumber: string;
}): Promise<Account> {
  const response = await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create account");
  }
  return response.json();
}

export async function deleteAccount(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/accounts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete account");
  }
}

export async function createTransfer(data: {
  fromAccountId: number;
  toAccountId: number;
  amount: string;
  memo?: string;
}): Promise<Transfer> {
  const response = await fetch(`${API_BASE}/transfers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create transfer");
  }
  return response.json();
}
