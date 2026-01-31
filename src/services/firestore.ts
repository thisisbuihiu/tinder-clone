import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, Gender, LookingFor } from "@/types";

export type FirestoreUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function toUser(docData: FirestoreUser): User {
  return {
    ...docData,
    createdAt: {
      seconds: docData.createdAt.seconds,
      nanoseconds: docData.createdAt.nanoseconds,
    },
    updatedAt: {
      seconds: docData.updatedAt.seconds,
      nanoseconds: docData.updatedAt.nanoseconds,
    },
  };
}

export async function createUser(
  uid: string,
  data: Partial<Omit<FirestoreUser, "uid" | "createdAt" | "updatedAt">>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const userData = {
    uid,
    name: data.name ?? "",
    age: data.age ?? 0,
    bio: data.bio ?? "",
    gender: data.gender ?? "other",
    lookingFor: data.lookingFor ?? "both",
    photoURLs: data.photoURLs ?? [],
    city: data.city ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, userData);
}

export async function updateUser(
  uid: string,
  data: Partial<Omit<FirestoreUser, "uid" | "createdAt" | "updatedAt">>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return toUser(snapshot.data() as FirestoreUser);
}
