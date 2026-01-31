import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { createUser, updateUser } from "@/services/firestore";
import { PhotoUploader } from "@/components/PhotoUploader";
import {
  getNameError,
  getAgeError,
  getBioError,
} from "@/utils/validation";
import { config } from "@/constants/config";
import type { Gender, LookingFor } from "@/types";

interface EditProfileScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const LOOKING_FOR_OPTIONS: { label: string; value: LookingFor }[] = [
  { label: "Men", value: "male" },
  { label: "Women", value: "female" },
  { label: "Everyone", value: "both" },
];

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { user: authUser } = useAuthStore();
  const { user: profileUser, loadUser, isLoading: userLoading } = useUserStore();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<Gender>("other");
  const [lookingFor, setLookingFor] = useState<LookingFor>("both");
  const [city, setCity] = useState("");
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name);
      setAge(profileUser.age > 0 ? String(profileUser.age) : "");
      setBio(profileUser.bio);
      setGender(profileUser.gender);
      setLookingFor(profileUser.lookingFor);
      setCity(profileUser.city);
      setPhotoURLs(profileUser.photoURLs ?? []);
    } else if (authUser) {
      loadUser(authUser.uid);
    }
  }, [authUser?.uid, profileUser]);

  const handleSave = async () => {
    if (!authUser) return;
    setError(null);

    const nameError = getNameError(name);
    const ageError = getAgeError(age);
    const bioError = getBioError(bio, config.maxBioLength);

    if (nameError || ageError || bioError) {
      setError(nameError || ageError || bioError || "Please fix the errors above");
      return;
    }

    if (photoURLs.length < config.minPhotos) {
      setError(`Add at least ${config.minPhotos} photo`);
      return;
    }

    setIsLoading(true);
    try {
      if (profileUser) {
        await updateUser(authUser.uid, {
          name: name.trim(),
          age: parseInt(age, 10),
          bio: bio.trim(),
          gender,
          lookingFor,
          city: city.trim(),
          photoURLs,
        });
      } else {
        await createUser(authUser.uid, {
          name: name.trim(),
          age: parseInt(age, 10),
          bio: bio.trim(),
          gender,
          lookingFor,
          city: city.trim(),
          photoURLs,
        });
      }
      await loadUser(authUser.uid);
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (authUser && !profileUser && userLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#E94057" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text className="text-[#E94057] font-semibold">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#E94057" />
            ) : (
              <Text className="text-[#E94057] font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        <PhotoUploader
          userId={authUser?.uid ?? ""}
          photoURLs={photoURLs}
          onPhotosChange={setPhotoURLs}
          disabled={isLoading}
        />

        <Text className="text-gray-700 font-medium mb-2">Name *</Text>
        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-base"
          placeholder="Your name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />

        <Text className="text-gray-700 font-medium mb-2">Age *</Text>
        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-base"
          placeholder="18"
          placeholderTextColor="#9CA3AF"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          editable={!isLoading}
        />

        <Text className="text-gray-700 font-medium mb-2">Bio</Text>
        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-base"
          placeholder="Tell us about yourself"
          placeholderTextColor="#9CA3AF"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: "top" }}
          maxLength={config.maxBioLength}
          editable={!isLoading}
        />

        <Text className="text-gray-700 font-medium mb-2">Gender</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {GENDER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setGender(opt.value)}
              className={`px-4 py-2 rounded-full ${
                gender === opt.value ? "bg-[#E94057]" : "bg-gray-100"
              }`}
              disabled={isLoading}
            >
              <Text
                className={
                  gender === opt.value ? "text-white font-medium" : "text-gray-600"
                }
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 font-medium mb-2">Looking for</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {LOOKING_FOR_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setLookingFor(opt.value)}
              className={`px-4 py-2 rounded-full ${
                lookingFor === opt.value ? "bg-[#E94057]" : "bg-gray-100"
              }`}
              disabled={isLoading}
            >
              <Text
                className={
                  lookingFor === opt.value ? "text-white font-medium" : "text-gray-600"
                }
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 font-medium mb-2">City</Text>
        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-6 text-base"
          placeholder="Your city"
          placeholderTextColor="#9CA3AF"
          value={city}
          onChangeText={setCity}
          editable={!isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
