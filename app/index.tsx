import "../global.css";
import { View, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import custAxios from "@/axios/axios.cust";

const AppPage = () => {
  useEffect(() => {
    const validateAccessToken = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      const refresh_token = await AsyncStorage.getItem("refresh_token");

      if (access_token) {
        router.replace("/(cliemb)/profile");
        return;
      }

      if (refresh_token) {
        try {
          const res = await custAxios.get("auth/refresh");

          await AsyncStorage.setItem("access_token", res.data.access_token);
          await AsyncStorage.setItem("refresh_token", res.data.refresh_token);

          router.replace("/(cliemb)/profile");
        } catch (error) {
          router.replace("/(auth)/login");
        }
        return;
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
