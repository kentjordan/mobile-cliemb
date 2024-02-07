import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useLayoutEffect, useState } from "react";
import useStudentProfile from "@/hooks/useStudentProfile";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import custAxios from "@/axios/axios.cust";
import { Feather } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import profileSchema from "@/schemas/profile.schema";

const ProfileScreen = () => {
  const [isAllInputEditable, setIsAllInputEditable] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const insets = useSafeAreaInsets();
  const screenHeight = useWindowDimensions().height;

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const { isFetching, user } = useStudentProfile();

  // Populate TextInputs by student profile
  useLayoutEffect(() => {
    if (user) {
      Object.keys(user).forEach((key) => {
        if (key === "emergency_no" || key === "medical_conditions") {
          setValue(key, assembleArray(user[key] as string[]));
        } else {
          setValue(key, user[key]);
        }
      });
    }
  }, [user]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='p-4' style={{ minHeight: screenHeight - insets.top }}>
          <View className='flex flex-row border-b border-b-stone-300 py-3'>
            <Text className='mx-2 font-bold w-fit text-3xl'>Profile</Text>
          </View>
          {isFetching && <ActivityIndicator color='black' size={32} />}
          {!isFetching && (
            <View className='flex-1 flex justify-between'>
              <View>
                <View className='w-full items-center my-4'>
                  <Ionicons
                    name='person-circle-sharp'
                    // className='mb-3'
                    size={96}
                    color='black'
                  />
                </View>
                {!isAllInputEditable && (
                  <Pressable
                    onPress={() => {
                      setIsAllInputEditable(true);
                    }}
                    className='w-full mb-6'>
                    <View className='flex flex-row justify-center items-center font-bold rounded-lg'>
                      <Feather
                        name='edit-2'
                        className='mx-1'
                        size={12}
                        color='black'
                      />
                      <Text className='font-bold text-center text-black text-bold text-sm'>
                        Edit Profile
                      </Text>
                    </View>
                  </Pressable>
                )}
                <View className='flex flex-row gap-2'>
                  <Controller
                    control={control}
                    name='first_name'
                    render={({ field: { onBlur, onChange, value } }) => {
                      return (
                        <View className='flex-1 my-2'>
                          <Text className='text-xs ml-1 mb-2 text-stone-600'>
                            First name
                          </Text>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            editable={isAllInputEditable}
                            className='px-3 py-2 border rounded-lg border-stone-300'
                            placeholder='First Name'
                          />
                        </View>
                      );
                    }}
                  />
                  <Controller
                    name='last_name'
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => {
                      return (
                        <View className='flex-1 my-2'>
                          <Text className='text-xs ml-1 mb-2 text-stone-600'>
                            Last name
                          </Text>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            editable={isAllInputEditable}
                            className='px-3 py-2 border rounded-lg border-stone-300'
                            placeholder='Last Name'
                          />
                        </View>
                      );
                    }}
                  />
                </View>
                <Controller
                  name='sr_code'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => {
                    return (
                      <View className='flex-1 my-2'>
                        <Text className='text-xs ml-1 mb-2 text-stone-600'>
                          SR-CODE
                        </Text>
                        <TextInput
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          editable={isAllInputEditable}
                          className='px-3 py-2 border rounded-lg border-stone-300'
                          placeholder='SR-CODE'
                        />
                      </View>
                    );
                  }}
                />
                <Controller
                  name='emergency_no'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => {
                    return (
                      <View className='flex-1 my-2'>
                        <Text className='text-xs ml-1 mb-2 text-stone-600'>
                          Emergency Contact No.
                        </Text>
                        <TextInput
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          editable={isAllInputEditable}
                          className='px-3 py-2 border rounded-lg border-stone-300'
                          placeholder='Emergency Contact No.'
                        />
                      </View>
                    );
                  }}
                />
                <Controller
                  name='medical_conditions'
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => {
                    return (
                      <View className='flex-1 my-2'>
                        <Text className='text-xs ml-1 mb-2 text-stone-600'>
                          Medical Conditions
                        </Text>
                        <TextInput
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          editable={isAllInputEditable}
                          className='px-3 py-2 border rounded-lg border-stone-300'
                          placeholder='Medical Conditions'
                        />
                      </View>
                    );
                  }}
                />
                <View className='my-6'>
                  <Text className='mx-1 mb-2 text-lg font-bold'>Address</Text>
                  <Controller
                    name='province'
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => {
                      return (
                        <View className='flex-1 my-2'>
                          <Text className='text-xs ml-1 mb-2 text-stone-600'>
                            Province
                          </Text>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            editable={isAllInputEditable}
                            className='px-3 py-2 border rounded-lg border-stone-300'
                            placeholder='Province'
                          />
                        </View>
                      );
                    }}
                  />
                  <Controller
                    name='city'
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => {
                      return (
                        <View className='flex-1 my-2'>
                          <Text className='text-xs ml-1 mb-2 text-stone-600'>
                            City
                          </Text>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            editable={isAllInputEditable}
                            className='px-3 py-2 border rounded-lg border-stone-300'
                            placeholder='City'
                          />
                        </View>
                      );
                    }}
                  />
                  <Controller
                    name='barangay'
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => {
                      return (
                        <View className='flex-1 my-2'>
                          <Text className='text-xs ml-1 mb-2 text-stone-600'>
                            Barangay
                          </Text>
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            editable={isAllInputEditable}
                            className='px-3 py-2 border rounded-lg border-stone-300'
                            placeholder='Barangay'
                          />
                        </View>
                      );
                    }}
                  />
                </View>
                {isAllInputEditable && (
                  <>
                    <Pressable
                      onPress={handleSubmit((data) => {
                        data = {
                          ...data,
                          emergency_no: data.emergency_no.split(","),
                          medical_conditions:
                            data.medical_conditions.split(","),
                        };

                        delete data["address"];

                        setIsSavingChanges(true);

                        const updateUser = async () => {
                          try {
                            const access_token = await AsyncStorage.getItem(
                              "access_token"
                            );
                            if (access_token) {
                              await custAxios.patch("students", data, {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              });
                              Alert.alert(
                                "Success",
                                "Profile updated successfully!",
                                [
                                  {
                                    onPress(value) {
                                      setIsSavingChanges(false);
                                      setIsAllInputEditable(false);
                                    },
                                    text: "OK",
                                  },
                                ]
                              );
                            }
                          } catch (error) {
                            setIsSavingChanges(false);

                            if (error instanceof AxiosError) {
                              switch (error.response?.status) {
                                case 403:
                                  Alert.alert(
                                    "Session expired",
                                    "Logging out...",
                                    [
                                      {
                                        onPress(value) {
                                          router.replace("/(auth)/login");
                                        },
                                      },
                                    ]
                                  );
                                  return;
                              }
                            }
                            Alert.alert(
                              "Error",
                              "Something went wrong. Please try again later."
                            );
                          }
                        };
                        updateUser();
                      }, onError)}
                      className='w-full'>
                      <View className='font-bold p-3 rounded-lg my-2 bg-green-600'>
                        {isSavingChanges ? (
                          <ActivityIndicator color='white' />
                        ) : (
                          <Text className='font-bold text-center text-white'>
                            SAVE CHANGES
                          </Text>
                        )}
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => setIsAllInputEditable(false)}
                      className='w-full '>
                      <View className='font-bold p-3 rounded-lg my-2 bg-black'>
                        <Text className='font-bold text-center text-white text-bold'>
                          CANCEL
                        </Text>
                      </View>
                    </Pressable>
                  </>
                )}
              </View>
              {!isAllInputEditable && (
                <Pressable onPress={clearToken} className='w-full'>
                  <View className='font-bold p-3 rounded-lg  my-2   border border-red-600 '>
                    <Text className='font-bold text-center text-red-600 text-bold'>
                      LOG OUT
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}
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

const assembleArray = (array: any[] | undefined) => {
  if (array) return array.every((e) => e === null) ? "" : array.join(", ");

  return "";
};

const onError = (errors: any, event: any) => {
  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    const message = Object.keys(errors)
      .map((key) => `${key.toUpperCase()}: ${errors[key]?.message}`)
      .join("\n");

    Alert.alert("Error", message);
    return;
  }
};

export default ProfileScreen;
