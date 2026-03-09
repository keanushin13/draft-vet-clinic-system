import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../../../api/api"; // adjust path if needed

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Required", "Please enter your email");
      return;
    }

    setLoading(true);
    setStatus("");
    setMessage("");

    try {
      const res = await API.post("/users/forgot-password", { email });

      setMessage(res.data.message || "Reset link sent to your email.");
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Email not found.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.subtitle}>
        Enter your email and we’ll send a reset link.
      </Text>

      {message !== "" && (
        <Text
          style={[
            styles.message,
            status === "success" ? styles.success : styles.error,
          ]}
        >
          {message}
        </Text>
      )}

      <TextInput
        placeholder="example@email.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={!loading && status !== "success"}
      />

      {status === "success" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("login")}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send Link"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginVertical: 15,
    color: "#666",
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },

  message: {
    textAlign: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },

  success: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },

  button: {
    flex: 1,
    padding: 15,
    backgroundColor: "#2c7be5",
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
