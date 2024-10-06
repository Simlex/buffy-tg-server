const axios = require('axios');
require('dotenv').config(); // Load environment variables

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Netlify function handler
exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const message = body.message;

        if (!message) {
            return {
                statusCode: 200,
                body: 'No message received',
            };
        }

        const chatId = message.chat.id;
        const text = message.text;

        // Handle /start command
        if (text && text.toLowerCase().startsWith('/start')) {
            const userName = message.from.username || 'User';
            // const welcomeMessage = `Welcome ${userName} to Simlex Bot! 🐩`;
            const welcomeMessage = `Welcome ${userName} to BUFFY DUROV! 🐩 Tap to watch your balance rise.\n\n` +
        `Explore BUFFY DUROV on TON, the dog-themed platform that rewards you for playing. Don’t miss our daily trivia on our X! triviaLink\n\n` +
        `Points accumulated convert to $BUVEL tokens for all players.\n\n` +
        `Invite friends and family for more $BUVEL rewards! More woof buddies🐩, more earnings.\n\n` +
        `——————————————————\n\n` +
        `Исследуйте BUFFY DUROV 🐩 на платформе TON и зарабатывайте токены $BUVEL.\n\n` +
        `Приглашайте друзей для получения \nдополнительных наград $BUVEL.\n\n` +
        `💲 Don't waste your time – make every second count. Tap and earn with our Time Farm app!\n\n` +
        `We have some exciting news! We’re launching our Telegram mini app, so you can start accumulating points right now from your phone or desktop! ` +
        `And who knows what incredible rewards will soon be available...\n\n` +
        `🚀 Open the app every 4 hours to claim your points. Start now to get ready for future campaigns.`;

            // Send a reply to the user
            await sendTelegramMessage(chatId, welcomeMessage);
        } else {
            // Echo message
            await sendTelegramMessage(chatId, `You said: ${text}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success' }),
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

// Function to send a message via Telegram Bot API
async function sendTelegramMessage(chatId, text) {
    try {
        await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: text,
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
