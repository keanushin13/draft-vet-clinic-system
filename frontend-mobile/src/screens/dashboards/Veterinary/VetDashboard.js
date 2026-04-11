import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetDashboardDesign';

const VetDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topHeader}>
        <Image 
          source={require('../../assets/paw1.png')} 
          style={styles.headerLogo} 
          resizeMode="contain" 
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Welcome Bar with Clickable Notification Bell */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Welcome, Veterinarian</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
           <Image 
             source={require('../../assets/Bell_Icon.png')} 
             style={[styles.notifIcon, { tintColor: '#2c4760' }]} 
             resizeMode="contain" 
           />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.menuGrid}>
          
          {/* Patients Section */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('VetPatients')}
          >
            <View style={styles.iconCircle}>
              <Image 
                source={require('../../assets/Pets_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#2c4760' }]} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.menuLabel}>Patients</Text>
          </TouchableOpacity>

          {/* Calendar Section */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('VetAppointment')}
          >
            <View style={styles.iconCircle}>
              <Image 
                source={require('../../assets/Appointment_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#2c4760' }]} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.menuLabel}>Calendar</Text>
          </TouchableOpacity>

          {/* Medical Records Section */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('VetMedRec')}
          >
            <View style={styles.iconCircle}>
              <Image 
                source={require('../../assets/Log_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#2c4760' }]} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.menuLabel}>Medical Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Nav */}
      <View style={styles.bottomNav}>
        {/* Home Button */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('vet-screen')}
        >
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#5ba1a6'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#5ba1a6'}]}>Home</Text>
        </TouchableOpacity>

        {/* Messages Button */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('VetMessages')}
        >
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} 
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        {/* Account Button - Now linked to VetProfile */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('VetProfile')}
        >
          <Image 
            source={require('../../assets/Profile.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} 
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetDashboard;