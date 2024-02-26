import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useLayoutEffect, useState } from "react";
import useUserProfile from "@/hooks/useUserProfile";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import custAxios from "@/axios/axios.cust";
import { Feather } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import profileSchema from "@/schemas/profile.schema";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import printJSON from "@/utils/printJSON";

import FormData from "form-data";
import mime from "mime";

const ProfileScreen = () => {
  const [isAllInputEditable, setIsAllInputEditable] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const insets = useSafeAreaInsets();
  const screenHeight = useWindowDimensions().height;

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const { isFetching, user } = useUserProfile();

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<
    string | null
  >(null);

  const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(null);

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
      setProfilePhotoURL(user.profile_photo);
    }
  }, [user]);

  const selectPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      setSelectedProfilePhoto(res.assets?.at(0)?.uri as string);
    }
  };

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
                  {profilePhotoURL || selectedProfilePhoto ? (
                    <Image
                      source={selectedProfilePhoto ?? profilePhotoURL}
                      style={{
                        width: 108,
                        height: 108,
                        borderRadius: 100,
                        borderWidth: 2,
                      }}
                    />
                  ) : (
                    <Ionicons
                      name='person-circle-sharp'
                      size={108}
                      color='black'
                    />
                  )}
                </View>
                {isAllInputEditable && (
                  <TouchableOpacity
                    onPress={selectPhoto}
                    className='items-center justify-center mb-8 flex-row'>
                    <AntDesign name='upload' size={14} color='black' />
                    <Text className='ml-2'>Upload photo</Text>
                  </TouchableOpacity>
                )}
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
                {user?.role !== "STUDENT" ? null : (
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
                )}
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
                              if (selectedProfilePhoto) {
                                const formData = new FormData();

                                formData.append("photo", {
                                  uri: selectedProfilePhoto,
                                  name: selectedProfilePhoto.split("/").pop(),
                                  type: mime.getType(selectedProfilePhoto),
                                });

                                await custAxios.post(
                                  "upload/users/dp",
                                  formData,
                                  {
                                    headers: {
                                      "content-type": "multipart/form-data",
                                      Authorization: `Bearer ${access_token}`,
                                    },
                                    transformRequest: () => formData,
                                  }
                                );
                              }

                              await custAxios.patch("users", data, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${access_token}`,
                                },
                              });

                              const res = await custAxios.get("users", {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              });

                              setProfilePhotoURL(res.data.profile_photo);

                              Alert.alert(
                                "Success",
                                "Profile updated successfully!",
                                [
                                  {
                                    onPress(value) {
                                      setSelectedProfilePhoto(null);
                                      setIsSavingChanges(false);
                                      setIsAllInputEditable(false);
                                    },
                                    text: "OK",
                                  },
                                ]
                              );
                            }
                          } catch (error) {
                            printJSON(error);

                            setSelectedProfilePhoto(null);
                            setIsSavingChanges(false);
                            setIsAllInputEditable(false);

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
                              "Something went wrong. Please try again."
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
