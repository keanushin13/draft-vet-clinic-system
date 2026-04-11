import React, { useState } from 'react'; // âœ… make sure useState is imported
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetProfileDesign';
import CustomModal from '../../../components/CustomModal';

const VetProfile = ({ navigation }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Blue Brand Header */}
      <View style={styles.topHeader}>
        <Image
          source={require('../../assets/paw1.png')}
          style={{ width: 30, height: 30, marginRight: 10, tintColor: '#fff' }}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Teal Profile Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Account Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
          <Image
            source={require('../../assets/Bell_Icon.png')}
            style={{ width: 22, height: 22, tintColor: '#fff' }}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <View style={styles.profileContent}>
        <View style={styles.avatarCircle}>
          <Image
            source={require('../../assets/Profile.png')}
            style={{ width: 60, height: 60, tintColor: '#2c4760' }}
          />
        </View>

        <Text style={styles.userName}>BOSS VET</Text>
        <Text style={styles.userRole}>Staff ID: VET-2026-001</Text>

        {/* LOGOUT BUTTON - Open Confirmation Modal */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('VetDashboard')} style={styles.navItem}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('VetMessages')} style={styles.navItem}>
          <Image source={require('../../assets/Message_Icon.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, { tintColor: '#5ba1a6' }]} />
          <Text style={[styles.navLabel, { color: '#5ba1a6' }]}>Account</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <CustomModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        extraAction={
          <>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setShowLogoutModal(false);
                navigation.replace("login");
              }}
            >
              <Text>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </>
        }
      >
        Are you sure you want to logout?
      </CustomModal>
    </SafeAreaView>
  );
};

export default VetProfile;
