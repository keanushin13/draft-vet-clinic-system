import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from "expo-linking";

// Core Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

//helpers
import ForgotPasswordScreen from "./src/screens/security/password/ForgotPasswordScreen";
import LoginOtpScreen from "./src/screens/security/LoginOtpScreen";
import UnlockAccountScreen from "./src/screens/security/UnlockAccountScreen";

// Admin Screens
import AdminDashboard from './src/screens/dashboards/Admin/AdminDashboard';
import AdminMessages from './src/screens/dashboards/Admin/AdminMessages';
import AdminNotif from './src/screens/dashboards/Admin/AdminNotif';
import AdminProfile from './src/screens/dashboards/Admin/AdminProfile';
import AdminUserManagement from './src/screens/dashboards/Admin/AdminUserManagement';

// Staff Screens
import StaffAppointment from './src/screens/dashboards/Staff/StaffAppointment';
import StaffDashboard from './src/screens/dashboards/Staff/StaffDashboard';
import StaffInventory from './src/screens/dashboards/Staff/StaffInventory';
import StaffLogs from './src/screens/dashboards/Staff/StaffLogs';
import StaffMessages from './src/screens/dashboards/Staff/StaffMessages';
import StaffMyPets from './src/screens/dashboards/Staff/StaffMyPets';
import StaffNotif from './src/screens/dashboards/Staff/StaffNotif';
import StaffPayHis from './src/screens/dashboards/Staff/StaffPayHis';
import StaffProfile from './src/screens/dashboards/Staff/StaffProfile';
import StaffUserManagement from './src/screens/dashboards/Staff/StaffUserManagement';

// Vet Screens
import VetAppointment from './src/screens/dashboards/Veterinary/VetAppointment';
import VetDashboard from './src/screens/dashboards/Veterinary/VetDashboard';
import VetMedRec from './src/screens/dashboards/Veterinary/VetMedRec';
import VetMessages from './src/screens/dashboards/Veterinary/VetMessages';
import VetNotif from './src/screens/dashboards/Veterinary/VetNotif';
import VetPatients from './src/screens/dashboards/Veterinary/VetPatients';
import VetProfile from './src/screens/dashboards/Veterinary/VetProfile';

// Pet Owner Screens
import PetOwnerAppointment from './src/screens/dashboards/PetOwner/PetOwnerAppointment';
import PetOwnerDashboard from './src/screens/dashboards/PetOwner/PetOwnerDashboard';
import PetOwnerMedRec from './src/screens/dashboards/PetOwner/PetOwnerMedRec';
import PetOwnerMessages from './src/screens/dashboards/PetOwner/PetOwnerMessages';
import PetOwnerMyPets from './src/screens/dashboards/PetOwner/PetOwnerMyPets';
import PetOwnerNotif from './src/screens/dashboards/PetOwner/PetOwnerNotif';
import PetOwnerProfile from './src/screens/dashboards/PetOwner/PetOwnerProfile';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    "petcare://",
    "https://yourdomain.com"
  ],
  config: {
    screens: {
      UnlockAccount: "unlock-account/:token",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication */}
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />

        <Stack.Screen
          name="forgot"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="otp"
          component={LoginOtpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="unlock"
          component={UnlockAccountScreen} />

        {/* Admin Flow */}
        <Stack.Screen name="admin-screen" component={AdminDashboard} />
        <Stack.Screen name="AdminUserManagement" component={AdminUserManagement} />
        <Stack.Screen name="AdminMessages" component={AdminMessages} />
        <Stack.Screen name="AdminProfile" component={AdminProfile} />
        <Stack.Screen name="AdminNotif" component={AdminNotif} />

        {/* Staff Flow */}
        <Stack.Screen name="staff-screen" component={StaffDashboard} />
        <Stack.Screen name="StaffAppointment" component={StaffAppointment} />
        <Stack.Screen name="StaffMyPets" component={StaffMyPets} />
        <Stack.Screen name="StaffInventory" component={StaffInventory} />
        <Stack.Screen name="StaffPayHis" component={StaffPayHis} />
        <Stack.Screen name="StaffLogs" component={StaffLogs} />
        <Stack.Screen name="StaffMessages" component={StaffMessages} />
        <Stack.Screen name="StaffProfile" component={StaffProfile} />
        <Stack.Screen name="StaffUserManagement" component={StaffUserManagement} />
        <Stack.Screen name="StaffNotif" component={StaffNotif} />

        {/* Vet Flow */}
        <Stack.Screen name="vet-screen" component={VetDashboard} />
        <Stack.Screen name="VetAppointment" component={VetAppointment} />
        <Stack.Screen name="VetPatients" component={VetPatients} />
        <Stack.Screen name="VetMedRec" component={VetMedRec} />
        <Stack.Screen name="VetMessages" component={VetMessages} />
        <Stack.Screen name="VetNotif" component={VetNotif} />
        <Stack.Screen name="VetProfile" component={VetProfile} />

        {/* Pet Owner Flow */}
        <Stack.Screen name="petowner-screen" component={PetOwnerDashboard} />
        <Stack.Screen name="PetOwnerAppointment" component={PetOwnerAppointment} />
        <Stack.Screen name="PetOwnerMedRec" component={PetOwnerMedRec} />
        <Stack.Screen name="PetOwnerMessages" component={PetOwnerMessages} />
        <Stack.Screen name="PetOwnerMyPets" component={PetOwnerMyPets} />
        <Stack.Screen name="PetOwnerNotif" component={PetOwnerNotif} />
        <Stack.Screen name="PetOwnerProfile" component={PetOwnerProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}