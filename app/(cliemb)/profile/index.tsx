import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const ProfileScreen = () => {
  return (
    <SafeAreaView>
      <View className='p-4 h-full '>
        <View className=' border-b border-b-stone-300 py-3'>
          <Text className='mx-2 font-bold w-fit text-xl'>PROFILE</Text>
        </View>
        <View className='h-full flex justify-between py-12'>
          <View>
            <View className='w-full items-center'>
              <Ionicons
                name='person-circle-sharp'
                className='mb-8'
                size={128}
                color='black'
              />
            </View>
            <View className='flex flex-row gap-2'>
              <TextInput
                className='flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='First Name'
              />
              <TextInput
                className='flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Last Name'
              />
            </View>
            <TextInput
              className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='SR-CODE'
            />
            <TextInput
              className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='Emergency Contact No.'
            />
            <TextInput
              className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='Address'
            />
            <TextInput
              className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
              placeholder='Medical Conditions'
            />
            <Pressable className='w-full my-4'>
              <View className='font-bold p-3 rounded-lg  my-2 border'>
                <Text className='font-bold text-center text-black text-bold'>
                  EDIT PROFILE
                </Text>
              </View>
            </Pressable>
          </View>
          <Pressable
            onPress={() =>
              AsyncStorage.multiRemove(["access_token", "refresh_token"], () =>
                router.replace("/(auth)/login")
              )
            }
            className='w-full'>
            <View className='font-bold p-3 rounded-lg  my-2   bg-red-600 '>
              <Text className='font-bold text-center text-white text-bold'>
                LOG OUT
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
