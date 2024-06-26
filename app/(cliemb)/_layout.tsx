import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const CliembLayout = () => {
  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarShowLabel: false,
      }}
      backBehavior='history'>
      <Tabs.Screen
        name='levels/index'
        options={{
          title: "Levels",
          tabBarIcon: () => (
            <MaterialIcons name='crisis-alert' size={24} color='black' />
          ),
        }}
      />
      <Tabs.Screen
        name='details/index'
        options={{
          title: "Details",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name='card-account-details'
              size={24}
              color='black'
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile/index'
        options={{
          tabBarIcon: () => (
            <Ionicons name='person-sharp' size={24} color='black' />
          ),
        }}
      />
    </Tabs>
  );
};

export default CliembLayout;
