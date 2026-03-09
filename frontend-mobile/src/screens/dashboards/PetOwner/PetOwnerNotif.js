import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerNotifDesign';

const PetOwnerNotif = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Notifications</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Image source={require('../../assets/Back_Icon.png')} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.notifList}>
        {/* Appointment Notification */}
        <View style={styles.notifItem}>
          <View style={styles.notifDot} />
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Appointment Confirmed</Text>
            <Text style={styles.notifBody}>Your appointment with Dr. Sarah for Bella is confirmed for tomorrow at 08:00 AM.</Text>
            <Text style={styles.notifTime}>2 mins ago</Text>
          </View>
        </View>

        {/* Medical Record Notification */}
        <View style={styles.notifItem}>
          <View style={styles.notifDot} />
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Medical Record Updated</Text>
            <Text style={styles.notifBody}>New lab results have been uploaded for Max.</Text>
            <Text style={styles.notifTime}>1 hour ago</Text>
          </View>
        </View>

        {/* General Reminder */}
        <View style={styles.notifItem}>
          <View style={styles.notifDot} />
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>Vaccination Reminder</Text>
            <Text style={styles.notifBody}>Bella's Rabies vaccine is due in 1 week. Book an appointment now!</Text>
            <Text style={styles.notifTime}>Yesterday</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('petowner-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={styles.navIcon} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerNotif;