import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/PetOwnerDashboardDesign';

const PetOwnerDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Welcome Bar */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Welcome, Pet Owner</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
          {/* Black tint applied to Notification Bell */}
          <Image 
            source={require('../../assets/Bell_Icon.png')} 
            style={[styles.notifIcon, { tintColor: '#000000' }]} 
          />
        </TouchableOpacity>
      </View>

      {/* Main Grid */}
      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PetOwnerAppointment')}>
          <View style={styles.iconCircle}>
            {/* Black tint applied */}
            <Image 
                source={require('../../assets/Appointment_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#000000' }]} 
                resizeMode="contain" 
            />
          </View>
          <Text style={styles.menuLabel}>Book{"\n"}Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PetOwnerMyPets')}>
          <View style={styles.iconCircle}>
            {/* Black tint applied */}
            <Image 
                source={require('../../assets/Pets_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#000000' }]} 
                resizeMode="contain" 
            />
          </View>
          <Text style={styles.menuLabel}>My Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PetOwnerMedRec')}>
          <View style={styles.iconCircle}>
            {/* Black tint applied & Path corrected to Medical_Icon.png */}
            <Image 
                source={require('../../assets/Medical_Icon.png')} 
                style={[styles.iconImage, { tintColor: '#000000' }]} 
                resizeMode="contain" 
            />
          </View>
          <Text style={styles.menuLabel}>Medical{"\n"}Records</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('petowner-screen')}>
          {/* Black tint applied to Home icon */}
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, { tintColor: '#000000' }]} 
          />
          <Text style={[styles.navLabel, { color: '#000000' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerMessages')}>
          {/* Black tint applied to Message icon */}
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, { tintColor: '#000000' }]} 
          />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerProfile')}>
          {/* No tintColor applied here so it stays original as requested */}
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={styles.navIcon} 
          />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerDashboard;