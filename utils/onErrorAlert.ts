import { Alert } from "react-native";

export default function onErrorAlert(errors: any, event: any) {
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
        const message = Object.keys(errors)
            .map((key) => `${key.toUpperCase()}: ${errors[key]?.message}`)
            .join("\n");

        Alert.alert("Error", message);
        return;
    }
};