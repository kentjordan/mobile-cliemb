import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";

const ProfileScreen = () => {
  const [isAllInputEditable, setIsAllInputEditable] = useState(false);
  const insets = useSafeAreaInsets();

  const screenHeight = useWindowDimensions().height;

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='p-4' style={{ minHeight: screenHeight - insets.top }}>
          <View className='border-b border-b-stone-300 py-3'>
            <Text className='mx-2 font-bold w-fit text-xl'>PROFILE</Text>
          </View>
          <View className='flex-1 flex justify-between'>
            <View>
              <View className='w-full items-center'>
                <Ionicons
                  name='person-circle-sharp'
                  className='mb-3'
                  size={128}
                  color='black'
                />
              </View>
              {!isAllInputEditable && (
                <Pressable
                  onPress={() => {
                    setIsAllInputEditable(true);
                  }}
                  className='w-full mb-6'>
                  <View className='font-bold rounded-lg'>
                    <Text className='font-bold text-center text-black text-bold'>
                      EDIT PROFILE
                    </Text>
                  </View>
                </Pressable>
              )}
              <View className='flex flex-row gap-2'>
                <TextInput
                  editable={isAllInputEditable}
                  className='flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
                  placeholder='First Name'
                />
                <TextInput
                  editable={isAllInputEditable}
                  className='flex-1 my-2 px-3 py-2 border rounded-lg border-stone-300'
                  placeholder='Last Name'
                />
              </View>
              <TextInput
                editable={isAllInputEditable}
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='SR-CODE'
              />
              <TextInput
                editable={isAllInputEditable}
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Emergency Contact No.'
              />
              <TextInput
                editable={isAllInputEditable}
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Address'
              />
              <TextInput
                editable={isAllInputEditable}
                className='w-full my-2 px-3 py-2 border rounded-lg border-stone-300'
                placeholder='Medical Conditions'
              />
              {isAllInputEditable && (
                <Pressable
                  onPress={() => {
                    setIsAllInputEditable(false);
                  }}
                  className='w-full my-4'>
                  <View className='font-bold p-3 rounded-lg my-2 bg-green-600'>
                    <Text className='font-bold text-center text-white text-bold'>
                      SAVE CHANGES
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
            <Pressable onPress={clearToken} className='w-full'>
              <View className='font-bold p-3 rounded-lg  my-2   border border-red-600 '>
                <Text className='font-bold text-center text-red-600 text-bold'>
                  LOG OUT
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const clearToken = () => {
  AsyncStorage.multiRemove(["access_token", "refresh_token"], () =>
    router.replace("/(auth)/login")
  );
};

export default ProfileScreen;
