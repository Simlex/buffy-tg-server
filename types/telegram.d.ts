import { WebApp } from "@/app/models/ITelegramWebApp";

// telegram.d.ts
export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp
    //   {
    //     initData: string;
    //     initDataUnsafe: {
    //       user: {
    //         id: number;
    //         first_name: string;
    //         last_name?: string;
    //         username?: string;
    //         language_code?: string;
    //       };
    //     };
    //     MainButton: {
    //       text: string;
    //       color: string;
    //       isVisible: boolean;
    //       show(): void;
    //       hide(): void;
    //       onClick(callback: () => void): void;
    //     };
    //     close(): void;
    //     setBackgroundColor(color: string): void;
    //     setHeaderColor(color: string): void;
    //     themeParams: {
    //       bg_color: string;
    //       text_color: string;
    //       hint_color: string;
    //       link_color: string;
    //       button_color: string;
    //       button_text_color: string;
    //     };
    //     showAlert(message: string, callback?: () => void): void;

    //     BiometricManager: {
    //       isInited: boolean;
    //       isBiometricAvailable: boolean;
    //       biometricType: "finger" | "face" | "unknown";
    //       isAccessRequested: boolean;
    //       isAccessGranted: boolean;
    //       isBiometricTokenSaved: boolean;
    //       deviceId: string;

    //       init(callback?: () => void): BiometricManager;
    //       requestAccess(
    //         params: BiometricRequestAccessParams,
    //         callback?: (granted: boolean) => void
    //       ): BiometricManager;
    //       authenticate(
    //         params: BiometricAuthenticateParams,
    //         callback?: (success: boolean, token?: string) => void
    //       ): BiometricManager;
    //       updateBiometricToken(
    //         token: string,
    //         callback?: (updated: boolean) => void
    //       ): BiometricManager;
    //       openSettings(): BiometricManager;
    //     };

    //     HapticFeedback: {
    //       /**
    //        * Triggers an impact haptic feedback.
    //        * @param style - The style of impact, can be 'light', 'medium', 'heavy', 'rigid', or 'soft'.
    //        * @returns HapticFeedback object for method chaining.
    //        */
    //       impactOccurred(
    //         style: "light" | "medium" | "heavy" | "rigid" | "soft"
    //       ): HapticFeedback;

    //       /**
    //        * Triggers a notification haptic feedback.
    //        * @param type - The type of notification, can be 'error', 'success', or 'warning'.
    //        * @returns HapticFeedback object for method chaining.
    //        */
    //       notificationOccurred(
    //         type: "error" | "success" | "warning"
    //       ): HapticFeedback;

    //       /**
    //        * Triggers a selection change haptic feedback.
    //        * Use this only when the user changes a selection, not when they make or confirm one.
    //        * @returns HapticFeedback object for method chaining.
    //        */
    //       selectionChanged(): HapticFeedback;
    //     };
    //   };
    };
  }

//   interface HapticFeedback {
//     impactOccurred(
//       style: "light" | "medium" | "heavy" | "rigid" | "soft"
//     ): HapticFeedback;
//     notificationOccurred(type: "error" | "success" | "warning"): HapticFeedback;
//     selectionChanged(): HapticFeedback;
//   }
//   interface BiometricRequestAccessParams {
//     reason?: string; // Optional text explaining the reason for requesting access, max 128 characters
//   }

//   interface BiometricAuthenticateParams {
//     reason?: string; // Optional text explaining the reason for authentication, max 128 characters
//   }

//   interface BiometricManager {
//     isInited: boolean;
//     isBiometricAvailable: boolean;
//     biometricType: "finger" | "face" | "unknown";
//     isAccessRequested: boolean;
//     isAccessGranted: boolean;
//     isBiometricTokenSaved: boolean;
//     deviceId: string;

//     init(callback?: () => void): BiometricManager;
//     requestAccess(
//       params: BiometricRequestAccessParams,
//       callback?: (granted: boolean) => void
//     ): BiometricManager;
//     authenticate(
//       params: BiometricAuthenticateParams,
//       callback?: (success: boolean, token?: string) => void
//     ): BiometricManager;
//     updateBiometricToken(
//       token: string,
//       callback?: (updated: boolean) => void
//     ): BiometricManager;
//     openSettings(): BiometricManager;
//   }
}
