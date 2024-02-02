import "../global.css";
import {
  View,
  Text,
  Button,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useEffect } from "react";

const AppPage = () => {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);
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
