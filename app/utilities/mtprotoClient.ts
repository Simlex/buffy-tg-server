// import MTProto from 'telegram-mtproto';
import MTProto from "@mtproto/core";
import path from "path";

const apiId = "24050426"; // Get this from https://my.telegram.org
const apiHash = "16a09b40926f5a6f040f2238437a3c1f"; // Get this from https://my.telegram.org

// const mtproto = MTProto({
//   api: {
//     invokeWithLayer: 0xda9b0d0f, // Use the latest layer version
//     layer: 137, // Update to the current version (check the docs for the latest)
//     initConnection: 0x69796de9,
//     api_id: apiId,
//   },
//   server: {
//     webogram: true,
//     dev: false,
//   },
//   app: {
//     storage: localStorage, // Use a storage provider like localStorage
//   },
// });

const mtproto = new MTProto({
  //   api_id: process.env.TELEGRAM_API_ID, // Your API ID
  //   api_hash: process.env.TELEGRAM_API_HASH, // Your API Hash
  api_id: apiId, // Your API ID
  api_hash: apiHash, // Your API Hash
  storageOptions: {
    // Specify the path to store session data
    path: path.resolve(__dirname, "../../sessions/session.json"),
  },
});

export const getUserAccountAge = async (userId: string) => {
  await authenticateMTProto();
  try {
    // Fetch user info from Telegram
    const user = await mtproto.call("users.getFullUser", {
      id: { _: "inputUser", user_id: userId },
    });

    if (!user) throw new Error("User not found");

    console.log("🚀 ~ getUserAccountAge ~ user:", user);

    // Assume Telegram provides a creation date in user data (pseudo data)
    const accountCreationDate = new Date(user.user.date * 1000); // Convert Unix timestamp
    const currentDate = new Date();

    // Calculate account age
    const ageInMilliseconds =
      currentDate.getTime() - accountCreationDate.getTime();
    const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);
    const ageInYears = ageInDays / 365.25;

    return {
      ageInDays: Math.floor(ageInDays),
      ageInYears: Math.floor(ageInYears),
    };
  } catch (error) {
    console.error("Error fetching account age:", error);
    return null;
  }
};

export async function authenticateMTProto() {
  try {
    const phoneCodeHash = await mtproto.call("auth.sendCode", {
      phone_number: "+2348065926316", // Your phone number
      settings: { _: "codeSettings" },
    });

    // Prompt the user to enter the code they receive
    const userCode = prompt("Enter the code you received:"); // Replace with your input method

    const signInResult = await mtproto.call("auth.signIn", {
      phone_number: "+2348065926316",
      phone_code_hash: phoneCodeHash.phone_code_hash,
      phone_code: userCode,
    });

    console.log("Signed in successfully:", signInResult);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

export default mtproto;
