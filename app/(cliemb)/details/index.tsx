import detailsSchema from "@/schemas/details.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const DetailsScreen = () => {
  const [isAllInputEditable, setIsAllInputEditable] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const insets = useSafeAreaInsets();
  const screenHeight = useWindowDimensions().height;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(detailsSchema) });

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='p-4'>
          <View className='flex flex-row border-b  border-b-stone-300 py-3'>
            <Text className='mx-2 font-bold w-fit text-xl'>Details</Text>
          </View>
          <View className='my-8'>
            <View className='flex flex-row gap-2'>
              <Controller
                control={control}
                name='room'
                render={() => (
                  <View className='flex-1 my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      Room No./Name
                    </Text>
                    <TextInput
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
                render={() => (
                  <View className='flex-1 my-2'>
                    <Text className='text-xs ml-1 mb-2 text-stone-600'>
                      Floor No.
                    </Text>
                    <TextInput
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
              render={() => (
                <View className='my-2'>
                  <Text className='text-xs ml-1 mb-2 text-stone-600'>
                    Equiment Needed
                  </Text>
                  <TextInput
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
              name='narative'
              render={() => (
                <View className='my-2'>
                  <Text className='text-xs ml-1 mb-2 text-stone-600'>
                    Narrative
                  </Text>
                  <TextInput
                    editable={isAllInputEditable && !isFormSubmitting}
                    multiline
                    textAlignVertical='top'
                    className='px-3 py-2 border rounded-lg border-stone-300 min-h-40 '
                    placeholder='Narrative'
                  />
                </View>
              )}
            />
            {isAllInputEditable && (
              <Pressable
                className='w-full'
                onPress={() => {
                  setIsFormSubmitting(true);
                  // TODO: communicate with API
                  handleSubmit((data) => {})();
                }}>
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
            {!isAllInputEditable && (
              <Pressable
                onPress={() => setIsAllInputEditable(true)}
                className='w-full '>
                <View className='font-bold p-3 rounded-lg my-2 bg-black'>
                  <Text className='font-bold text-center text-white text-bold'>
                    EDIT
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;
