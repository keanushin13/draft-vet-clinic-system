import React, { useEffect, useMemo, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerMyPetsDesign';

const PET_PHOTO_OPTIONS = {
  pawBlue: require('../../assets/paw.png'),
  pawWhite: require('../../assets/paw1.png'),
  petBadge: require('../../assets/Pets_Icon.png'),
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1));
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, index) => String(CURRENT_YEAR - index));

const INITIAL_PETS = [
  {
    id: 'pet-1',
    referenceCode: 'PET-0001',
    name: 'Bella',
    breed: 'Golden Retriever',
    age: '3',
    birthMonth: 'April',
    birthDay: '14',
    birthYear: '2023',
    weight: '24 kg',
    sex: 'Female',
    profileColor: '#c7e6f7',
    profileImageKey: 'pawBlue',
    profileImageUri: '',
    medicalHistory: ['Allergy monitoring', 'Routine deworming completed'],
    vaccinations: ['Rabies - Updated', '5-in-1 - Updated'],
    visits: ['Mar 18, 2026 - Wellness check', 'Jan 09, 2026 - Vaccination follow-up'],
  },
  {
    id: 'pet-2',
    referenceCode: 'PET-0002',
    name: 'Max',
    breed: 'Persian Cat',
    age: '2',
    birthMonth: 'September',
    birthDay: '2',
    birthYear: '2024',
    weight: '5 kg',
    sex: 'Male',
    profileColor: '#d8eefb',
    profileImageKey: 'pawWhite',
    profileImageUri: '',
    medicalHistory: ['Skin treatment review', 'Ear cleaning record'],
    vaccinations: ['Anti-rabies - Updated', '4-in-1 - Pending booster'],
    visits: ['Feb 14, 2026 - Diagnosis visit', 'Dec 06, 2025 - Grooming consult'],
  },
];

const buildReferenceCode = (count) => `PET-${String(count + 1).padStart(4, '0')}`;

const formatBirthday = (pet) => {
  if (!pet?.birthMonth || !pet?.birthDay || !pet?.birthYear) {
    return '-';
  }

  return `${pet.birthMonth} ${pet.birthDay}, ${pet.birthYear}`;
};

const formatAge = (age) => {
  if (!age) {
    return '-';
  }

  const ageNumber = Number(age);
  if (Number.isNaN(ageNumber)) {
    return age;
  }

  return `${ageNumber} year${ageNumber === 1 ? '' : 's'} old`;
};

const getPetPhotoSource = (pet) => {
  if (pet?.profileImageUri) {
    return { source: { uri: pet.profileImageUri }, isCustom: true };
  }

  if (pet?.profileImageKey && PET_PHOTO_OPTIONS[pet.profileImageKey]) {
    return { source: PET_PHOTO_OPTIONS[pet.profileImageKey], isCustom: false };
  }

  return { source: null, isCustom: false };
};

const createEmptyPetDraft = (count) => ({
  id: `pet-${Date.now()}`,
  referenceCode: buildReferenceCode(count),
  name: '',
  breed: '',
  age: '',
  birthMonth: MONTHS[0],
  birthDay: '1',
  birthYear: YEARS[0],
  weight: '-',
  sex: '-',
  profileColor: '#d8eefb',
  profileImageKey: 'petBadge',
  profileImageUri: '',
  medicalHistory: [],
  vaccinations: [],
  visits: [],
});

const PetOwnerMyPets = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';

  const [pets, setPets] = useState(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState(INITIAL_PETS[0].id);
  const [screenMode, setScreenMode] = useState('list');
  const [draftPet, setDraftPet] = useState(null);
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showHeaderNotification, setShowHeaderNotification] = useState(false);
  const [showRequiredFieldsModal, setShowRequiredFieldsModal] = useState(false);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) || pets[0],
    [pets, selectedPetId],
  );

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
      active: false,
    },
  ];

  const activePet = screenMode === 'edit' ? draftPet : selectedPet;
  const activePhoto = getPetPhotoSource(activePet);

  useEffect(() => {
    if (!showHeaderNotification) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowHeaderNotification(false);
      setNotificationMessage('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [showHeaderNotification]);

  const showNotification = (message) => {
    setNotificationMessage(message);
    setShowHeaderNotification(true);
  };

  const updateDraftPetField = (field, value) => {
    setDraftPet((current) => ({ ...current, [field]: value }));
  };

  const startViewMode = (petId) => {
    setSelectedPetId(petId);
    setScreenMode('view');
    setDraftPet(null);
    setIsCreatingPet(false);
  };

  const startEditMode = () => {
    setDraftPet({ ...selectedPet });
    setScreenMode('edit');
    setIsCreatingPet(false);
  };

  const startAddMode = () => {
    setDraftPet(createEmptyPetDraft(pets.length));
    setScreenMode('edit');
    setIsCreatingPet(true);
  };

  const goBackFromDetails = () => {
    setDraftPet(null);
    setScreenMode('list');
    setIsCreatingPet(false);
  };

  const cancelEditMode = () => {
    setDraftPet(null);
    setScreenMode(isCreatingPet ? 'list' : 'view');
    setIsCreatingPet(false);
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

    updateDraftPetField('profileImageUri', result.assets[0].uri);
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

    updateDraftPetField('profileImageUri', result.assets[0].uri);
  };

  const hasEmptyRequiredField = (pet) =>
    !pet?.name?.trim() ||
    !pet?.breed?.trim() ||
    !pet?.age?.trim() ||
    !pet?.birthMonth ||
    !pet?.birthDay ||
    !pet?.birthYear;

  const handleDonePress = () => {
    if (hasEmptyRequiredField(draftPet)) {
      setShowRequiredFieldsModal(true);
      return;
    }

    setShowDoneConfirm(true);
  };

  const saveEditedPet = () => {
    const normalizedPet = {
      ...draftPet,
      name: draftPet.name.trim(),
      breed: draftPet.breed.trim(),
      age: draftPet.age.replace(/[^0-9]/g, ''),
    };

    if (isCreatingPet) {
      setPets((currentPets) => [...currentPets, normalizedPet]);
    } else {
      setPets((currentPets) =>
        currentPets.map((pet) => (pet.id === normalizedPet.id ? normalizedPet : pet)),
      );
    }

    setSelectedPetId(normalizedPet.id);
    setShowDoneConfirm(false);
    setScreenMode('view');
    setIsCreatingPet(false);
    setDraftPet(null);
    showNotification(
      isCreatingPet
        ? 'New pet profile added successfully.'
        : 'Pet profile updated successfully.',
    );
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
                <Text style={styles.headerSubtitle}>Pet Profile Management</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notifButton}
              onPress={() => navigation.navigate('PetOwnerNotif')}
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

          {showHeaderNotification ? (
            <View style={styles.headerNotificationToast}>
              <Text style={styles.headerNotificationText}>{notificationMessage}</Text>
              <View style={styles.headerNotificationPointer} />
            </View>
          ) : null}

          <View style={styles.headerBottomRow}>
            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Manage your pets</Text>
              <Text style={styles.ownerName}>{headerDisplayName}</Text>
            </View>

            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>{pets.length} profiles</Text>
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
            <Text style={styles.heroEyebrow}>Care overview</Text>
            <Text style={styles.heroTitle}>Add and manage pet profiles</Text>
            <Text style={styles.heroDescription}>
              Update pet information, review medical and vaccination records, and
              track visit history from one organized screen.
            </Text>
          </LinearGradient>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <Text style={styles.sectionSubtitle}>
              Select a pet profile to manage records and details
            </Text>
          </View>

          <View style={styles.petListCard}>
            {pets.map((pet) => {
              const isActive = pet.id === selectedPetId;
              const petPhoto = getPetPhotoSource(pet);

              return (
                <View
                  key={pet.id}
                  style={[styles.petRow, isActive && styles.petRowActive]}
                >
                  <View style={[styles.petAvatar, { backgroundColor: pet.profileColor }]}>
                    {petPhoto.source ? (
                      <Image
                        source={petPhoto.source}
                        style={[
                          styles.petAvatarImage,
                          petPhoto.isCustom && styles.petAvatarImageCustom,
                        ]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.petAvatarText}>{pet.name.charAt(0)}</Text>
                    )}
                  </View>

                  <View style={styles.petRowContent}>
                    <Text style={[styles.petRowName, isActive && styles.petRowNameActive]}>
                      {pet.name || 'Unnamed Pet'}
                    </Text>
                    <Text
                      style={[
                        styles.petRowBreed,
                        isActive && styles.petRowBreedActive,
                      ]}
                    >
                      {pet.breed || 'No breed yet'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.petStatusPill, isActive && styles.petStatusPillActive]}
                    onPress={() => startViewMode(pet.id)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.petStatusText,
                        isActive && styles.petStatusTextActive,
                      ]}
                    >
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addPetButton}
              activeOpacity={0.9}
              onPress={startAddMode}
            >
              <Text style={styles.addPetPlus}>+</Text>
              <Text style={styles.addPetText}>Add Pet Profile</Text>
            </TouchableOpacity>
          </View>

          {screenMode === 'list' && (
            <View style={styles.emptyModeCard}>
              <Text style={styles.emptyModeTitle}>Select a pet to continue</Text>
              <Text style={styles.emptyModeText}>
                Tap `View` on a pet profile to see medical records, vaccination
                history, visit history, and profile details.
              </Text>
            </View>
          )}

          {(screenMode === 'view' || screenMode === 'edit') && activePet && (
            <>
              <View style={styles.sectionHeaderWrap}>
                <Text style={styles.sectionTitle}>
                  {screenMode === 'view'
                    ? 'Pet Profile View'
                    : isCreatingPet
                      ? 'Add Pet Profile'
                      : 'Edit Pet Profile'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {screenMode === 'view'
                    ? 'View profile details, medical records, and visit history'
                    : 'Update pet photo, basic details, and profile information'}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailTopRow}>
                  <TouchableOpacity
                    style={styles.secondaryActionButton}
                    onPress={goBackFromDetails}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.secondaryActionText}>Back</Text>
                  </TouchableOpacity>

                  {screenMode === 'view' ? (
                    <TouchableOpacity
                      style={styles.primaryActionButton}
                      onPress={startEditMode}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.primaryActionText}>Edit</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.editActionRow}>
                      <TouchableOpacity
                        style={styles.secondaryActionButtonWide}
                        onPress={cancelEditMode}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.secondaryActionText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.primaryActionButtonWide}
                        onPress={handleDonePress}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.primaryActionText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {screenMode === 'view' ? (
                  <>
                    <View style={styles.viewProfileHeader}>
                      <View
                        style={[
                          styles.largePetAvatar,
                          { backgroundColor: activePet.profileColor },
                        ]}
                      >
                        {activePhoto.source ? (
                          <Image
                            source={activePhoto.source}
                            style={[
                              styles.largePetAvatarImage,
                              activePhoto.isCustom && styles.largePetAvatarImageCustom,
                            ]}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text style={styles.largePetAvatarText}>
                            {activePet.name.charAt(0)}
                          </Text>
                        )}
                      </View>

                      <View style={styles.viewProfileInfo}>
                        <Text style={styles.profileName}>{activePet.name || 'Unnamed Pet'}</Text>
                        <Text style={styles.profileBreed}>{activePet.breed || 'No breed yet'}</Text>
                        <Text style={styles.referenceCodeText}>
                          Pet Reference Code: {activePet.referenceCode}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.profileGrid}>
                      <View style={styles.profileInfoItem}>
                        <Text style={styles.profileInfoLabel}>Breed</Text>
                        <Text style={styles.profileInfoValue}>{activePet.breed || '-'}</Text>
                      </View>
                      <View style={styles.profileInfoItem}>
                        <Text style={styles.profileInfoLabel}>Age</Text>
                        <Text style={styles.profileInfoValue}>{formatAge(activePet.age)}</Text>
                      </View>
                      <View style={styles.profileInfoItem}>
                        <Text style={styles.profileInfoLabel}>Birthday</Text>
                        <Text style={styles.profileInfoValue}>{formatBirthday(activePet)}</Text>
                      </View>
                      <View style={styles.profileInfoItem}>
                        <Text style={styles.profileInfoLabel}>Sex</Text>
                        <Text style={styles.profileInfoValue}>{activePet.sex || '-'}</Text>
                      </View>
                    </View>

                    <View style={styles.innerSectionCard}>
                      <Text style={styles.recordCardTitle}>Medical History</Text>
                      {activePet.medicalHistory.length ? (
                        activePet.medicalHistory.map((item) => (
                          <View key={item} style={styles.recordListItem}>
                            <View style={styles.recordBullet} />
                            <Text style={styles.recordItemText}>{item}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.emptyRecordText}>
                          No medical history recorded yet.
                        </Text>
                      )}

                      <Text
                        style={[styles.recordCardTitle, styles.recordCardSectionSpacing]}
                      >
                        Vaccination Records
                      </Text>
                      {activePet.vaccinations.length ? (
                        activePet.vaccinations.map((item) => (
                          <View key={item} style={styles.recordListItem}>
                            <View style={styles.recordBullet} />
                            <Text style={styles.recordItemText}>{item}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.emptyRecordText}>
                          No vaccination records recorded yet.
                        </Text>
                      )}
                    </View>

                    <View style={styles.innerSectionCard}>
                      <Text style={styles.recordCardTitle}>Visit History</Text>
                      {activePet.visits.length ? (
                        activePet.visits.map((visit) => (
                          <View key={visit} style={styles.visitTimelineItem}>
                            <View style={styles.visitTimelineDot} />
                            <View style={styles.visitTimelineContent}>
                              <Text style={styles.visitTimelineText}>{visit}</Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.emptyRecordText}>No visit history recorded yet.</Text>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.editPhotoSection}>
                      <View
                        style={[
                          styles.largePetAvatar,
                          { backgroundColor: activePet.profileColor },
                        ]}
                      >
                        {activePhoto.source ? (
                          <Image
                            source={activePhoto.source}
                            style={[
                              styles.largePetAvatarImage,
                              activePhoto.isCustom && styles.largePetAvatarImageCustom,
                            ]}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text style={styles.largePetAvatarText}>
                            {activePet.name.charAt(0) || 'P'}
                          </Text>
                        )}
                      </View>

                      <Text style={styles.photoPickerLabel}>Change Profile Photo</Text>
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
                    </View>

                    <View style={styles.formCard}>
                      <Text style={styles.formLabel}>Pet Reference Code</Text>
                      <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyFieldText}>
                          {activePet.referenceCode}
                        </Text>
                      </View>

                      <Text style={styles.formLabel}>Name</Text>
                      <TextInput
                        value={activePet.name}
                        onChangeText={(value) => updateDraftPetField('name', value)}
                        style={styles.inputField}
                        placeholder="Enter pet name"
                        placeholderTextColor="#87a0b1"
                      />

                      <Text style={styles.formLabel}>Breed</Text>
                      <TextInput
                        value={activePet.breed}
                        onChangeText={(value) => updateDraftPetField('breed', value)}
                        style={styles.inputField}
                        placeholder="Enter breed"
                        placeholderTextColor="#87a0b1"
                      />

                      <Text style={styles.formLabel}>Age</Text>
                      <TextInput
                        value={activePet.age}
                        onChangeText={(value) =>
                          updateDraftPetField('age', value.replace(/[^0-9]/g, ''))
                        }
                        style={styles.inputField}
                        placeholder="Enter age"
                        placeholderTextColor="#87a0b1"
                        keyboardType="number-pad"
                        maxLength={2}
                      />

                      <Text style={styles.formLabel}>Birthday</Text>
                      <View style={styles.birthdayRow}>
                        <View style={styles.birthdayPickerWrap}>
                          <Picker
                            selectedValue={activePet.birthMonth}
                            onValueChange={(value) => updateDraftPetField('birthMonth', value)}
                            style={styles.birthdayPicker}
                            dropdownIconColor="#173f5c"
                          >
                            {MONTHS.map((month) => (
                              <Picker.Item key={month} label={month} value={month} />
                            ))}
                          </Picker>
                        </View>

                        <View style={styles.birthdayPickerWrapSmall}>
                          <Picker
                            selectedValue={activePet.birthDay}
                            onValueChange={(value) => updateDraftPetField('birthDay', value)}
                            style={styles.birthdayPicker}
                            dropdownIconColor="#173f5c"
                          >
                            {DAYS.map((day) => (
                              <Picker.Item key={day} label={day} value={day} />
                            ))}
                          </Picker>
                        </View>

                        <View style={styles.birthdayPickerWrapSmall}>
                          <Picker
                            selectedValue={activePet.birthYear}
                            onValueChange={(value) => updateDraftPetField('birthYear', value)}
                            style={styles.birthdayPicker}
                            dropdownIconColor="#173f5c"
                          >
                            {YEARS.map((year) => (
                              <Picker.Item key={year} label={year} value={year} />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </>
          )}

        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, item.active && styles.activeNavItem]}
              onPress={() => navigation.navigate(item.route, { user: loggedInUser })}
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
          visible={showRequiredFieldsModal}
          onRequestClose={() => setShowRequiredFieldsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Required Fields</Text>
              <Text style={styles.modalMessage}>
                Please complete all required pet fields first.
              </Text>
              <TouchableOpacity
                style={styles.modalSingleButton}
                onPress={() => setShowRequiredFieldsModal(false)}
                activeOpacity={0.9}
              >
                <Text style={styles.modalSingleButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={showDoneConfirm}
          onRequestClose={() => setShowDoneConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Save Changes</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to apply these pet profile updates?
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowDoneConfirm(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={saveEditedPet}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalPrimaryText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerMyPets;
