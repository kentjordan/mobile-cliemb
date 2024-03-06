import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import custAxios from "@/axios/axios.cust";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmergencyBell = require("../../../assets/images/emergency_bell.png");

const EmergencyScreen = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isCheckingState, setCheckingState] = useState(false);

  const sendOfflineEmergency = async () => {
    setCheckingState(true);

    const access_token = await AsyncStorage.getItem("access_token");

    const monitoringStateRes = await custAxios.get("monitoring/state", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    setCheckingState(false);

    if (
      monitoringStateRes.data &&
      monitoringStateRes.data.state === "COMPLETED"
    ) {
      try {
        const detailsRes = await custAxios.get("details", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        detailsRes.data = {
          ...detailsRes.data,
          equipment_needed: detailsRes.data.equipment_needed.join(","),
        };

        const offlineEmergencyRes = await custAxios.post(
          "offline-emergency",
          {
            emergency_level: 1,
            details: detailsRes.data,
          },
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
        console.log(error);
        Alert.alert("Something went wrong.", "Please try again.");
      }
    } else {
      Alert.alert(
        "You still have pending request.",
        "You can't request at the moment. Please wait until your request has been completed.",
        [
          {
            text: "OK, I'll wait",
            onPress: () => {},
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView>
      <View className='w-full h-full justify-center items-center bg-white'>
        <Text className='w-[75%] text-center mb-16 text-base'>
          Press the button to send an emergency message to the clinic
        </Text>

        <TouchableOpacity onPress={sendOfflineEmergency}>
          <Image source={EmergencyBell} className='w-64 h-64 rounded-full' />
        </TouchableOpacity>

        <Text className='text-4xl font-bold mt-4'>EMERGENCY</Text>
      </View>
    </SafeAreaView>
  );
};

export default EmergencyScreen;
