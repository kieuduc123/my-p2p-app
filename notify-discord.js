import axios from 'axios';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1354279092979105875/3xRSjJLF9alY7_3CRzdFYwVrYXBQxR7RFYDBXaXcLzrnZ6ToY-NWoXk271QW0ZOJAciE';

const sendToDiscord = async (message) => {
    try {
        console.log("📢 Đang gửi thông báo đến Discord...");
        const response = await axios.post(DISCORD_WEBHOOK_URL, { content: message });
        console.log("✅ Gửi thành công!", response.data);
    } catch (error) {
        console.error('🚨 Không thể gửi thông báo Discord:', error.response?.data || error.message);
    }
};

// Gửi lỗi build
sendToDiscord('🚨 Build thất bại! Kiểm tra lại logs trên GitHub Actions hoặc máy local.');
