import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import onErrorAlert from "@/utils/onErrorAlert";
import custAxios from "@/axios/axios.cust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { AxiosError } from "axios";

import FormData from "form-data";

interface EmergencyLevelDialogueProps {
  emergencyLevel: number;
  setIsDialogOpened: Dispatch<SetStateAction<boolean>>;
}

const uploadPhoto = async (
  capturedPhoto: CameraCapturedPicture | null,
  access_token: string | null,
  setIsRequestSubmitting: Dispatch<SetStateAction<boolean>>
) => {
  if (capturedPhoto) {
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: capturedPhoto.uri,
        name: capturedPhoto.uri.split("/").pop(),
        type: "image/*",
      });

      const res = await custAxios.post("upload/users/monitoring", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });

      return res.data;
    } catch (error: any) {
      setIsRequestSubmitting(false);
      console.log("error", JSON.stringify(error, null, 3));
      Alert.alert("Error", "Something went wrong in uploading the photo.");
      return null;
    }
  }

  console.log(capturedPhoto);
};

const EmergencyLevelDialogue = ({
  emergencyLevel,
  setIsDialogOpened,
}: EmergencyLevelDialogueProps) => {
  const { control, handleSubmit } = useForm();

  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const cameraRef = useRef<Camera | null>(null);

  const [capturedPhoto, setCapturedPhoto] =
    useState<CameraCapturedPicture | null>(null);

  async function toggleCameraType() {
    if (cameraRef.current) {
      setIsPhotoSaving(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.35,
      });
      setIsPhotoSaving(false);
      if (photo) {
        setCapturedPhoto(photo);
      }
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const windowsDimensions = useWindowDimensions();

  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isPhotoSaving, setIsPhotoSaving] = useState(false);

  return (
    <View className='bg-black/50 w-full h-full absolute z-10'>
      <ScrollView>
        <View className='bg-white m-2 rounded-lg p-5 gap-4 mt-[15%]'>
          <Text className='text-2xl font-bold border-b border-b-stone-300 pb-2'>
            Emergency Level {emergencyLevel}
          </Text>
          {isTakingPhoto ? (
            <View className='w-full h-fit'>
              {capturedPhoto ? (
                <>
                  <Text className='text-center py-2'>Preview</Text>
                  <Image
                    style={{
                      height: windowsDimensions.height / 2,
                      width: "auto",
                    }}
                    className='bg-red-500 '
                    src={capturedPhoto?.uri}
                    width={400}
                    height={400}
                  />
                  <TouchableOpacity
                    className='bg-black my-2 rounded'
                    onPress={() => {
                      setCapturedPhoto(null);
                      setIsTakingPhoto(true);
                    }}>
                    <Text className='text-white text-center text-xl py-4'>
                      Retake
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='bg-green-700 rounded'
                    onPress={() => setIsTakingPhoto(false)}>
                    <Text className='text-white text-center text-xl py-4'>
                      Use this photo
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Camera
                    ratio='4:3'
                    ref={cameraRef}
                    style={{
                      height: windowsDimensions.height / 2,
                      width: "auto",
                    }}
                    onCameraReady={() => {
                      console.log("camera is ready!");
                    }}>
                    <View className='w-full h-full items-center justify-end'>
                      <TouchableOpacity
                        disabled={isPhotoSaving}
                        className='bg-white/30 w-full items-center'
                        onPress={toggleCameraType}>
                        {isPhotoSaving ? (
                          <View className='flex flex-row py-4'>
                            <ActivityIndicator color='white' size={24} />
                            <Text className='text-xl ml-2 text-white'>
                              Stay on focus, saving...
                            </Text>
                          </View>
                        ) : (
                          <Entypo
                            name='camera'
                            className='m-4'
                            size={24}
                            color='white'
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </Camera>
                  <TouchableOpacity
                    className='bg-red-700 rounded mt-2'
                    onPress={() => setIsTakingPhoto(false)}>
                    <Text className='text-white text-center text-xl py-4'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <>
              <Text className='text-xl font-bold'>User Details</Text>
              <View className='flex flex-row w-full '>
                <Controller
                  name='room'
                  rules={{
                    required: { value: true, message: "Must have value." },
                  }}
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='flex-1 mr-1 border rounded-md border-stone-500 p-2'
                      placeholder='Room No. / Name'
                    />
                  )}
                />
                <Controller
                  name='floor_no'
                  rules={{
                    required: { value: true, message: "Must have value." },
                  }}
                  control={control}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='flex-1 ml-1 border rounded-md border-stone-500 p-2'
                      placeholder='Floor No.'
                    />
                  )}
                />
              </View>
              <Controller
                name='equipment_needed'
                rules={{
                  required: { value: true, message: "Must have value." },
                }}
                control={control}
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    textAlignVertical='top'
                    className='border min-h-32 rounded-md border-stone-500 p-2'
                    placeholder='Equiment Needed'
                  />
                )}
              />
              {capturedPhoto ? (
                <>
                  <Text className='text-center'>Photo to be submitted</Text>
                  <Image
                    style={{
                      height: windowsDimensions.height / 2,
                      width: "auto",
                    }}
                    className='bg-red-500 '
                    src={capturedPhoto?.uri}
                    width={400}
                    height={400}
                  />
                  <TouchableOpacity
                    className='bg-black my-2 rounded'
                    onPress={() => {
                      setCapturedPhoto(null);
                      setIsTakingPhoto(true);
                    }}>
                    <Text className='text-white text-center text-xl py-4'>
                      Retake
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Pressable
                  className='flex gap-2 flex-row justify-center items-center w-full border border-green-700 p-2 rounded'
                  onPress={() => {
                    setIsTakingPhoto(true);
                  }}>
                  <FontAwesome name='camera' size={16} color='green' />
                  <Text className='text-green-700 text-center text-xl'>
                    Take a photo
                  </Text>
                </Pressable>
              )}
              <View className='items-center my-4'>
                <Text className='font-bold mb-4'>DISCLAIMER</Text>
                <Text className='text-center'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita voluptate exercitationem eligendi harum at, quo
                  adipisci odit recusandae fugit sapiente.
                </Text>
              </View>
              <View className='flex items-center justify-center gap-2'>
                <Pressable
                  disabled={isRequestSubmitting}
                  className='w-full bg-red-700 p-2 rounded'
                  onPress={handleSubmit((data) => {
                    const reqeustEmergency = async () => {
                      const access_token = await AsyncStorage.getItem(
                        "access_token"
                      );

                      try {
                        setIsRequestSubmitting(true);

                        const photoURL = await uploadPhoto(
                          capturedPhoto,
                          access_token,
                          setIsRequestSubmitting
                        );

                        const res = await custAxios.post(
                          "monitoring",
                          {
                            emergency_level: emergencyLevel,
                            details: {
                              room: data.room,
                              floor_no: data.floor_no,
                              equipment_needed: data.equipment_needed,
                              photo: photoURL,
                            },
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${access_token}`,
                            },
                          }
                        );
                        setIsRequestSubmitting(false);
                        if (res.status === 201) {
                          Alert.alert(
                            "Request sent successfully",
                            "Kindly please wait, an admin will process your request.",
                            [
                              {
                                onPress(value) {
                                  setIsDialogOpened(false);
                                },
                              },
                            ]
                          );
                        }
                      } catch (error) {
                        setIsRequestSubmitting(false);

                        if (error instanceof AxiosError) {
                          console.log(JSON.stringify(error.response, null, 3));
                        }
                      }
                    };
                    reqeustEmergency();
                  }, onErrorAlert)}>
                  <Text className='text-white text-center font-bold text-xl'>
                    {isRequestSubmitting ? "Submitting..." : "Submit"}
                  </Text>
                </Pressable>
                <Pressable
                  className='w-full bg-black p-2 rounded'
                  onPress={() => setIsDialogOpened(false)}>
                  <Text className='text-white text-center text-bold text-xl'>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EmergencyLevelDialogue;
