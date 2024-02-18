import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
  Text,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import onErrorAlert from "@/utils/onErrorAlert";
import custAxios from "@/axios/axios.cust";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EmergencyLevelDialogueProps {
  emergencyLevel: number;
  setIsDialogOpened: Dispatch<SetStateAction<boolean>>;
}

const EmergencyLevelDialogue = ({
  emergencyLevel,
  setIsDialogOpened,
}: EmergencyLevelDialogueProps) => {
  const { control, handleSubmit } = useForm();

  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);

  return (
    <View className='bg-black/50 w-full h-full absolute z-10'>
      <ScrollView>
        <View className='bg-white m-2 rounded-lg p-5 gap-4 mt-[15%]'>
          <Text className='text-2xl font-bold border-b border-b-stone-300 pb-2'>
            Emergency Level {emergencyLevel}
          </Text>
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
          <Pressable
            className='flex gap-2 flex-row justify-center items-center w-full border border-green-700 p-2 rounded'
            onPress={() => {}}>
            <FontAwesome name='camera' size={16} color='green' />
            <Text className='text-green-700 text-center text-xl'>
              Take a photo
            </Text>
          </Pressable>
          <View className='items-center my-4'>
            <Text className='font-bold mb-4'>DISCLAIMER</Text>
            <Text className='text-center'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              voluptate exercitationem eligendi harum at, quo adipisci odit
              recusandae fugit sapiente.
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

                    const res = await custAxios.post(
                      "monitoring",
                      {
                        emergency_level: emergencyLevel,
                        details: {
                          room: data.room,
                          floor_no: data.floor_no,
                          equipment_needed: data.equipment_needed,
                        },
                      },
                      {
                        headers: {
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
                    console.log(error);
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
        </View>
      </ScrollView>
    </View>
  );
};

export default EmergencyLevelDialogue;
