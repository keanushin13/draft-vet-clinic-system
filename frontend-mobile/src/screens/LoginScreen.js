import React, { useState } from "react";

import { LinearGradient } from 'expo-linear-gradient';

import { loginUser } from "../routes/userRoutes";

import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View
} from "react-native";

import CustomModal from "../components/CustomModal";
import eyeShow from "./assets/eye-show.png";
import eyeHide from "./assets/eye-hide.png";
import API from "../api/api";


export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        message: "",
        extraAction: null,
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSendUnlock = async () => {
        try {
            if (!username) {
                setAlertModal({
                    show: true,
                    message: "Please enter your username first to send the unlock email.",
                    extraAction: null,
                });
                return;
            }

            const res = await API.post("/users/send-unlock-email", { username });

            setAlertModal({
                show: true,
                message: res.data.message,
                extraAction: null,
            });
        } catch (err) {
            setAlertModal({
                show: true,
                message: err.response?.data?.message || "Could not send email.",
                extraAction: null,
            });
        }
    };

    const handleOtpSuccess = (user) => {
        const role = user.role;
        if (role === "admin") navigation.navigate("Admin");
        else if (role === "veterinarian") navigation.navigate("Vet");
        else if (role === "staff") navigation.navigate("Staff");
        else if (role === "pet_owner") navigation.navigate("petowner-screen");
        else navigation.navigate("login");
    };

    const handleLogin = async () => {
        try {
            const response = await loginUser({
                username: username,
                password: password,
            });

            // Backend sends OTP stage
            if (response.requiresOtp) {
                // Directly navigate to OTP screen
                navigation.navigate("otp", { email: response.email });
                return;
            }

            // Handle successful login
            handleOtpSuccess(response.user); // if you have this function

        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Something went wrong";

            if (status === 429) {
                // Account locked → show send unlock button
                setAlertModal({
                    show: true,
                    message: message,
                    extraAction: (
                        <TouchableOpacity style={styles.modalButton} onPress={handleSendUnlock}>
                            <Text style={[styles.buttonText, { color: "#2c7be5" }]}>Send Unlock Email</Text>
                        </TouchableOpacity>
                    ),
                });
            } else {
                setAlertModal({
                    show: true,
                    message: `${message}`,
                    extraAction: null,
                });
            }
        }
    };

    return (
        <LinearGradient colors={['#add8e6', '#5b7a8c']} style={styles.container} >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.innerContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.headerContainer}>
                            <Image
                                source={require('./assets/paw1.png')}
                                style={styles.logo}
                            />
                            <Text style={styles.brandText}>PawCruz</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.loginTitle}>LOG IN</Text>
                            <Text style={styles.subText}>Please enter your details.</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Username:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Enter username"
                                    placeholderTextColor="#b0c4de"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    placeholder="Enter password"
                                    placeholderTextColor="#b0c4de"

                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={togglePasswordVisibility}
                                >
                                    <Image
                                        source={showPassword ? eyeHide : eyeShow}
                                        style={styles.eyeImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={{ marginLeft: 190 }} onPress={() => navigation.navigate("forgot")}>
                                <Text style={styles.registerText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleLogin}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <Text style={styles.footerText}>
                                Don't have an account yet?{' '}
                                <Text
                                    style={styles.registerText}
                                    onPress={() => navigation.navigate('register')}
                                >
                                    Register
                                </Text>
                            </Text>
                        </View>

                        <CustomModal
                            show={alertModal.show}
                            onClose={() =>
                                setAlertModal({
                                    show: false,
                                    message: "",
                                    extraAction: null,
                                })
                            }
                            extraAction={alertModal.extraAction}
                        >
                            <Text>{alertModal.message}</Text>
                        </CustomModal>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    innerContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    headerContainer: {
        alignItems: 'center', // Centers the logo and text vertically
        marginBottom: 40,
        width: '100%',
    },
    logo: {
        width: 100, // Made the paw much bigger
        height: 100,
        marginBottom: 10, // Space between paw and "PawCruz"
    },
    brandText: {
        fontSize: 42, // Increased for a bolder look
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    card: {
        backgroundColor: '#fff',
        width: '88%',
        maxWidth: 400,
        borderRadius: 35,
        padding: 30,
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0px 10px 25px rgba(0,0,0,0.15)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
                elevation: 10,
            }
        }),
    },
    loginTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5b7a8c',
        marginBottom: 5,
    },
    subText: {
        fontSize: 14,
        color: '#7da0b1',
        marginBottom: 25,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        color: '#5b7a8c',
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '600',
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1.5,
        borderColor: '#e1edf3',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fbfdfe',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    forgotText: {
        color: '#8da9b9',
        fontSize: 12,
    },
    button: {
        backgroundColor: '#6a89a1',
        width: '100%',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        color: '#888',
        fontSize: 14,
    },
    registerText: {
        color: '#8da9b9',
        fontWeight: 'bold',
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: "65%",
        transform: [{ translateY: -11 }],
        opacity: 0.6,
        zIndex: 5,
    },

    eyeImage: {
        width: 22,
        height: 22,
    },
});
