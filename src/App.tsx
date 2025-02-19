import React, { useEffect } from "react";
import "./App.css";
import { Transaction } from "./components/TransactionList/types";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionList from "./components/TransactionList";

const STORAGE_KEY = "p2p_transactions";
const channel = new BroadcastChannel("p2p_channel");

// Load dữ liệu từ localStorage khi mở trang
const loadTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Lưu vào localStorage
const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

function App() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(loadTransactions());

  // Nhận dữ liệu từ BroadcastChannel khi có giao dịch mới
  useEffect(() => {
    channel.onmessage = (event) => {
      setTransactions(event.data);
    };
  }, []);

  // Khi tạo giao dịch, cập nhật cả localStorage & BroadcastChannel
 const addTransaction = (tx: Transaction) => {
  const newTransaction = {
    ...tx,
    date: new Date().toISOString(), // 🔥 Gán thời gian tạo khi tạo giao dịch
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedTransactions : any= [newTransaction, ...transactions];
  setTransactions(updatedTransactions);
  saveTransactions(updatedTransactions);
  channel.postMessage(updatedTransactions); // Gửi sự kiện đến các tab khác
};


  // Xác nhận từ người gửi
const confirmSender = (id: string) => {
  const updatedTransactions: Transaction[] = transactions.map((tx) =>
    tx.id === id ? { ...tx, senderConfirmed: true, status: tx.receiverConfirmed ? "completed" : "pending" } : tx
  );
  setTransactions(updatedTransactions);
  saveTransactions(updatedTransactions);
  channel.postMessage(updatedTransactions);
};

const confirmReceiver = (id: string) => {
  const updatedTransactions: Transaction[] = transactions.map((tx) =>
    tx.id === id ? { ...tx, receiverConfirmed: true, status: tx.senderConfirmed ? "completed" : "pending" } : tx
  );
  setTransactions(updatedTransactions);
  saveTransactions(updatedTransactions);
  channel.postMessage(updatedTransactions);
};

const cancelTransaction = (id: string) => {
  const updatedTransactions: Transaction[] = transactions.map((tx) =>
    tx.id === id ? { ...tx, status: "canceled" } : tx
  );
  setTransactions(updatedTransactions);
  saveTransactions(updatedTransactions);
  channel.postMessage(updatedTransactions);
};



  return (
    <div className="max-w-lg mx-auto mt-10 space-y-4">
      <TransactionForm addTransaction={addTransaction} />
      <TransactionList transactions={transactions} confirmSender={confirmSender} confirmReceiver={confirmReceiver} cancelTransaction={cancelTransaction} />
    </div>
  );
}

export default App;
