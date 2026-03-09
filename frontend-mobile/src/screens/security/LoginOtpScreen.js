// LoginOtpScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import API from "../../api/api";

const OTP_LENGTH = 6;

const LoginOtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/users/verify-login-otp", { email, otp: otpValue });
      // Save user data if needed
      // localStorage equivalent could be AsyncStorage
      // Navigate based on role
      const role = res.data.user.role;
      if (role === "admin") navigation.replace("admin-screen");
      else if (role === "veterinarian") navigation.replace("vet-screen");
      else if (role === "staff") navigation.replace("staff-screen");
      else if (role === "pet_owner") navigation.replace("petowner-screen");
      else navigation.replace("login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;

    try {
      await API.post("/users/resend-login-otp", { email });
      setMessage("A new code has been sent.");
      setCooldown(60);
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to:</Text>
          <Text style={styles.email}>{email}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {message ? <Text style={styles.success}>{message}</Text> : null}

          <View style={styles.otpContainer}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(val) => handleChange(val, i)}
                keyboardType="number-pad"
                maxLength={1}
                onKeyPress={(e) => handleKeyPress(e, i)}
                autoFocus={i === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify & Log In"}</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {cooldown > 0 ? `Resend code in ${cooldown}s` : ""}
            </Text>
            <TouchableOpacity onPress={resendOtp} disabled={cooldown > 0}>
              <Text style={styles.subtitle}>Didn't get the code?</Text>
              <Text style={[styles.resendLink, cooldown > 0 && styles.disabledResend]}>
                Resend New Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f4e79",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: "#1f4e79",
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 2,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1f4e79",
    backgroundColor: "#f8fafc",
  },
  button: {
    width: "100%",
    backgroundColor: "#1f4e79",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#a0c4f2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  resendText: {
    color: "#64748b",
    fontSize: 14,
  },
  resendLink: {
    color: "#1f4e79",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  disabledResend: {
    color: "#94a3b8",
  },
  error: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "#16a34a",
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
  },
});
