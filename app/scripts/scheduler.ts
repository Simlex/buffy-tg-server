import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import fetch from "node-fetch";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Function to send messages
export const sendMessage = async (chatId: string, text: string) => {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error(`Failed to send message to ${chatId}:`, data.description);
    }
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
  }
};

export const startScheduler = () => {
  console.log("Cron job inner function initialized...");
  // Cron Job
  cron.schedule("* * * * *", async () => {
    console.log("Running daily job to send messages to all users...");

    // Fetch all users from the database
    // const users = await prisma.users.findMany({ select: { userId: true } });

    // Send message to all users
    for (const user of [{userId: '625250960'}]) {
      await sendMessage(
        user.userId,
        "🎉 Hey there! Don't forget to play and earn points on Buffy!"
      );
    }

    console.log("Messages sent to all users.");
  });
};

// Prevent the script from exiting immediately
console.log("Cron job initialized...");
