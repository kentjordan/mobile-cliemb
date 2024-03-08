import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { ScrollView } from "react-native";
import printJSON from "@/utils/printJSON";

const EmergencyBell = require("../../../assets/images/emergency_bell.png");

const EmergencyScreen = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isCheckingState, setCheckingState] = useState(false);

  const [serverAddress, setServerAddress] = useState<string>("192.168.x.x");
  const [isEditing, setIsEditing] = useState(false);

  const sendOfflineEmergency = async () => {
    setCheckingState(true);

    const access_token = await AsyncStorage.getItem("access_token");

    try {
      const serverAddress = await AsyncStorage.getItem("server-address");

      const offlineEmergencyRes = await axios.post(
        `http://${serverAddress}:5002/api/offline-emergency`,
        null,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (offlineEmergencyRes.status === 201) {
        Alert.alert(
          "Request sent successfully!",
          "Kindly please wait, an admin will process your request."
        );
      }
    } catch (error) {
      printJSON(error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
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
      }
      Alert.alert("Something went wrong", "Please try again.");
    }
  };

  const { top } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    const _setServerAddress = async () => {
      const serverAddress = await AsyncStorage.getItem("server-address");
      setServerAddress(serverAddress as string);
    };

    _setServerAddress();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          className='w-full justify-center items-center bg-white'
          style={{
            height: screenHeight - top,
          }}>
          <Text className='w-[75%] text-center mb-16 text-base'>
            Press the button to send an emergency message to the clinic
          </Text>

          <TouchableOpacity onPress={sendOfflineEmergency}>
            <Image source={EmergencyBell} className='w-64 h-64 rounded-full' />
          </TouchableOpacity>

          <Text className='text-4xl font-bold mt-4'>EMERGENCY</Text>
          <View className='mt-16'>
            <Text className='mb-2 text-center'>Server Address</Text>
            <View className='flex items-center justify-center'>
              <TextInput
                onChange={(e) => setServerAddress(e.nativeEvent.text)}
                editable={isEditing}
                defaultValue={`${serverAddress}`}
                className='border rounded min-w-32 p-2 border-stone-300'
              />
              {isEditing ? (
                <TouchableOpacity
                  onPress={async () => {
                    setIsEditing(!isEditing);
                    await AsyncStorage.setItem(
                      "server-address",
                      serverAddress as string
                    );
                  }}
                  className='w-full'>
                  <Text className='w-full bg-black text-white px-4 py-3 rounded text-center font-bold mt-2'>
                    SAVE
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  className='w-full'>
                  <Text className='w-full bg-black text-white px-4 py-3 rounded text-center font-bold mt-2'>
                    EDIT
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyScreen;
