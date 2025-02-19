import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../TransactionList/types";

type TransactionFormProps = {
  addTransaction: (transaction: Transaction) => void;
};

export default function TransactionForm({ addTransaction }: TransactionFormProps) {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender || !receiver || amount <= 0) return;

    const newTransaction: Transaction = {
      id: uuidv4(),
      sender,
      receiver,
      amount,
      senderConfirmed: false,
      receiverConfirmed: false,
      status: "pending",
      date: new Date().toLocaleString(),
    };

    addTransaction(newTransaction);
    setSender("");
    setReceiver("");
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-3">Tạo giao dịch</h2>
      <input className="border p-2 w-full mb-2" placeholder="Người gửi" value={sender} onChange={(e) => setSender(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Người nhận" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="text" placeholder="Số tiền" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Tạo</button>
    </form>
  );
}
