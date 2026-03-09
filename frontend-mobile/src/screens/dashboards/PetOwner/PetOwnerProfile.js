import React, { useState } from 'react'; // ✅ import useState
import {
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerProfileDesign';
import CustomModal from '../../../components/CustomModal'; // adjust path if needed

const PetOwnerProfile = ({ navigation }) => {
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
        <Text style={styles.titleText}>Pet Owner Profile</Text>
        <View style={styles.headerIcons}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          {/* Notification Button */}
          <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
            <Image source={require('../../assets/Bell_Icon.png')} style={styles.notifIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        {/* User Avatar and Primary Info */}
        <View style={styles.profileRow}>
          <Image source={require('../../assets/paw1.png')} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Keanu Ribs</Text>
            <Text style={styles.userBasicInfo}>21 YEARS OLD</Text>
            <Text style={styles.userBasicInfo}>Menudo Manila, 1900</Text>
          </View>
        </View>

        {/* User Contact Details */}
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>Keanuribs@gmail.com</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>+69123456789</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Emergency Contact:</Text>
            <Text style={styles.detailValue}>+0912456789</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
          
          {/* LOGOUT BUTTON - Open Confirmation Modal */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>

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

export default PetOwnerProfile;
