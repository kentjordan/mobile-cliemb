import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import custAxios from "@/axios/axios.cust";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signupSchema from "@/schemas/signup.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const insets = useSafeAreaInsets();
  const screenDimension = useWindowDimensions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const [signupAs, setSignupAs] = useState<"STUDENT" | "PROFESSOR" | "STAFF">(
    "STUDENT"
  );

  return (
    <SafeAreaView>
      <View className='m-4 border-b border-b-stone-300 py-3'>
        <Text className='mx-2 font-bold w-fit text-xl'>SIGN UP</Text>
      </View>
      <ScrollView>
        <View
          className='p-4 justify-around'
          style={{ height: screenDimension.height - insets.top }}>
          <View>
            <View className='border-b border-b-stone-300 pb-4 flex-row items-center mb-4'>
              <Text className='text-stone-500 mr-4 text-base'>SIGN UP AS:</Text>
              <View className='flex-row gap-2'>
                <Pressable
                  onPress={() => setSignupAs("STUDENT")}
                  className={`border px-2 py-1 rounded ${
                    signupAs === "STUDENT" ? "bg-black" : ""
                  }`}>
                  <Text
                    className={`${signupAs === "STUDENT" ? "text-white" : ""}`}>
                    STUDENT
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSignupAs("PROFESSOR")}
                  className={`border px-2 py-1 rounded  ${
                    signupAs === "PROFESSOR" ? "bg-black" : ""
                  }`}>
                  <Text
                    className={`${
                      signupAs === "PROFESSOR" ? "text-white" : ""
                    }`}>
                    PROFESSOR
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSignupAs("STAFF")}
                  className={`border px-2 py-1 rounded  ${
                    signupAs === "STAFF" ? "bg-black" : ""
                  }`}>
                  <Text
                    className={`${signupAs === "STAFF" ? "text-white" : ""}`}>
                    STAFF
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className='flex flex-row'>
              <Controller
                control={control}
                name='first_name'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='flex-1 mr-1 my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      First Name
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='px-3 py-2 border rounded-lg border-stone-300'
                      placeholder='First name'
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name='last_name'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='flex-1 my-2 ml-1 '>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      Last name
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='px-3 py-2 border rounded-lg border-stone-300'
                      placeholder='Last Name'
                    />
                  </View>
                )}
              />
            </View>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='my-2'>
                  <Text className='text-xs ml-1 mb-2 text-stone-600'>
                    Email
                  </Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className='px-3 py-2 border rounded-lg border-stone-300'
                    placeholder='Email'
                  />
                </View>
              )}
            />
            {signupAs !== "STUDENT" ? null : (
              <Controller
                name='sr_code'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      SR-CODE
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='px-3 py-2 border rounded-lg border-stone-300'
                      placeholder='SR-CODE'
                    />
                  </View>
                )}
              />
            )}
            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='my-2'>
                  <Text className='text-xs ml-1 mb-2 text-stone-600'>
                    Password
                  </Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className='px-3 py-2 border rounded-lg border-stone-300'
                    placeholder='Password'
                  />
                </View>
              )}
            />
            <Controller
              name='confirm_password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='my-2'>
                  <Text className='text-xs ml-1 mb-2 text-stone-600'>
                    Confirm Password
                  </Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className='px-3 py-2 border rounded-lg border-stone-300'
                    placeholder='Confirm Password'
                  />
                </View>
              )}
            />
            <Pressable
              // disabled={isSigningUp}
              onPress={() => {
                setIsSigningUp(true);
                handleSubmit(async (data) => {
                  try {
                    const res = await custAxios.post("auth/signup/user", {
                      ...data,
                      role: signupAs,
                    });

                    // await AsyncStorage.setItem(
                    //   "access_token",
                    //   res.data.access_token
                    // );
                    // await AsyncStorage.setItem(
                    //   "refresh_token",
                    //   res.data.refresh_token
                    // );

                    setIsSigningUp(false);

                    Alert.alert(
                      "Signed up successfully",
                      "Please wait for your account to be approved by an admin.",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            router.replace("/(auth)/login");
                          },
                        },
                      ]
                    );
                  } catch (error) {
                    setIsSigningUp(false);

                    if (error instanceof AxiosError) {
                      console.log(error.response);
                    }
                  }
                })();

                const hasErrors = Object.keys(errors).length > 0;

                if (hasErrors) {
                  const message = Object.keys(errors)
                    .map(
                      (key, index) =>
                        `${key.toUpperCase()}: ${errors[key]?.message}`
                    )
                    .join("\n");

                  Alert.alert("Error: check your input", message, [
                    {
                      onPress(value) {
                        setIsSigningUp(false);
                      },
                    },
                  ]);
                }
              }}
              className='w-full my-4'>
              <View className='font-bold p-3 rounded-lg  my-2   bg-black '>
                {isSigningUp ? (
                  <ActivityIndicator className='text-white' />
                ) : (
                  <Text className='font-bold text-center text-white text-bold'>
                    SIGN UP
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
          <View className='flex flex-row justify-center mb-12'>
            <Text>Already have an account?</Text>
            <Link href='/(auth)/login' className='mx-2 font-bold'>
              LOG IN
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupPage;
