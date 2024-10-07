// /pages/api/telegram-webhook.ts
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const sendMessage = async (chatId: number, text: string, options = {}) => {
  const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      ...options,
    }),
  });

  return res.json();
};

const answerCallbackQuery = async (callbackQueryId: string, text: string) => {
  const res = await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text,
    }),
  });

  return res.json();
};

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const request = await req.json();
    console.log("🚀 ~ POST ~ request:", request);
    const { message, callback_query } = request;

    if (message) {
      const chatId = message.chat.id;
      const text = message.text;

      // Check for commands
      if (text === "/start") {
        await sendMessage(
          chatId,
          "Welcome to the bot! Choose an option below:",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Open App",
                    web_app: {
                      url: "https://your-mini-app-url.com",
                    },
                  },
                  { text: "Option 2", callback_data: "option_2" },
                ],
              ],
            },
          }
        );
      } else if (text === "/help") {
        await sendMessage(chatId, "Here is how to use this bot:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Contact Support", url: "https://example.com/support" }],
            ],
          },
        });
      } else {
        await sendMessage(
          chatId,
          "I don't recognize that command. Try /start or /help."
        );
      }

      if (callback_query) {
        const chatId = callback_query.message.chat.id;
        const callbackData = callback_query.data;

        // Handle callback queries (button clicks)
        if (callbackData === "option_1") {
          await sendMessage(chatId, "You selected Option 1.");
        } else if (callbackData === "option_2") {
          await sendMessage(chatId, "You selected Option 2.");
        }

        // Answer the callback query to prevent loading icons on Telegram
        await answerCallbackQuery(callback_query.id, "Button clicked!");
      }
    }

    // res.status(200).json({ success: true });

    return NextResponse.json({
      status: 200,
    });
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
// curl -F "url=https://c039-41-184-55-233.ngrok-free.app/api/bot" https://api.telegram.org/bot7321219493:AAHKXfqUa68bcqkhdLrUF_Eqo4AeDvLNfbk/setWebhook
// curl -F "url=https://buffy-tg-server.vercel.app/api/bot" https://api.telegram.org/bot7321219493:AAHKXfqUa68bcqkhdLrUF_Eqo4AeDvLNfbk/setWebhook
// curl "https://api.telegram.org/bot7321219493:AAHKXfqUa68bcqkhdLrUF_Eqo4AeDvLNfbk/getWebhookInfo"
