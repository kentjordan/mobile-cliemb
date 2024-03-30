import custAxios from "@/axios/axios.cust";
import EmergencyLevelDialogue from "@/components/levels/emergency-level.dialogue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RequestStatus from "@/components/levels/RequestStatus";

const LevelsScreen = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(-1);
  const [checkingState, setCheckingState] = useState(false);

  return (
    <SafeAreaView>
      <View className='w-full h-full'>
        {checkingState && (
          <View className='absolute w-full h-full bg-black/50 z-10 justify-center items-center'>
            <View className='bg-white rounded p-6'>
              <Text className='text-xl'>Checking user's request state...</Text>
              <Pressable
                className='mt-4 items-end'
                onPress={() => setCheckingState(false)}>
                <Text className='text-red-500 text-lg text-end'>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
        {isDialogOpened && (
          <EmergencyLevelDialogue
            emergencyLevel={emergencyLevel}
            setIsDialogOpened={setIsDialogOpened}
          />
        )}
        <View className='w-full h-full'>
          <View className='flex flex-row border-b border-b-stone-300 py-3 mx-4 justify-between'>
            <Text className='mx-2 font-bold w-fit text-3xl'>Levels</Text>
            <RequestStatus />
          </View>
          <View className='flex-1 w-full items-center justify-end'>
            <ScrollView>
              <View className='flex gap-2 w-full px-2 pt-32'>
                {/* Level 1 */}
                <View className='mb-32'>
                  <View className='bg-slate-700 px-4 relative flex justify-end items-center pt-36 pb-4 rounded border-2'>
                    <View className='absolute -mt-24 w-full top-0 '>
                      <Text className='text-3xl font-bold ml-8 mb-2'>
                        Level 1
                      </Text>
                      <View className=' bg-red-500 p-4 border rounded-lg min-h-40'>
                        <Text className='text-base font-bold mb-2'>
                          RESUSCITATION
                        </Text>
                        <Text className='ml-2'>• Cardiac Arrest</Text>
                        <Text className='ml-2'>• Respiratory Arrest</Text>
                        <Text className='ml-2'>• Severe Physical Trauma</Text>
                        <Text className='ml-2'>• Collapse</Text>
                        <Text className='ml-2'>• Active Seizure</Text>
                        <Pressable
                          onPress={async () => {
                            setCheckingState(true);

                            const access_token = await AsyncStorage.getItem(
                              "access_token"
                            );

                            const res = await custAxios.get(
                              "monitoring/state",
                              {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              }
                            );

                            setCheckingState(false);

                            if (res.data && res.data.state !== "COMPLETED") {
                              Alert.alert(
                                "You still have pending request",
                                "You can't request as the moment. Please wait until your request has been completed.",
                                [
                                  {
                                    text: "OK, I'll wait",
                                    onPress: () => {},
                                  },
                                ]
                              );
                              return;
                            }

                            setIsDialogOpened(true);
                            setEmergencyLevel(1);
                          }}
                          className='absolute -mt-16 right-0 mr-4 rounded-full border-white border-4 items-center p-8 shadow-lg bg-red-500'>
                          <MaterialCommunityIcons
                            name='bell-ring'
                            size={40}
                            color='white'
                          />
                        </Pressable>
                      </View>
                    </View>
                    <Text className='text-lg text-white text-center font-bold'>
                      Seen immediately by clinic staff before all other patients
                    </Text>
                  </View>
                </View>
                {/* Level 2 */}
                <View className='mb-32'>
                  <View className='bg-slate-700 px-4 relative flex justify-end items-center pt-36 pb-4 rounded border-2'>
                    <View className='absolute -mt-24 w-full top-0 '>
                      <Text className='text-3xl font-bold ml-8 mb-2'>
                        Level 2
                      </Text>
                      <View className=' bg-amber-500 p-4 border rounded-lg min-h-40'>
                        <Text className='text-base font-bold mb-2'>
                          EMERGENT
                        </Text>
                        <Text className='ml-2'>• Poisoning</Text>
                        <Text className='ml-2'>• Heat Stroke</Text>
                        <Text className='ml-2'>• Bloated Abdomen</Text>
                        <Text className='ml-2'>• Open Fructure</Text>
                        <Text className='ml-2'>• Excessive Bleeding</Text>
                        <Pressable
                          onPress={async () => {
                            setCheckingState(true);

                            const access_token = await AsyncStorage.getItem(
                              "access_token"
                            );

                            const res = await custAxios.get(
                              "monitoring/state",
                              {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              }
                            );

                            setCheckingState(false);

                            if (res.data && res.data.state !== "COMPLETED") {
                              Alert.alert(
                                "You still have pending request",
                                "You can't request as the moment. Please wait until your request has been completed.",
                                [
                                  {
                                    text: "OK, I'll wait",
                                    onPress: () => {},
                                  },
                                ]
                              );
                              return;
                            }

                            setIsDialogOpened(true);
                            setEmergencyLevel(2);
                          }}
                          className='absolute -mt-16 right-0 mr-4 rounded-full border-white border-4 items-center p-8 shadow-lg bg-amber-500'>
                          <MaterialCommunityIcons
                            name='bell-ring'
                            size={40}
                            color='white'
                          />
                        </Pressable>
                      </View>
                    </View>
                    <Text className='text-lg text-white text-center font-bold'>
                      Clinic staff is made aware of the patient and to be seen
                      ASAP
                    </Text>
                  </View>
                </View>
                {/* Level 3 */}
                <View className='mb-32'>
                  <View className='bg-slate-700 px-4 relative flex justify-end items-center pt-36 pb-4 rounded border-2'>
                    <View className='absolute -mt-24 w-full top-0 '>
                      <Text className='text-3xl font-bold ml-8 mb-2'>
                        Level 3
                      </Text>
                      <View className=' bg-yellow-200 p-4 border rounded-lg min-h-40'>
                        <Text className='text-base font-bold mb-2'>URGENT</Text>
                        <Text className='ml-2'>• Cardiac Arrest</Text>
                        <Text className='ml-2'>• Respiratory Arrest</Text>
                        <Text className='ml-2'>• Severe Physical Trauma</Text>
                        <Text className='ml-2'>• Collapse</Text>
                        <Text className='ml-2'>• Active Seizure</Text>
                        <Pressable
                          onPress={async () => {
                            setCheckingState(true);

                            const access_token = await AsyncStorage.getItem(
                              "access_token"
                            );

                            const res = await custAxios.get(
                              "monitoring/state",
                              {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              }
                            );
                            setCheckingState(false);

                            if (res.data && res.data.state !== "COMPLETED") {
                              Alert.alert(
                                "You still have pending request",
                                "You can't request as the moment. Please wait until your request has been completed.",
                                [
                                  {
                                    text: "OK, I'll wait",
                                    onPress: () => {},
                                  },
                                ]
                              );
                              return;
                            }

                            setIsDialogOpened(true);
                            setEmergencyLevel(3);
                          }}
                          className='absolute -mt-16 right-0 mr-4 rounded-full border-white border-4 items-center p-8 shadow-lg bg-yellow-300'>
                          <MaterialCommunityIcons
                            name='bell-ring'
                            size={40}
                            color='white'
                          />
                        </Pressable>
                      </View>
                    </View>
                    <Text className='text-lg text-white text-center font-bold'>
                      Clinic staff is made aware of the patient and to be seen
                      after level 1 and 2
                    </Text>
                  </View>
                </View>
                {/* Level 4 */}
                <View className='mb-8'>
                  <View className='bg-slate-700 px-4 relative flex justify-end items-center pt-36 pb-4 rounded border-2'>
                    <View className='absolute -mt-24 w-full top-0 '>
                      <Text className='text-3xl font-bold ml-8 mb-2'>
                        Level 4
                      </Text>
                      <View className=' bg-lime-300 p-4 border rounded-lg min-h-40'>
                        <Text className='text-base font-bold mb-2'>
                          EMERGENT
                        </Text>
                        <Text className='ml-2'>• Minor Wounds</Text>
                        <Text className='ml-2'>• Sore Eyes / Ears</Text>
                        <Pressable
                          onPress={async () => {
                            setCheckingState(true);

                            const access_token = await AsyncStorage.getItem(
                              "access_token"
                            );

                            const res = await custAxios.get(
                              "monitoring/state",
                              {
                                headers: {
                                  Authorization: `Bearer ${access_token}`,
                                },
                              }
                            );
                            setCheckingState(false);

                            if (res.data && res.data.state !== "COMPLETED") {
                              Alert.alert(
                                "You still have pending request",
                                "You can't request as the moment. Please wait until your request has been completed.",
                                [
                                  {
                                    text: "OK, I'll wait",
                                    onPress: () => {},
                                  },
                                ]
                              );
                              return;
                            }

                            setIsDialogOpened(true);
                            setEmergencyLevel(4);
                          }}
                          className='absolute -mt-16 right-0 mr-4 rounded-full border-white border-4 items-center p-8 shadow-lg bg-lime-500'>
                          <MaterialCommunityIcons
                            name='bell-ring'
                            size={40}
                            color='white'
                          />
                        </Pressable>
                      </View>
                    </View>
                    <Text className='text-lg text-white text-center font-bold'>
                      Seen after level 1, 2, and 3
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LevelsScreen;
