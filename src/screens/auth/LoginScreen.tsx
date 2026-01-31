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
import { signIn } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { getEmailError, getPasswordError } from "@/utils/validation";
import { config } from "@/constants/config";

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password, config.minPasswordLength);

    if (emailError || passwordError) {
      setError(emailError || passwordError || "Please fix the errors above");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in. Please try again.";
      if (typeof message === "string" && message.includes("auth/")) {
        if (message.includes("user-not-found") || message.includes("wrong-password"))
          setError("Invalid email or password.");
        else if (message.includes("invalid-email"))
          setError("Please enter a valid email address.");
        else if (message.includes("too-many-requests"))
          setError("Too many attempts. Please try again later.");
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
        <Text className="text-3xl font-bold text-gray-900 mb-1">Welcome back</Text>
        <Text className="text-gray-600 mb-8">Sign in to continue</Text>

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
          className="bg-gray-100 px-4 py-3 rounded-xl mb-6 text-base"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="bg-[#E94057] py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={isLoading}
          >
            <Text className="text-[#E94057] font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
