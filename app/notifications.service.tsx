import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
} from "expo-notifications";

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;

  // pedir permisos
  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("No se concedieron permisos de notificación!");
    return;
  }

  // obtener token de Expo
  token = (await getExpoPushTokenAsync()).data;
  console.log("Expo push token:", token);

  return token;
}

export { registerForPushNotificationsAsync };
