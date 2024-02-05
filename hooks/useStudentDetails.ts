import "core-js/stable/atob";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import custAxios from "@/axios/axios.cust";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/redux/app.slice";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { Alert } from "react-native";
import User from "@/redux/types/User";
import { RootState } from "@/redux/store";
import { AxiosError } from "axios";

// A hook to fetch the student information from the backend
// and dispatch to the global state
const useStudentDetails = (): User | undefined => {

    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.app);

    useEffect(() => {
        const getStudentDetails = async () => {
            const access_token = await AsyncStorage.getItem("access_token");

            if (access_token) {
                try {
                    const decodedAT = jwtDecode(access_token) as any;
                    const res = await custAxios.get(`students/${decodedAT.id}`, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    });

                    dispatch(setUser(res.data));
                    return;
                } catch (error) {
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

                    Alert.alert("Something went wrong", "Logging out...");
                    router.replace("/(auth)/login");
                }

                return;
            }

            router.replace("/(auth)/login");
        };

        getStudentDetails();
    }, []);

    return user
}

export default useStudentDetails;