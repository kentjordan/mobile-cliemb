import store from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='(cliemb)/levels/index'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='(cliemb)/profile/index'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='(cliemb)/details/index'
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
    </Provider>
  );
};

export default RootLayout;
