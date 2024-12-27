// /pages/api/telegram-webhook.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const WEB_APP_URL = "https://buffy-tg-server.vercel.app";
// const WEB_APP_URL = "https://2c10-41-184-8-14.ngrok-free.app";

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

// const sendPhoto = async (
//   chatId: number,
//   { photo, caption }: { photo: string; caption: string }
// ) => {
//   const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       chat_id: chatId,
//       photo,
//       caption,
//     }),
//   });

//   return res.json();
// };

const sendPhotoWithButtons = async (
  chatId: number,
  { photo, caption }: { photo: string; caption: string },
  options = {}
) => {
  const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo,
      caption,
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
      const user_name = message.chat.username;
      const user_id = message.chat.id;
      const text: string = message.text;
    //   const trivia_link = "https://x.com/BuffyDurov";

      // Check for commands
      if (text === "/start" || text.startsWith("/start") || (!text && user_id)) {
        // const messageText = (refName?: string) => `
        // Welcome ${user_name ?? ""} to BUFFY DUROV! 🐩 ${
        //   refName ? `You were referred by ${refName}\n` : " "
        // }Tap to watch your balance rise.\n\nExplore BUFFY DUROV on TON, the dog-themed platform that rewards you for playing. Don’t miss our daily trivia on our X! ${trivia_link}\n\nPoints accumulated convert to $BUVEL tokens for all players.\n\nInvite friends and family for more $BUVEL rewards! More woof buddies🐩, more earnings.\n\n——————————————————\n\nИсследуйте BUFFY DUROV 🐩 на платформе TON и зарабатывайте токены $BUVEL.\nПриглашайте друзей для получения\nдополнительные наград $BUVEL.
        // `;
        const messageText = (refName?: string) => `
        🐩 Welcome ${user_name ?? ""} to BUFFY DUROV! ${
          refName ? `You were referred by ${refName}\n` : " "
        }🎮 Play games, earn points, and unlock exciting rewards like $BUVEL tokens and exclusive NFTs.\n\n🎲 Roll the dice, 🖱️ tap to win, and 🚀 boost your rewards by inviting friends!\n\nStart your BUFFY adventure now! 🐩✨
        `;

        // Split the text to extract the referral ID (if it exists)
        const params = text.split(" ");
        // console.log("🚀 ~ text:", text);
        const referralId = params[1] || null;
        let referrerName: string | undefined;
          
        // console.log("🚀 ~ user_id:", user_id)
        // console.log("🚀 ~ user_name:", user_name)

        // check if a user with the userId already exist in the database
        const user = await prisma.users.findUnique({
          where: {
            userId: `${user_id}`,
          },
        });

        // console.log("🚀 ~ user:", user)

        // If the user does not exist, create a new user
        if (!user) {
          await sendMessage(chatId, "Analyzing new account...");

          await prisma.users.create({
            data: {
              userId: `${user_id}`,
              username: `${user_name}`,
              referralCode: `${user_name}${user_id}`,
            },
          });

          if (referralId) {
            const referrer = await prisma.users.findUnique({
              where: {
                referralCode: referralId,
                // AND:  {
                //     id: {
                //         not: `${user_id}`
                //     }
                // }
              },
              select: {
                username: true,
              },
            });

            referrerName = referrer?.username;
          }
        }

        // Log or use the referralId
        console.log(`Referral ID: ${referralId}`);

        // Constructing the URL for the web app
        // const webAppUrl = `https://buffy-clicker.netlify.app?id=${user_id}&userName=${user_name}${
        const webAppUrl = `${WEB_APP_URL}?id=${user_id}&userName=${user_name}${
          referralId ? `&referralId=${referralId}` : ""
        }`;

        await sendPhotoWithButtons(
          chatId,
          {
            photo:
              "https://res.cloudinary.com/dnrczexeg/image/upload/v1722264808/WhatsApp_Image_2024-07-29_at_14.14.57_08b79202_s6yygf.jpg",
            caption: messageText(referrerName),
          },
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Open App",
                    web_app: {
                      url: webAppUrl,
                    },
                  },
                ],
                [
                  {
                    text: "Join BUFFY DUROV Community 💎",
                    url: "http://t.me/BuffyDurov",
                  },
                  //   [
                  //   {
                  //     text: "Option 3",
                  //     callback_data: "option_3",
                  //   },
                  //   ]
                ],
              ],
            },
          }
        );

        // await sendPhoto(chatId, {
        //   photo:
        //     "https://res.cloudinary.com/dnrczexeg/image/upload/v1722264808/WhatsApp_Image_2024-07-29_at_14.14.57_08b79202_s6yygf.jpg",
        //   caption: `Welcome ${user_name} to BUFFY DUROV! 🐩 Tap to watch your balance rise.\n\nExplore BUFFY DUROV on TON, the dog-themed platform that rewards you for playing. Don’t miss our daily trivia on our X! ${trivia_link}\n\nPoints accumulated convert to $BUVEL tokens for all players.\n\nInvite friends and family for more $BUVEL rewards! More woof buddies🐩, more earnings.\n\n——————————————————\n\nИсследуйте BUFFY DUROV 🐩 на платформе TON и зарабатывайте токены $BUVEL.\n\nПриглашайте друзей для получения\nдополнительных наград $BUVEL.`,
        // });

        // await sendMessage(
        //   chatId,
        //   //   "Welcome to the bot! Choose an option below:",
        //   messageText,
        //   {
        //     reply_markup: {
        //       inline_keyboard: [
        //         [
        //           {
        //             text: "Open App",
        //             web_app: {
        //               url: webAppUrl,
        //             },
        //           },
        //           { text: "Option 2", callback_data: "option_2" },
        //         ],
        //       ],
        //     },
        //   }
        // );
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
// curl -F "url=https://4dc8-102-88-36-243.ngrok-free.app/api/bot" https://api.telegram.org/bot6277421390:AAEdpn0AcM9v4VEw6NA3qCOnwQg6Ez5Z5hA/setWebhook
// curl -F "url=https://buffy-tg-server.vercel.app/api/bot" https://api.telegram.org/bot6277421390:AAEdpn0AcM9v4VEw6NA3qCOnwQg6Ez5Z5hA/setWebhook
// curl "https://api.telegram.org/bot6277421390:AAEdpn0AcM9v4VEw6NA3qCOnwQg6Ez5Z5hA/getWebhookInfo"
