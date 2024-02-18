import custAxios from "@/axios/axios.cust";
import detailsSchema from "@/schemas/details.schema";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailsScreen = () => {
  const [isAllInputEditable, setIsAllInputEditable] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [hasDetails, setHasDetails] = useState(false);
  const [isPopulatingData, setIsPopulatingData] = useState(true);
  const [isDetailsUpdating, setIsDetailsUpdating] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(detailsSchema),
  });

  // Populate TextInputs by data from the API
  useLayoutEffect(() => {
    const getDetails = async () => {
      try {
        const acces_token = await AsyncStorage.getItem("access_token");

        const res = await custAxios.get("details", {
          headers: { Authorization: `Bearer ${acces_token}` },
        });

        setHasDetails(true);

        Object.keys(res.data).forEach((key) => {
          if (key === "equipment_needed") {
            setValue(key, res.data[key].join(","));
          } else {
            setValue(key, res.data[key]);
          }
        });

        setIsPopulatingData(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          switch (error.response?.status) {
            case 404:
              setIsPopulatingData(false);
              setHasDetails(false);
              break;
          }
        }
      }
    };

    getDetails();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='p-4'>
          <View className='flex flex-row border-b  border-b-stone-300 py-3'>
            <Text className='mx-2 font-bold w-fit text-3xl'>Details</Text>
          </View>
          {isPopulatingData && <ActivityIndicator color='black' size={32} />}
          {!isPopulatingData && (
            <View className='my-8'>
              <View className='flex flex-row gap-2'>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name='room'
                  render={({ field: { onBlur, onChange, value } }) => (
                    <View className='flex-1 my-2'>
                      <Text className='text-xs ml-1 mb-2 text-stone-600'>
                        Room No./Name
                      </Text>
                      <TextInput
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                        editable={isAllInputEditable && !isFormSubmitting}
                        className='px-3 py-2 border rounded-lg border-stone-300'
                        placeholder='Room No./Name'
                      />
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name='floor_no'
                  render={({ field: { onBlur, onChange, value } }) => (
                    <View className='flex-1 my-2'>
                      <Text className='text-xs ml-1 mb-2 text-stone-600'>
                        Floor No.
                      </Text>
                      <TextInput
                        onBlur={onBlur}
                        value={value}
                        onChangeText={onChange}
                        editable={isAllInputEditable && !isFormSubmitting}
                        className='px-3 py-2 border rounded-lg border-stone-300'
                        placeholder='Floor No.'
                      />
                    </View>
                  )}
                />
              </View>
              <Controller
                control={control}
                name='equipment_needed'
                render={({ field: { onBlur, onChange, value } }) => (
                  <View className='my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      Equiment Needed
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      editable={isAllInputEditable && !isFormSubmitting}
                      multiline
                      textAlignVertical='top'
                      className='px-3 py-2 border rounded-lg border-stone-300 min-h-20'
                      placeholder='Equiment Needed'
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name='narrative'
                render={({ field: { onBlur, onChange, value } }) => (
                  <View className='my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      Narrative
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      editable={isAllInputEditable && !isFormSubmitting}
                      multiline
                      textAlignVertical='top'
                      className='px-3 py-2 border rounded-lg border-stone-300 min-h-40 '
                      placeholder='Narrative'
                    />
                  </View>
                )}
              />
              {/* UPDATE BUTTON */}
              {isAllInputEditable && hasDetails && (
                <Pressable
                  disabled={isDetailsUpdating}
                  onPress={handleSubmit(async (data) => {
                    const access_token = await AsyncStorage.getItem(
                      "access_token"
                    );
                    const updateDetails = async () => {
                      try {
                        data = {
                          ...data,
                          equipment_needed: data.equipment_needed.split(","),
                        };
                        setIsDetailsUpdating(true);

                        const res = await custAxios.patch(
                          "details/with-monitoring",
                          data,
                          {
                            headers: {
                              Authorization: `Bearer ${access_token}`,
                            },
                          }
                        );

                        // Set TextInput Values
                        Object.keys(res.data).forEach((key, i) => {
                          if (key === "equipment_needed") {
                            setValue(key.toString(), res.data[key].join(", "));
                          } else {
                            setValue(key.toString(), res.data[key]);
                          }
                        });

                        if (res.status === 200) {
                          Alert.alert(
                            "Success!",
                            "Detailed updated successfully!",
                            [
                              {
                                onPress: () => {
                                  setIsDetailsUpdating(false);
                                  setIsAllInputEditable(false);
                                },
                              },
                            ]
                          );
                        }
                      } catch (error: any) {
                        console.log(JSON.stringify(error, null, 3));
                      }
                    };

                    updateDetails();
                  }, onError)}
                  className='w-full '>
                  <View className='font-bold p-3 rounded-lg my-2 bg-green-600'>
                    {isDetailsUpdating ? (
                      <ActivityIndicator color='white' />
                    ) : (
                      <Text className='font-bold text-center text-white text-bold'>
                        SAVE CHANGES
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              {/* SUBMIT BUTTON */}
              {isAllInputEditable && !hasDetails && (
                <Pressable
                  className='w-full'
                  onPress={handleSubmit(async (data) => {
                    const access_token = await AsyncStorage.getItem(
                      "access_token"
                    );

                    const equipment_needed = data.equipment_needed.split(",");

                    data = {
                      ...data,
                      equipment_needed,
                    };

                    try {
                      setIsFormSubmitting(true);

                      const res = await custAxios.post("details", data, {
                        headers: {
                          Authorization: `Bearer ${access_token}`,
                        },
                      });

                      setHasDetails(true);

                      if (res.status === 201) {
                        Alert.alert(
                          "Success!",
                          "Details submitted successfully!",
                          [
                            {
                              onPress(value) {
                                setIsFormSubmitting(false);
                                setIsAllInputEditable(false);
                              },
                            },
                          ]
                        );
                      }
                    } catch (error: any) {
                      console.log(JSON.stringify({ ...error }, null, 3));
                    }
                  }, onError)}>
                  <View className='font-bold p-3 rounded-lg my-2 bg-green-600'>
                    {isFormSubmitting ? (
                      <ActivityIndicator color='white' />
                    ) : (
                      <Text className='font-bold text-center text-white  text-bold'>
                        SUBMIT
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              {/* CANCEL BUTTON */}
              {isAllInputEditable && (
                <Pressable
                  disabled={isFormSubmitting}
                  onPress={() => setIsAllInputEditable(false)}
                  className='w-full '>
                  <View className='font-bold p-3 rounded-lg my-2 bg-black'>
                    <Text className='font-bold text-center text-white text-bold'>
                      CANCEL
                    </Text>
                  </View>
                </Pressable>
              )}
              {/* EDIT BUTTON */}
              {!isAllInputEditable && (
                <Pressable
                  onPress={() => {
                    setIsAllInputEditable(true);
                  }}
                  className='w-full '>
                  <View className='font-bold p-3 rounded-lg my-2 border justify-center items-center flex-row bg-black'>
                    <Feather
                      name='edit-2'
                      size={16}
                      color='white'
                      className='mx-1'
                    />
                    <Text className='font-bold text-start text-white text-bold '>
                      EDIT
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

export default DetailsScreen;
