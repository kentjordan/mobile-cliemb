import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LevelsScreen = () => {
  return (
    <SafeAreaView>
      <View className='w-full h-full justify-center items-center'>
        <Text className='text-6xl'>Levels</Text>
      </View>
    </SafeAreaView>
  );
};

export default LevelsScreen;
