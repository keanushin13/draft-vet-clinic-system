import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/StaffAppointmentDesign';

const StaffAppointment = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Manage Appointments</Text>
        {/* Fixed: Changed <div> to <View> */}
        <View style={styles.headerIcons}>
          {/* Back Functionality */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={[styles.topIcon, {tintColor: '#fff'}]} resizeMode="contain" />
          </TouchableOpacity>
          
          {/* Notification Icon - Now linked to StaffNotif */}
          <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
            <Image source={require('../../assets/Bell_Icon.png')} style={[styles.topIcon, {tintColor: '#2c4760'}]} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.sectionLabel}>Upcoming Appointments</Text>

        {/* Appointment Card 1 */}
        <View style={styles.appointmentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName}>Bella</Text>
            <Text style={styles.dateText}>Feb 10, 2026</Text>
          </View>
          <Text style={styles.detailText}>Owner: Keanu Ribs</Text>
          <Text style={styles.detailText}>Reason: Vaccination (Rabies)</Text>
          <Text style={styles.detailText}>Time: 09:00 AM</Text>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>UPDATE STATUS</Text>
          </TouchableOpacity>
        </View>

        {/* Appointment Card 2 */}
        <View style={styles.appointmentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName}>Max</Text>
            <Text style={styles.dateText}>Feb 12, 2026</Text>
          </View>
          <Text style={styles.detailText}>Owner: John Doe</Text>
          <Text style={styles.detailText}>Reason: Routine Check-up</Text>
          <Text style={styles.detailText}>Time: 02:30 PM</Text>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>UPDATE STATUS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {/* Home Navigation */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        {/* Messages - Now linked to StaffMessages */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        
        {/* Account - Now linked to StaffProfile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffAppointment;