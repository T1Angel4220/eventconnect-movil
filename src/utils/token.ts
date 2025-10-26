import { PROJECT_ID } from "@/src/constants";
import * as Device from "expo-device";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import { Platform } from "react-native";

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "default",
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.error("Push notifications are not supported on emulators.");
    return;
  }

  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error(
      "Permission not granted to get push token for push notification!",
    );
    return;
  }
  const projectId = PROJECT_ID;

  if (!projectId) {
    console.error("Project ID not found");
  }
  try {
    const pushTokenString = (
      await getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } catch (e: unknown) {
    console.error(`${e}`);
  }
};

export { registerForPushNotificationsAsync };
