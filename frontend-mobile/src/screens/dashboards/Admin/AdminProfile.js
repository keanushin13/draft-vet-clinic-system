import React, { useState } from 'react'; // ✅ import useState
import {
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerProfileDesign'; // reusing your style file
import CustomModal from '../../../components/CustomModal'; // adjust path if needed

const AdminProfile = ({ navigation }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* 2. Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Admin Profile</Text>
        <View style={styles.headerIcons}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          {/* Notification Button */}
          <TouchableOpacity onPress={() => navigation.navigate('AdminNotif')}>
            <Image 
                source={require('../../assets/Bell_Icon.png')} 
                style={[styles.notifIcon, { tintColor: '#000000' }]} 
                resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <Image source={require('../../assets/paw1.png')} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Admin User</Text>
            <Text style={styles.userBasicInfo}>SYSTEM ADMINISTRATOR</Text>
            <Text style={styles.userBasicInfo}>Taguig, Metro Manila</Text>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>admin@pawcruz.com</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>+63 912 345 6789</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Access Level:</Text>
            <Text style={styles.detailValue}>Full Super Admin</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
          
          {/* LOGOUT BUTTON - Open Modal */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('admin-screen')}>
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminMessages')}>
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#2c4760'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#2c4760'}]}>Account</Text>
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

export default AdminProfile;
