import { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { signOut } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

interface ProfileScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user: authUser } = useAuthStore();
  const { user: profileUser, loadUser, clearUser, isLoading } = useUserStore();

  useEffect(() => {
    if (authUser) {
      loadUser(authUser.uid);
    }
  }, [authUser?.uid]);

  const handleSignOut = async () => {
    clearUser();
    await signOut();
  };

  if (authUser && isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#E94057" />
      </View>
    );
  }

  if (authUser && !profileUser && !isLoading) {
    return (
      <View className="flex-1 bg-white p-6">
        <View className="bg-amber-50 p-4 rounded-xl mb-6">
          <Text className="text-amber-800 text-sm mb-4">
            Complete your profile to start discovering matches.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
          className="bg-[#E94057] py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">Complete Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!authUser) {
    return null;
  }

  const hasProfile = profileUser && profileUser.photoURLs?.length > 0 && profileUser.name;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="items-center mb-6">
        {profileUser?.photoURLs?.[0] ? (
          <Image
            source={{ uri: profileUser.photoURLs[0] }}
            className="w-32 h-40 rounded-2xl mb-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-40 rounded-2xl bg-gray-200 mb-4 items-center justify-center">
            <Text className="text-gray-400">No photo</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-gray-900">
          {profileUser?.name || "No name"}
        </Text>
        {profileUser?.age ? (
          <Text className="text-gray-600">{profileUser.age} years old</Text>
        ) : null}
        {profileUser?.city ? (
          <Text className="text-gray-600">{profileUser.city}</Text>
        ) : null}
      </View>

      {profileUser?.bio ? (
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">About</Text>
          <Text className="text-gray-600">{profileUser.bio}</Text>
        </View>
      ) : null}

      {!hasProfile ? (
        <View className="bg-amber-50 p-4 rounded-xl mb-6">
          <Text className="text-amber-800 text-sm">
            Complete your profile to start discovering matches.
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        className="bg-[#E94057] py-4 rounded-xl items-center mb-4"
      >
        <Text className="text-white font-semibold text-base">
          {hasProfile ? "Edit Profile" : "Complete Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        className="border border-gray-300 py-4 rounded-xl items-center"
      >
        <Text className="text-gray-700 font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
