import store from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(auth)/login/index' />
        <Stack.Screen name='(auth)/signup/index' />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
