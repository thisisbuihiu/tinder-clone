import { View, Text, TouchableOpacity } from "react-native";
import { signOut } from "@/services/auth";

/**
 * Profile screen - display user profile
 * Will be implemented in Step 3
 */
export function ProfileScreen() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-gray-600 mb-4">Profile (Step 3)</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-[#E94057] px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
