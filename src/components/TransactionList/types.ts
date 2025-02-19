export type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
  status: "pending" | "completed" | "canceled"; // 🔥 Thêm "canceled"
  date: string; // 🔥 Đảm bảo date là string
};
