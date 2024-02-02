import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <SafeAreaView>
      <View className='flex p-4 bg-white h-full justify-between items-center'>
        <Image
          className='w-32 h-52 mt-4'
          source={require("@/assets/images/cliemb_logo.png")}
        />
        <View className='w-full items-center '>
          <TextInput
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='Email'></TextInput>
          <TextInput
            secureTextEntry
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='Password'></TextInput>
          <Pressable
            // disabled={isSigningUp}
            onPress={() => setIsLoggingIn(!isLoggingIn)}
            className='w-full my-4'>
            <View className='font-bold p-3 rounded-lg  my-2   bg-black '>
              {isLoggingIn ? (
                <ActivityIndicator className='text-white' />
              ) : (
                <Text className='font-bold text-center text-white text-bold'>
                  LOG IN
                </Text>
              )}
            </View>
          </Pressable>
        </View>
        <View className='flex flex-row mb-4'>
          <Text>Dont have an account?</Text>
          <Link href='/(auth)/signup' className='mx-2 font-bold'>
            SIGN UP
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
