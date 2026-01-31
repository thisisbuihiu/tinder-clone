import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { pickImage, uploadPhoto } from "@/services/storage";
import { config } from "@/constants/config";

interface PhotoUploaderProps {
  userId: string;
  photoURLs: string[];
  onPhotosChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function PhotoUploader({
  userId,
  photoURLs,
  onPhotosChange,
  disabled = false,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPhoto = async () => {
    if (photoURLs.length >= config.maxPhotos) {
      setError(`Maximum ${config.maxPhotos} photos allowed`);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const localUri = await pickImage();
      if (!localUri) {
        setUploading(false);
        return;
      }
      const photoId = `photo_${Date.now()}`;
      const downloadURL = await uploadPhoto(userId, localUri, photoId);
      onPhotosChange([...photoURLs, downloadURL]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (disabled || photoURLs.length <= 1) return;
    setError(null);
    const newUrls = photoURLs.filter((_, i) => i !== index);
    onPhotosChange(newUrls);
  };

  return (
    <View>
      <Text className="text-gray-700 font-medium mb-2">
        Photos ({photoURLs.length}/{config.maxPhotos}) *
      </Text>
      {error ? (
        <Text className="text-red-600 text-sm mb-2">{error}</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {photoURLs.map((url, index) => (
          <View
            key={url}
            className="w-24 h-32 rounded-xl overflow-hidden mr-2 bg-gray-100"
          >
            <Image
              source={{ uri: url }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {!disabled && photoURLs.length > 1 ? (
              <TouchableOpacity
                onPress={() => handleRemovePhoto(index)}
                className="absolute top-1 right-1 bg-black/50 w-6 h-6 rounded-full items-center justify-center"
              >
                <Text className="text-white text-sm">×</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
        {photoURLs.length < config.maxPhotos && !disabled ? (
          <TouchableOpacity
            onPress={handleAddPhoto}
            disabled={uploading}
            className="w-24 h-32 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center"
          >
            {uploading ? (
              <ActivityIndicator color="#E94057" />
            ) : (
              <Text className="text-gray-400 text-3xl">+</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
