import custAxios from "@/axios/axios.cust";
import { AxiosError } from "axios";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "@/schemas/login.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    const message = Object.keys(errors)
      .map((key, index) => `${key.toUpperCase()}: ${errors[key]?.message}`)
      .join("\n");

    Alert.alert("Error", message);
  }
  return (
    <SafeAreaView>
      <View className='flex p-4 bg-white h-full justify-between items-center'>
        <Image
          className='w-32 h-52 mt-4'
          source={require("@/assets/images/cliemb_logo.png")}
        />
        <View className='w-full items-center '>
          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                secureTextEntry
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Password'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Pressable
            disabled={isLoggingIn}
            onPress={handleSubmit((data) => {
              const login = async () => {
                try {
                  setIsLoggingIn(true);

                  const res = await custAxios.post(
                    "auth/login/student",
                    {
                      email: data.email,
                      password: data.password,
                    },
                    { timeout: 10000 }
                  );

                  setIsLoggingIn(false);

                  const { access_token, refresh_token } = res.data as {
                    access_token: string;
                    refresh_token: string;
                  };

                  await AsyncStorage.setItem("access_token", access_token);
                  await AsyncStorage.setItem("refresh_token", refresh_token);

                  router.replace("/(cliemb)/profile");
                } catch (error) {
                  setIsLoggingIn(false);
                  if (error instanceof AxiosError) {
                    switch (error.response?.status) {
                      case 400:
                        Alert.alert(
                          "Error",
                          "Invalid password. Please try again."
                        );
                        break;
                      case 404:
                        Alert.alert("Error", "Account was not found.");
                        break;

                      default:
                        Alert.alert(
                          "Error",
                          "Server can't be reached. Please try again."
                        );
                        console.log(JSON.stringify({ ...error }, null, 4));
                        break;
                    }
                  }
                }
              };
              login();
            })}
            className='w-full my-4'>
            <View className='font-bold p-3 rounded-lg  my-2 bg-black '>
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
