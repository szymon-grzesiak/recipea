import { View, Text } from "react-native";

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-black text-center font-semibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-black text-center font-normal">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
