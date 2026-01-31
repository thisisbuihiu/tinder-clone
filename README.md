# Tinder Clone MVP

A React Native (Expo) dating app clone with Firebase backend.

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn
- Expo Go app (for testing on device)

## Setup

### 1. Install dependencies

```bash
# If you get npm cache permission errors, run:
# sudo chown -R $(whoami) ~/.npm

npm install
```

### 2. Firebase configuration

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password sign-in method
3. Enable **Firestore Database** (create database in production mode, then add rules from `firestore.rules`)
4. Enable **Storage** (add rules from `storage.rules`)
5. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```
6. Add your Firebase config to `.env` (Project Settings → General → Your apps):

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the app

```bash
npm start
```

Then scan the QR code with Expo Go (Android) or Camera (iOS).

## Implemented Steps

- **Step 1**: Bootstrap Expo + Dependencies + Folder Structure ✓
- **Step 2**: Firebase + Auth Screens (Login, Register) ✓
- **Step 3**: Profile Setup + Photo Upload + Firestore User Doc ✓
- **Step 4**: Discover Deck + Swipe Actions (pending)
- **Step 5**: Match Creation Logic (pending)
- **Step 6**: Matches List + Chat (pending)

## Test Checklist (Step 2)

- [ ] Can register new user
- [ ] Can login with existing credentials
- [ ] Session persists on app restart
- [ ] Can logout from Profile tab
- [ ] Navigation switches between Auth stack and App stack based on auth state

## Test Checklist (Step 3)

- [ ] User doc created in Firestore on registration
- [ ] Can upload photos from library
- [ ] Photos appear in profile
- [ ] Can edit name/age/bio/gender/lookingFor/city
- [ ] Changes persist to Firestore
- [ ] Validation prevents invalid inputs
