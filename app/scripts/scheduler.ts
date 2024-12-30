import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import fetch from "node-fetch";
import { sendPhotoWithButtons } from "../api/bot/route";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const BATCH_SIZE = 25;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to send messages
// export const sendMessage = async (chatId: string, text: string) => {
//   try {
//     const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ chat_id: chatId, text }),
//     });

//     const data = await res.json();
//     if (!data.ok) {
//       console.error(`Failed to send message to ${chatId}:`, data.description);
//     }
//   } catch (error) {
//     console.error(`Error sending message to ${chatId}:`, error);
//   }
// };

// export const startScheduler = async () => {
//   console.log("Cron job inner function initialized...");

//   let isJobRunning = false;

//   // Cron Job
// //   cron.schedule("* * * * *", async () => { // Run every hour
//     if (isJobRunning) {
//       console.log("Skipping execution as the previous job is still running.");
//       return;
//     }

//     isJobRunning = true;

//     try {
//       console.log("Running daily job to send messages to all users...");

//       // Fetch all users from the database
//       const users = await prisma.users.findMany({ select: { userId: true } });

//       // Send message to all users
//       // for (const user of [{userId: '625250960'}]) {
//       for (const user of users) {
//         //   await sendMessage(
//         //     user.userId,
//         //     "🎉 Hey there! Don't forget to play and earn points on Buffy!"
//         //   );

//         await sendPhotoWithButtons(parseInt(user.userId), {
//           photo: `${"https://res.cloudinary.com/dnrczexeg/image/upload/v1735417812/csfznnmrimk6enxvuggj.jpg"}?${Date.now()}`,
//           caption: `Don't miss out on earning more $BUVEL! Check in today to start farming points and boost your rewards. Your next big win is just a tap away!`,
//         //   caption: `Don't miss out on earning more $BUVEL! Check in today to start farming points and boost your rewards. Your next big win is just a tap away!\n\nTrivia time! Have you answered today's question yet? Jump into the app and complete your daily trivia to rack up some extra points!\n\nFeeling lucky? Roll the dice today and see what rewards await you. Log in now for your chance to win big!\n\nYour daily streak is waiting! Log in now to keep it going and unlock more rewards with each day you check in!\n\nReferral Contest Alert! 🚨 You could win $2121 and 10M $BUVEL! Invite your friends to join the Mini app today and get in on the action. The more referrals, the higher your chances to win big! Start referring now!`,
//         });
//       }

//       console.log("Messages sent to all users.");
//     } catch (error) {
//       console.error("Error running daily job:", error);
//     } finally {
//       isJobRunning = false;
//     }
// //   });
// };

export const startScheduler = async () => {
  console.log("Cron job inner function initialized...");

  let isJobRunning = false;

  // Store progress in a variable or external storage (like Redis or a database)
  let startIndex = 105290; // Set the initial index to start from
  let countDone = 105290; // Set the initial count of users processed

  // Cron Job
  //   cron.schedule("* * * * *", async () => { // Run every hour
  if (isJobRunning) {
    console.log("Skipping execution as the previous job is still running.");
    return;
  }

  isJobRunning = true;

  try {
    console.log("Running daily job to send messages to all users...");

    // Fetch all users from the database
    const users = await prisma.users.findMany({
      select: { userId: true },
      skip: startIndex,
    });

    // Send message to all users
    // for (const user of [{userId: '625250960'}]) {
    // for (const user of users) {
    //   //   await sendMessage(
    //   //     user.userId,
    //   //     "🎉 Hey there! Don't forget to play and earn points on Buffy!"
    //   //   );

    //   await sendPhotoWithButtons(parseInt(user.userId), {
    //     photo: `${"https://res.cloudinary.com/dnrczexeg/image/upload/v1735417812/csfznnmrimk6enxvuggj.jpg"}?${Date.now()}`,
    //     caption: `Don't miss out on earning more $BUVEL! Check in today to start farming points and boost your rewards. Your next big win is just a tap away!`,
    //     //   caption: `Don't miss out on earning more $BUVEL! Check in today to start farming points and boost your rewards. Your next big win is just a tap away!\n\nTrivia time! Have you answered today's question yet? Jump into the app and complete your daily trivia to rack up some extra points!\n\nFeeling lucky? Roll the dice today and see what rewards await you. Log in now for your chance to win big!\n\nYour daily streak is waiting! Log in now to keep it going and unlock more rewards with each day you check in!\n\nReferral Contest Alert! 🚨 You could win $2121 and 10M $BUVEL! Invite your friends to join the Mini app today and get in on the action. The more referrals, the higher your chances to win big! Start referring now!`,
    //   });
    // }
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (user) => {
          try {
            await sendPhotoWithButtons(parseInt(user.userId), {
              photo: `${"https://res.cloudinary.com/dnrczexeg/image/upload/v1735417812/csfznnmrimk6enxvuggj.jpg"}?${Date.now()}`,
              caption: `Don't miss out on earning more $BUVEL! Check in today to start farming points and boost your rewards. Your next big win is just a tap away!`,
            });

            countDone++;

            console.log(`Messages sent to ${countDone} users.`);
          } catch (error) {
            console.error(
              `Error sending message to user ${user.userId}:`,
              error
            );
          }
        })
      );

      // Add a delay between batches to avoid rate limit issues
      await delay(1000); // Wait for 1 second between batches
    }

    console.log("Messages sent to all users.");
  } catch (error) {
    console.error("Error running daily job:", error);
  } finally {
    isJobRunning = false;
  }
  //   });
};

// Prevent the script from exiting immediately
console.log("Cron job initialized...");
