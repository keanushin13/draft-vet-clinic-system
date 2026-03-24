import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerProfileDesign';
import CustomModal from '../../../components/CustomModal';

const buildProfileFromUser = (user) => ({
  username:
    user?.username ||
    user?.name ||
    user?.fullName ||
    'Pet Owner',
  fullName:
    user?.fullName ||
    user?.name ||
    user?.username ||
    'Pet Owner',
  email: user?.email || '',
  contact: user?.contact || user?.phone || '',
  emergencyContact: user?.emergencyContact || '',
  address: user?.address || '',
  age: String(user?.age || ''),
  profileImageUri: user?.profileImageUri || user?.avatar || '',
});

const PetOwnerProfile = ({ navigation, route }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showProfileToast, setShowProfileToast] = useState(false);

  const loggedInUser = route?.params?.user;

  const [profileData, setProfileData] = useState(buildProfileFromUser(loggedInUser));

  const [draftProfile, setDraftProfile] = useState(profileData);
  const currentUser = { ...(loggedInUser || {}), ...profileData };

  useEffect(() => {
    const syncedProfile = buildProfileFromUser(loggedInUser);
    setProfileData(syncedProfile);
    setDraftProfile(syncedProfile);
  }, [loggedInUser]);

  useEffect(() => {
    if (!showProfileToast) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowProfileToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showProfileToast]);

  const bottomNavItems = [
    {
      key: 'home',
      label: 'Home',
      icon: require('../../assets/Dashboard_Icon.png'),
      route: 'petowner-screen',
      active: false,
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: require('../../assets/Message_Icon.png'),
      route: 'PetOwnerMessages',
      active: false,
    },
    {
      key: 'account',
      label: 'Account',
      icon: require('../../assets/User_Icon.png'),
      route: 'PetOwnerProfile',
      active: true,
    },
  ];

  const openEditMode = () => {
    setDraftProfile(profileData);
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setDraftProfile(profileData);
    setIsEditing(false);
  };

  const saveProfile = () => {
    setProfileData(draftProfile);
    setShowSaveConfirm(false);
    setIsEditing(false);
    setShowProfileToast(true);
    navigation.setParams({
      user: { ...(loggedInUser || {}), ...draftProfile },
    });
  };

  const updateDraftField = (field, value) => {
    setDraftProfile((current) => ({ ...current, [field]: value }));
  };

  const pickPhotoFromAlbum = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    updateDraftField('profileImageUri', result.assets[0].uri);
  };

  const pickPhotoFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    updateDraftField('profileImageUri', result.assets[0].uri);
  };

  return (
    <LinearGradient
      colors={['#022c42', '#0c212b', '#15394e']}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#123554', '#1b4d74', '#245f8e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBar}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.brandSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Image
                  source={require('../../assets/Back_Icon.png')}
                  style={styles.backIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.brandBlock}>
                <Text style={styles.headerTitle}>PawCruz</Text>
                <Text style={styles.headerSubtitle}>Pet Owner Profile</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notifButton}
              onPress={() => navigation.navigate('PetOwnerNotif', { user: currentUser })}
              activeOpacity={0.85}
            >
              <View style={styles.notifBadge} />
              <Image
                source={require('../../assets/Bell_Icon.png')}
                style={styles.notifIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {showProfileToast ? (
            <View style={styles.notificationToast}>
              <View style={styles.notificationPointer} />
              <Text style={styles.notificationToastTitle}>Profile Updated</Text>
              <Text style={styles.notificationToastText}>
                Your profile changes were saved successfully.
              </Text>
            </View>
          ) : null}

          <View style={styles.headerBottomRow}>
            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Account overview</Text>
              <Text style={styles.ownerName}>{profileData.username}</Text>
            </View>

            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>Profile active</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient
            colors={['#7aa4c8', '#698fb0', '#567997']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text style={styles.heroEyebrow}>Account details</Text>
            <Text style={styles.heroTitle}>Manage your pet owner profile</Text>
            <Text style={styles.heroDescription}>
              Review your account details, contact information, and profile
              status in one clean dashboard-style view.
            </Text>
          </LinearGradient>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>
              {isEditing ? 'Edit Profile' : 'Profile Overview'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {isEditing
                ? 'Update your profile details just like the pet edit flow'
                : 'Main owner information and quick account summary'}
            </Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarWrap}>
                {((isEditing ? draftProfile.profileImageUri : profileData.profileImageUri)) ? (
                  <Image
                    source={{
                      uri: isEditing
                        ? draftProfile.profileImageUri
                        : profileData.profileImageUri,
                    }}
                    style={styles.avatarCustom}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/paw1.png')}
                    style={styles.avatar}
                    resizeMode="contain"
                  />
                )}
              </View>

              <View style={styles.profileTopContent}>
                <Text style={styles.profileName}>
                  {isEditing ? draftProfile.fullName : profileData.fullName}
                </Text>
                <Text style={styles.profileMeta}>
                  {isEditing ? draftProfile.age : profileData.age} years old
                </Text>
                <Text style={styles.profileMeta}>
                  {isEditing ? draftProfile.address : profileData.address}
                </Text>
              </View>
            </View>

            {isEditing ? (
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>Profile Photo</Text>
                <View style={styles.photoSourceRow}>
                  <TouchableOpacity
                    style={styles.photoSourceButton}
                    onPress={pickPhotoFromAlbum}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.photoSourceText}>Choose from Album</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoSourceButton}
                    onPress={pickPhotoFromFiles}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.photoSourceText}>Choose from Files</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  value={draftProfile.fullName}
                  onChangeText={(value) => updateDraftField('fullName', value)}
                  style={styles.inputField}
                  placeholder="Enter full name"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Username</Text>
                <TextInput
                  value={draftProfile.username}
                  onChangeText={(value) => updateDraftField('username', value)}
                  style={styles.inputField}
                  placeholder="Enter username"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  value={draftProfile.email}
                  onChangeText={(value) => updateDraftField('email', value)}
                  style={styles.inputField}
                  placeholder="Enter email"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Contact</Text>
                <TextInput
                  value={draftProfile.contact}
                  onChangeText={(value) => updateDraftField('contact', value)}
                  style={styles.inputField}
                  placeholder="Enter contact number"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Emergency Contact</Text>
                <TextInput
                  value={draftProfile.emergencyContact}
                  onChangeText={(value) =>
                    updateDraftField('emergencyContact', value)
                  }
                  style={styles.inputField}
                  placeholder="Enter emergency contact"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  value={draftProfile.address}
                  onChangeText={(value) => updateDraftField('address', value)}
                  style={styles.inputField}
                  placeholder="Enter address"
                  placeholderTextColor="#87a0b1"
                />

                <Text style={styles.formLabel}>Age</Text>
                <TextInput
                  value={draftProfile.age}
                  onChangeText={(value) =>
                    updateDraftField('age', value.replace(/[^0-9]/g, ''))
                  }
                  style={styles.inputField}
                  placeholder="Enter age"
                  placeholderTextColor="#87a0b1"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            ) : (
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Username</Text>
                  <Text style={styles.infoValue}>{profileData.username}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData.email || 'No email found'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>{profileData.contact}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Emergency</Text>
                  <Text style={styles.infoValue}>{profileData.emergencyContact}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <Text style={styles.sectionSubtitle}>
              Update your account or safely sign out
            </Text>
          </View>

          <View style={styles.actionCard}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setShowSaveConfirm(true)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.editButtonText}>Done</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={cancelEditMode}
                  activeOpacity={0.9}
                >
                  <Text style={styles.cancelEditButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={openEditMode}
                  activeOpacity={0.9}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => setShowLogoutModal(true)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, item.active && styles.activeNavItem]}
              onPress={() => navigation.navigate(item.route, { user: currentUser })}
              activeOpacity={0.9}
            >
              <View
                style={[styles.navIconWrap, item.active && styles.activeNavIconWrap]}
              >
                <Image
                  source={item.icon}
                  style={[styles.navIcon, item.active && styles.activeNavIcon]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.navLabel, item.active && styles.activeNavLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          transparent
          animationType="fade"
          visible={showSaveConfirm}
          onRequestClose={() => setShowSaveConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Save Profile</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to save these profile changes?
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowSaveConfirm(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={saveProfile}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalPrimaryText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <CustomModal
          show={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          extraAction={
            <>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  navigation.replace('login');
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.confirmBtnText}>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.9}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          }
        >
          Are you sure you want to logout?
        </CustomModal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerProfile;
