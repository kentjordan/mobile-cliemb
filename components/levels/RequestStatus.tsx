import { View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import custAxios from "@/axios/axios.cust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const changeStatusBg = (requestStatus: string) => {
  switch (requestStatus) {
    case "TO RECEIVE":
      return "bg-red-800";
    case "PENDING":
      return "bg-stone-800";
    case "COMPLETED":
      return "bg-green-800";
  }
};

const RequestStatus = () => {
  const [requestStatus, setRequestStatus] = useState("N/A");
  const [userId, setUserId] = useState<null | string>(null);

  const refreshStatus = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");

      const res = await custAxios.get("monitoring/state", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { state } = res.data;
      setRequestStatus(state);

      return state;
    } catch (error) {
      Alert.alert("Something went wrong", "Please try again.");
      console.error(error);
    }
  };

  // Register SocketIO
  useEffect(() => {
    const getUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
        setUserId(user_id);
      } catch (error) {
        console.error(error);
      }
    };

    getUserId();

    if (userId) {
      try {
        const socket = io(
          process.env.NODE_ENV === "production"
            ? "https://cliemb.online/ws/emergency"
            : `http://${process.env.EXPO_PUBLIC_DEV_WS_API_HOSTNAME}/ws/emergency`
        );
        socket.on("connect", () => {
          socket.emit("register-user-room", userId);
        });

        socket.on("update-emergency-request-state", async () => {
          const state = await refreshStatus();
          Alert.alert(
            "Your request has been successfully updated!",
            `\nCurrent status: ${state}`
          );
        });

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error(error);
      }
    }
  }, [userId]);

  useLayoutEffect(() => {
    refreshStatus();
  });

  return (
    <View className='flex flex-row'>
      {requestStatus && (
        <>
          <Ionicons
            className='mr-2'
            name='refresh-sharp'
            onPress={async () => {
              refreshStatus();
              Alert.alert(
                "Refreshed successfully!",
                "Your current emergency status has been refreshed."
              );
            }}
            size={24}
            color='black'
          />
          <View
            className={`rounded text-center px-2 flex items-center justify-center ${changeStatusBg(
              requestStatus
            )}`}>
            <Text
              className={`${
                requestStatus === "N/A" ? "text-black" : "text-white"
              } font-bold`}>
              {requestStatus}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default RequestStatus;
