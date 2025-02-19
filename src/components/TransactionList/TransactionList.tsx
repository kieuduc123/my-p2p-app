import { useEffect, useState } from "react";
import { Transaction } from "./types";

type TransactionListProps = {
  transactions: Transaction[];
  confirmSender: (id: string) => void;
  confirmReceiver: (id: string) => void;
  cancelTransaction: (id: string) => void;
};

const TIME_LIMIT = 60; // 60 giây

export default function TransactionList({ transactions, confirmSender, confirmReceiver, cancelTransaction }: TransactionListProps) {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
useEffect(() => {
  const interval = setInterval(() => {
    const newTimeLeft: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      if (tx.status === "pending") {
        let createdTime = new Date(tx.date).getTime();

        // 🔥 Nếu ngày không hợp lệ, gán lại thời gian hiện tại
        if (isNaN(createdTime)) {
          console.error("Lỗi ngày tháng không hợp lệ:", tx.date);
          createdTime = Date.now();
        }

        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - createdTime) / 1000);
        const remaining = Math.max(0, TIME_LIMIT - elapsedSeconds);

        if (remaining === 0) {
          cancelTransaction(tx.id); // 🛑 Hủy giao dịch nếu hết thời gian
        }

        newTimeLeft[tx.id] = remaining;
      }
    });

    setTimeLeft(newTimeLeft);
  }, 1000);

  return () => clearInterval(interval);
}, [transactions]);


  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-lg font-semibold mb-3">Lịch sử giao dịch</h2>
      <ul className="space-y-2">
        {transactions.map((tx) => (
          <li key={tx.id} className="p-2 border rounded-md shadow-md">
            <p>
              <strong>{tx.sender}</strong> → <strong>{tx.receiver}</strong>
            </p>
            <p>Số tiền: <strong>${tx.amount}</strong></p>
          <p>
  Trạng thái:{" "}
  <span className={
    tx.status === "completed" ? "text-green-600" : 
    tx.status === "canceled" ? "text-gray-500" : 
    "text-red-600"
  }>
    {tx.status === "pending" ? "Đang chờ..." : tx.status === "canceled" ? "Đã hủy" : "Hoàn tất"}
  </span>
</p>

            <p>Ngày: {new Date(tx.date).toLocaleString('vi')}</p>

            {/* Hiển thị đếm ngược */}
            {tx.status === "pending" && timeLeft[tx.id] !== undefined && (
              <p className="text-sm text-gray-600">
                Thời gian còn lại: <strong>{timeLeft[tx.id]} giây</strong>
              </p>
            )}

            {/* Nút xác nhận */}
            {tx.status === "pending" && (
              <div className="mt-2 flex space-x-2">
                {!tx.senderConfirmed && (
                  <button onClick={() => confirmSender(tx.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Người gửi: Xác nhận
                  </button>
                )}
                {!tx.receiverConfirmed && (
                  <button onClick={() => confirmReceiver(tx.id)} className="bg-green-500 text-white px-3 py-1 rounded-md">
                    Người nhận: Xác nhận
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
