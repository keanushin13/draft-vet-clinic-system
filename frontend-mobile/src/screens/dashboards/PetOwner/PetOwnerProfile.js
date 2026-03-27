import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
  const scrollViewRef = useRef(null);

  const loggedInUser = route?.params?.user;

  const [profileData, setProfileData] = useState(buildProfileFromUser(loggedInUser));

  const [draftProfile, setDraftProfile] = useState(profileData);
  const currentUser = { ...(loggedInUser || {}), ...profileData };
  const profileImageUri = currentUser?.profileImageUri || currentUser?.avatar || '';
  const headerMenuAnimation = useRef(new Animated.Value(0)).current;
  const lowerHeaderAnimation = useRef(new Animated.Value(1)).current;
  const isHeaderMenuAnimating = useRef(false);
  const isLowerHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const headerMenuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: require('../../assets/Dashboard_Icon.png'),
      route: 'petowner-screen',
    },
    {
      key: 'appointment',
      label: 'Appointment',
      icon: require('../../assets/Appointment_Icon.png'),
      route: 'PetOwnerAppointment',
    },
    {
      key: 'mypets',
      label: 'My Pets',
      icon: require('../../assets/Pets_Icon.png'),
      route: 'PetOwnerMyPets',
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: require('../../assets/Message_Icon.png'),
      route: 'PetOwnerMessages',
    },
    {
      key: 'medical',
      label: 'Medical Records',
      icon: require('../../assets/Medical_Icon.png'),
      route: 'PetOwnerMedRec',
    },
  ];

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

  const openHeaderMenu = () => {
    if (isHeaderMenuVisible || isHeaderMenuAnimating.current) {
      return;
    }

    isHeaderMenuAnimating.current = true;
    setIsHeaderMenuVisible(true);
    headerMenuAnimation.stopAnimation();
    Animated.timing(headerMenuAnimation, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      isHeaderMenuAnimating.current = false;
    });
  };

  const closeHeaderMenu = (onClosed) => {
    if (isHeaderMenuAnimating.current) {
      return;
    }

    if (!isHeaderMenuVisible) {
      onClosed?.();
      return;
    }

    isHeaderMenuAnimating.current = true;
    headerMenuAnimation.stopAnimation();
    Animated.timing(headerMenuAnimation, {
      toValue: 0,
      duration: 220,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      isHeaderMenuAnimating.current = false;
      setIsHeaderMenuVisible(false);
      onClosed?.();
    });
  };

  const toggleHeaderMenu = () => {
    if (isHeaderMenuVisible) {
      closeHeaderMenu();
      return;
    }

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    openHeaderMenu();
  };

  const handleHeaderMenuPress = (routeName) => {
    closeHeaderMenu();
    navigation.navigate(routeName, { user: currentUser });
  };

  const animateLowerHeader = (toValue) => {
    const shouldBeVisible = toValue === 1;

    if (isLowerHeaderVisible.current === shouldBeVisible) {
      return;
    }

    isLowerHeaderVisible.current = shouldBeVisible;
    lowerHeaderAnimation.stopAnimation();
    Animated.timing(lowerHeaderAnimation, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY.current + 4 && currentScrollY > 8) {
      if (isHeaderMenuVisible) {
        closeHeaderMenu(() => animateLowerHeader(0));
        lastScrollY.current = currentScrollY;
        return;
      }
      animateLowerHeader(0);
    } else if (currentScrollY < lastScrollY.current - 4 || currentScrollY <= 0) {
      animateLowerHeader(1);
    }

    lastScrollY.current = currentScrollY;
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
            <TouchableOpacity
              style={styles.brandSection}
              onPress={() => navigation.navigate('petowner-screen', { user: currentUser })}
              activeOpacity={0.85}
            >
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.brandBlock}>
                <Text style={styles.headerTitle}>PawCruz</Text>
                <Text style={styles.headerSubtitle}>Pet Owner Profile</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
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

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('PetOwnerProfile', { user: currentUser })}
                activeOpacity={0.85}
              >
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.profileButtonImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/User_Icon.png')}
                    style={styles.profileIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
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

          <Animated.View
            style={[
              styles.headerBottomRowWrap,
              {
                maxHeight: lowerHeaderAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 96],
                }),
                opacity: lowerHeaderAnimation,
                transform: [
                  {
                    translateY: lowerHeaderAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-18, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.headerBottomRow}>
            <TouchableOpacity
              style={styles.menuTriggerButton}
              onPress={toggleHeaderMenu}
              activeOpacity={0.85}
            >
              <Image
                source={require('../../assets/List.png')}
                style={styles.menuTriggerIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Account overview</Text>
              <Text style={styles.ownerName}>{profileData.username}</Text>
            </View>
            </View>
          </Animated.View>

          {isHeaderMenuVisible ? (
            <Animated.View
              style={[
                styles.headerMenuPanel,
                {
                  opacity: headerMenuAnimation,
                  transform: [
                    {
                      translateY: headerMenuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-18, 0],
                      }),
                    },
                    {
                      scale: headerMenuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {headerMenuItems.map((item, index) => {
                const itemEnterStart = index * 0.08;
                const itemOpacity = headerMenuAnimation.interpolate({
                  inputRange: [itemEnterStart, itemEnterStart + 0.45, 1],
                  outputRange: [0, 1, 1],
                  extrapolate: 'clamp',
                });
                const itemTranslateY = headerMenuAnimation.interpolate({
                  inputRange: [itemEnterStart, 1],
                  outputRange: [14, 0],
                  extrapolate: 'clamp',
                });
                const itemScale = headerMenuAnimation.interpolate({
                  inputRange: [itemEnterStart, 1],
                  outputRange: [0.97, 1],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={item.key}
                    style={{
                      opacity: itemOpacity,
                      transform: [{ translateY: itemTranslateY }, { scale: itemScale }],
                    }}
                  >
                    <TouchableOpacity
                      style={styles.headerMenuItem}
                      onPress={() => handleHeaderMenuPress(item.route)}
                      activeOpacity={0.88}
                    >
                      <View style={styles.headerMenuItemIconWrap}>
                        <Image
                          source={item.icon}
                          style={styles.headerMenuItemIcon}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.headerMenuItemLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </Animated.View>
          ) : null}
        </LinearGradient>

        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate('PetOwnerMessages', { user: currentUser })}
            activeOpacity={0.9}
          >
            <View style={[styles.navIconWrap, styles.activeNavIconWrap]}>
              <Image
                source={require('../../assets/support.png')}
                style={[styles.navIcon, styles.activeNavIcon]}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
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
