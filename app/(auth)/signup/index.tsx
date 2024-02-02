import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";

const SignupPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <SafeAreaView>
      <View className='p-4 h-full justify-between'>
        <View className=' border-b border-b-stone-300 py-3'>
          <Text className='mx-2 font-bold w-fit text-xl'>SIGN UP</Text>
        </View>

        <View>
          <View className='flex flex-row'>
            <TextInput
              className='mr-1 flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='First name'></TextInput>
            <TextInput
              className='ml-1 flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='Last name'></TextInput>
          </View>
          <TextInput
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='Email'></TextInput>
          <TextInput
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='SR-CODE'></TextInput>
          <TextInput
            secureTextEntry
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='Password'></TextInput>
          <TextInput
            secureTextEntry
            className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
            placeholder='Confirm password'></TextInput>
          <Pressable
            // disabled={isSigningUp}
            onPress={() => setIsSigningUp(!isSigningUp)}
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
        <View className='flex flex-row justify-center mb-4'>
          <Text>Already have an account?</Text>
          <Link href='/(auth)/login' className='mx-2 font-bold'>
            LOG IN
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupPage;
