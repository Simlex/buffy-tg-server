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
            const welcomeMessage = `Welcome ${userName} to BUFFY DUROV! 🐩`;

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

// Function to send a message with inline buttons via Telegram Bot API
async function sendTelegramMessageWithButtons(chatId, text) {
    const inlineKeyboard = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Start now 🐩', callback_data: 'start' }],
                [{ text: 'Join BUFFY DUROV Community 💎', url: 'http://t.me/BuffyDurov' }]
            ]
        })
    };

    try {
        await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: text,
            ...inlineKeyboard,
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}