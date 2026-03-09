import React, { useState } from 'react'; // ✅ import useState
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffProfileDesign';
import CustomModal from '../../../components/CustomModal'; // make sure path is correct

const StaffProfile = ({ navigation }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Staff Profile</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/Bell_Icon.png')} style={[styles.topIcon, {tintColor: '#fff'}]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Image & Role */}
        <View style={styles.profileSection}>
          <Image source={require('../../assets/paw1.png')} style={styles.profileImage} />
          <Text style={styles.staffName}>Aldwin Almadrones</Text>
          <Text style={styles.staffRole}>Clinic Staff / Assistant</Text>
        </View>

        {/* Info Details */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>aldwin@pawcruz.com</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+63 912 345 6789</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Staff ID</Text>
            <Text style={styles.infoValue}>SC-2026-001</Text>
          </View>

          {/* LOGOUT BUTTON - Open Modal */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#5ba1a6'}]} />
          <Text style={[styles.navLabel, {color: '#5ba1a6'}]}>Account</Text>
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

export default StaffProfile;
