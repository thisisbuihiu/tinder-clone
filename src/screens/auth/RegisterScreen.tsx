import { useState } from "react";
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
import { signUp } from "@/services/auth";
import { createUser } from "@/services/firestore";
import { getEmailError, getPasswordError } from "@/utils/validation";
import { config } from "@/constants/config";

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password, config.minPasswordLength);

    if (emailError || passwordError) {
      setError(emailError || passwordError || "Please fix the errors above");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await signUp(email.trim(), password);
      try {
        await createUser(user.uid, {});
      } catch {
        // User doc creation failed; they can complete profile in EditProfile
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign up. Please try again.";
      if (typeof message === "string" && message.includes("auth/")) {
        if (message.includes("email-already-in-use"))
          setError("An account with this email already exists.");
        else if (message.includes("invalid-email"))
          setError("Please enter a valid email address.");
        else if (message.includes("weak-password"))
          setError(`Password must be at least ${config.minPasswordLength} characters.`);
        else setError("Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-gray-900 mb-1">Create account</Text>
        <Text className="text-gray-600 mb-8">Sign up to get started</Text>

        {error ? (
          <View className="bg-red-50 p-3 rounded-lg mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-base"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-4 text-base"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TextInput
          className="bg-gray-100 px-4 py-3 rounded-xl mb-6 text-base"
          placeholder="Confirm Password"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading}
          className="bg-[#E94057] py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
          >
            <Text className="text-[#E94057] font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
