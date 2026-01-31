/**
 * TypeScript interfaces for Tinder Clone MVP
 * Will be populated in Step 2
 */

export type Gender = "male" | "female" | "other";
export type LookingFor = "male" | "female" | "both";

export interface User {
  uid: string;
  name: string;
  age: number;
  bio: string;
  gender: Gender;
  lookingFor: LookingFor;
  photoURLs: string[];
  city: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

// Placeholder - will be refined when Firebase is added
export type FirebaseTimestamp = { seconds: number; nanoseconds: number };
