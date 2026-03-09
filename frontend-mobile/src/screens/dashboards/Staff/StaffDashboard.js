import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffDashboardDesign';

const StaffDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Welcome Bar */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Welcome, Staff</Text>
        <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
           <Image source={require('../../assets/Bell_Icon.png')} style={[styles.notifIcon, { tintColor: '#2c4760' }]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.menuGrid}>
          {/* Appointment */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffAppointment')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/Appointment_Icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>Appointment</Text>
          </TouchableOpacity>

          {/* My Pets */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffMyPets')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/Pets_Icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>My Pets</Text>
          </TouchableOpacity>

          {/* User - Renamed and Linked */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffUserManagement')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/UserManagement_Icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>User</Text>
          </TouchableOpacity>

          {/* Inventory */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffInventory')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/Inventory_Icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>Inventory</Text>
          </TouchableOpacity>

          {/* Payment */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffPayHis')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/payment_icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>Payment</Text>
          </TouchableOpacity>

          {/* Logs */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StaffLogs')}>
            <View style={styles.iconCircle}><Image source={require('../../assets/Log_Icon.png')} style={[styles.iconImage, { tintColor: '#000' }]} resizeMode="contain" /></View>
            <Text style={styles.menuLabel}>Logs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#5ba1a6'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#5ba1a6'}]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffDashboard;