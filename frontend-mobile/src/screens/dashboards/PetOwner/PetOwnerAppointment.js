import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerAppointmentDesign';

const PetOwnerAppointment = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image 
            source={require('../../assets/paw1.png')} 
            style={styles.headerLogo} 
            resizeMode="contain"
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Appointment Title Bar with Back and Bell Buttons */}
      <View style={styles.appointmentBar}>
        <Text style={styles.appointmentText}>Appointment</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
                source={require('../../assets/Back_Icon.png')} 
                style={[styles.notifIcon, { marginRight: 15, tintColor: '#fff' }]} 
                resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Bell/Notification Button */}
          <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
            <Image 
                source={require('../../assets/Bell_Icon.png')} 
                style={styles.notifIcon} 
                resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.mainCard}>
          
          {/* Reason Section */}
          <Text style={styles.sectionLabel}>Reason for visit</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text>Check up</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {/* Date Section */}
          <Text style={styles.sectionLabel}>Choose date</Text>
          <View style={{ height: 180, backgroundColor: '#f9f9f9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' }}>
              <Text style={{ color: '#999' }}>[Interactive Calendar Area]</Text>
          </View>

          {/* Time Section */}
          <Text style={styles.sectionLabel}>Choose time</Text>
          <View style={styles.timeGrid}>
            <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>Morning</Text></TouchableOpacity>
            <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>Afternoon</Text></TouchableOpacity>
            <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>08:00</Text></TouchableOpacity>
            <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>01:00</Text></TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.actionButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('PetOwnerDashboard')}
        >
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, { tintColor: '#000' }]} 
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('PetOwnerMessages')}
        >
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, { tintColor: '#000' }]} 
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('PetOwnerProfile')}
        >
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={styles.navIcon} 
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerAppointment;