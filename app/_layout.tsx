import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(auth)/login/index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(auth)/signup/index'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
