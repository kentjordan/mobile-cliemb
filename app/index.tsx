import "../global.css";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import {
  View,
  Image,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import custAxios from "@/axios/axios.cust";
import TokenExpiredError from "@/exceptions/TokenExpired.error";
import { AxiosError } from "axios";

const AppPage = () => {
  useEffect(() => {
    const validateAccessToken = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      const refresh_token = await AsyncStorage.getItem("refresh_token");

      if (access_token && refresh_token) {
        try {
          const decodedAT = jwtDecode(access_token);
          const decodedRT = jwtDecode(refresh_token);

          const isAccessTokenExpired =
            (decodedAT.exp as any) < Math.ceil(Date.now() / 1000);

          const isRefreshTokenExpired =
            (decodedRT.exp as any) < Math.ceil(Date.now() / 1000);

          if (isRefreshTokenExpired) {
            throw new TokenExpiredError();
          }

          if (isAccessTokenExpired) {
            try {
              const res = await custAxios.patch("auth/refresh/user", {
                refresh_token,
              });
              await AsyncStorage.setItem("access_token", res.data.access_token);
              await AsyncStorage.setItem(
                "refresh_token",
                res.data.refresh_token
              );

              router.replace("/(cliemb)/levels");
            } catch (error) {
              Alert.alert("Error", "We can't reach the server.", [
                {
                  onPress(value) {
                    BackHandler.exitApp();
                  },
                },
              ]);
            }
          }
          router.replace("/(cliemb)/levels");

          return;
        } catch (error) {
          if (
            error instanceof TokenExpiredError ||
            error instanceof AxiosError
          ) {
            router.replace("/(auth)/login");
          }
        }
      }

      router.replace("/(auth)/login");
    };
    validateAccessToken();
  }, []);

  return (
    <View className='flex bg-white h-full items-center justify-center'>
      <Image
        className='w-52 h-80 mb-16'
        source={require("../assets/images/cliemb_logo.png")}
      />
      <ActivityIndicator size={32} color='black' />
    </View>
  );
};

export default AppPage;
