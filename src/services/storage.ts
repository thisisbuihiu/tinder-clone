import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage as firebaseStorage } from "./firebase";
import * as ImagePicker from "expo-image-picker";

export async function pickImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access photos is required");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export async function uploadPhoto(
  userId: string,
  localUri: string,
  photoId: string
): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();

  const storageRef = ref(firebaseStorage, `users/${userId}/photos/${photoId}`);
  await uploadBytesResumable(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function deletePhoto(
  userId: string,
  photoId: string
): Promise<void> {
  const storageRef = ref(firebaseStorage, `users/${userId}/photos/${photoId}`);
  await deleteObject(storageRef);
}
