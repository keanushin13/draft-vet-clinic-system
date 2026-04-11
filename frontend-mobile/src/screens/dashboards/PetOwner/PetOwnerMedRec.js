import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerMedRecDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const PET_RECORDS = [
  {
    id: 'pet-1',
    name: 'Bella',
    breed: 'Golden Retriever',
    sex: 'Female',
    age: '3 years old',
    referenceCode: 'PET-0001',
    weight: '24 kg',
    microchipId: '33054379',
    lastVisit: 'March 18, 2026',
    wellnessScore: 'Stable',
    diagnoses: [
      {
        title: 'Seasonal Allergy Flare',
        meta: 'Diagnosed on March 12, 2026',
        note: 'Mild skin irritation and itching were noted during the wellness visit.',
      },
      {
        title: 'Mild Dehydration Risk',
        meta: 'Observed on March 18, 2026',
        note: 'Water intake should be monitored closely after active outdoor play.',
      },
    ],
    treatments: [
      {
        title: 'Skin Relief Care Plan',
        meta: '7-day treatment',
        note: 'Topical care and regular grooming were advised to reduce irritation.',
      },
      {
        title: 'Hydration Monitoring',
        meta: 'Daily follow-up at home',
        note: 'Continue balanced meals and encourage additional water intake.',
      },
    ],
    medications: [
      {
        name: 'Cetirizine',
        dosage: '5 mg once daily',
        purpose: 'Allergy support',
      },
      {
        name: 'Nutriboost Syrup',
        dosage: '10 ml after meals',
        purpose: 'Recovery and appetite support',
      },
    ],
    labResults: [
      {
        title: 'CBC Test',
        status: 'Normal range',
        note: 'No major abnormalities detected in the latest blood panel.',
      },
      {
        title: 'Skin Scraping',
        status: 'Mild irritation only',
        note: 'No severe infection detected. Continue monitoring the skin response.',
      },
    ],
    predictiveAlerts: [
      {
        score: '82%',
        title: 'Low dehydration risk',
        note: 'Predictive health analysis suggests hydration should improve with daily monitoring.',
      },
      {
        score: '76%',
        title: 'Early skin sensitivity signal',
        note: 'Potential irritation may return during warm weather, so early grooming care is recommended.',
      },
    ],
    insight:
      'Bella shows a healthy overall condition, but predictive analysis suggests early attention to hydration and skin care can reduce the chance of recurring discomfort.',
  },
  {
    id: 'pet-2',
    name: 'Max',
    breed: 'Persian Cat',
    sex: 'Male',
    age: '2 years old',
    referenceCode: 'PET-0002',
    weight: '5 kg',
    microchipId: '42190318',
    lastVisit: 'February 14, 2026',
    wellnessScore: 'Monitor',
    diagnoses: [
      {
        title: 'Digestive Sensitivity',
        meta: 'Diagnosed on February 14, 2026',
        note: 'Mild stomach sensitivity was observed after a food transition.',
      },
      {
        title: 'Dental Tartar Build-up',
        meta: 'Observed on January 26, 2026',
        note: 'Early tartar build-up was noted during routine oral inspection.',
      },
    ],
    treatments: [
      {
        title: 'Diet Adjustment Plan',
        meta: '14-day monitoring',
        note: 'A gradual switch to a sensitive-stomach diet was recommended.',
      },
      {
        title: 'Dental Care Support',
        meta: 'Weekly maintenance',
        note: 'Use vet-approved dental gel and monitor chewing comfort.',
      },
    ],
    medications: [
      {
        name: 'Probiotic Paste',
        dosage: '3 ml once daily',
        purpose: 'Digestive support',
      },
      {
        name: 'Dental Oral Gel',
        dosage: 'Apply every night',
        purpose: 'Dental care',
      },
    ],
    labResults: [
      {
        title: 'Fecalysis',
        status: 'Mild imbalance',
        note: 'No major parasite concerns, but digestive imbalance was noted.',
      },
      {
        title: 'Oral Check',
        status: 'Needs monitoring',
        note: 'Early tartar formation should be monitored in future visits.',
      },
    ],
    predictiveAlerts: [
      {
        score: '79%',
        title: 'Digestive recurrence risk',
        note: 'Predictive analysis suggests diet changes should be introduced slowly to prevent flare-ups.',
      },
      {
        score: '71%',
        title: 'Dental discomfort signal',
        note: 'Routine oral care may help reduce the chance of future gum irritation.',
      },
    ],
    insight:
      'Max is in good condition overall, but predictive health analysis recommends early digestive and dental support to reduce possible recurring issues.',
  },
  {
    id: 'pet-3',
    name: 'Coco',
    breed: 'Shih Tzu',
    sex: 'Female',
    age: '4 years old',
    referenceCode: 'PET-0003',
    weight: '7 kg',
    microchipId: '51827460',
    lastVisit: 'March 04, 2026',
    wellnessScore: 'Healthy',
    diagnoses: [
      {
        title: 'Ear Sensitivity',
        meta: 'Diagnosed on March 04, 2026',
        note: 'Minor ear irritation was detected during the check-up.',
      },
      {
        title: 'Weight Management Review',
        meta: 'Observed on February 08, 2026',
        note: 'A small increase in weight was noted and feeding portions were reviewed.',
      },
    ],
    treatments: [
      {
        title: 'Ear Cleaning Routine',
        meta: 'Twice weekly care',
        note: 'Gentle cleaning and observation were recommended for early maintenance.',
      },
      {
        title: 'Portion Control Plan',
        meta: '30-day review',
        note: 'Meal portions and activity should be balanced to maintain ideal weight.',
      },
    ],
    medications: [
      {
        name: 'Ear Care Drops',
        dosage: '2 drops per ear',
        purpose: 'Ear support',
      },
      {
        name: 'Omega Supplement',
        dosage: '1 capsule daily',
        purpose: 'Coat and skin support',
      },
    ],
    labResults: [
      {
        title: 'Ear Swab Test',
        status: 'Minor irritation',
        note: 'No serious infection detected in the latest ear swab.',
      },
      {
        title: 'Weight Review',
        status: 'Stable',
        note: 'Weight remains manageable with the current care plan.',
      },
    ],
    predictiveAlerts: [
      {
        score: '85%',
        title: 'Low ear infection risk',
        note: 'Early cleaning and regular checks are helping maintain ear health.',
      },
      {
        score: '74%',
        title: 'Possible weight gain signal',
        note: 'Predictive analysis recommends steady activity and portion control.',
      },
    ],
    insight:
      'Coco is currently healthy, and early preventive care is helping reduce the chance of ear issues while keeping weight changes under control.',
  },
];

const PetOwnerMedRec = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const scrollViewRef = useRef(null);
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';
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

  const [selectedPetId, setSelectedPetId] = useState(PET_RECORDS[0].id);

  const selectedPet =
    PET_RECORDS.find((pet) => pet.id === selectedPetId) || PET_RECORDS[0];

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
    navigation.navigate(routeName, { user: loggedInUser });
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
              onPress={() => navigation.navigate('petowner-screen', { user: loggedInUser })}
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
                <Text style={styles.headerSubtitle}>Medical Records</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => navigation.navigate('PetOwnerNotif', { user: loggedInUser })}
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
                onPress={() => navigation.navigate('PetOwnerProfile', { user: loggedInUser })}
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
                    source={DEFAULT_PROFILE_IMAGE}
                    style={styles.profileIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

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
              <Text style={styles.headerCaption}>Health records overview</Text>
              <Text style={styles.ownerName}>{headerDisplayName}</Text>
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
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Choose Pet</Text>
            <Text style={styles.sectionSubtitle}>
              Switch medical records for each pet profile
            </Text>
          </View>

          <View style={styles.selectorCard}>
            <View style={styles.selectorGrid}>
              {PET_RECORDS.map((pet) => {
                const isActive = pet.id === selectedPetId;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petChip, isActive && styles.petChipActive]}
                    onPress={() => setSelectedPetId(pet.id)}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.petChipTitle, isActive && styles.petChipTitleActive]}>
                      {pet.name}
                    </Text>
                    <Text
                      style={[
                        styles.petChipSubtitle,
                        isActive && styles.petChipSubtitleActive,
                      ]}
                    >
                      {pet.breed}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Pet Summary</Text>
            <Text style={styles.sectionSubtitle}>
              Main profile and current wellness snapshot
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.petHeader}>
              <View style={styles.petAvatar}>
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.petAvatarImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.petHeaderContent}>
                <Text style={styles.petName}>{selectedPet.name}</Text>
                <Text style={styles.petMeta}>
                  {selectedPet.breed} | {selectedPet.sex} | {selectedPet.age}
                </Text>
                <Text style={styles.petId}>
                  Reference Code: {selectedPet.referenceCode}
                </Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{selectedPet.weight}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Pet Reference Code</Text>
                <Text style={styles.infoValue}>{selectedPet.microchipId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Visit</Text>
                <Text style={styles.infoValue}>{selectedPet.lastVisit}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Wellness Score</Text>
                <Text style={styles.infoValue}>{selectedPet.wellnessScore}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Diagnoses and Treatments</Text>
            <Text style={styles.sectionSubtitle}>
              Review recent findings and care plans
            </Text>
          </View>

          <View style={styles.dualSectionCard}>
            <Text style={styles.cardTitle}>Diagnoses</Text>
            {selectedPet.diagnoses.map((item) => (
              <View key={item.title} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineMeta}>{item.meta}</Text>
                  <Text style={styles.timelineNote}>{item.note}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.cardTitle, styles.cardSpacing]}>Treatments</Text>
            {selectedPet.treatments.map((item) => (
              <View key={item.title} style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotBlue]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineMeta}>{item.meta}</Text>
                  <Text style={styles.timelineNote}>{item.note}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Medications and Lab Results</Text>
            <Text style={styles.sectionSubtitle}>
              Access prescriptions and recent test records
            </Text>
          </View>

          <View style={styles.dataCard}>
            <Text style={styles.cardTitle}>Prescribed Medications</Text>
            {selectedPet.medications.map((item) => (
              <View key={item.name} style={styles.dataRow}>
                <View>
                  <Text style={styles.dataRowTitle}>{item.name}</Text>
                  <Text style={styles.dataRowSubtext}>{item.purpose}</Text>
                </View>
                <Text style={styles.dataRowValue}>{item.dosage}</Text>
              </View>
            ))}

            <Text style={[styles.cardTitle, styles.cardSpacing]}>Lab Results</Text>
            {selectedPet.labResults.map((item) => (
              <View key={item.title} style={styles.resultCard}>
                <View style={styles.resultTopRow}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <View style={styles.resultBadge}>
                    <Text style={styles.resultBadgeText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.resultNote}>{item.note}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Predictive Health Analysis</Text>
            <Text style={styles.sectionSubtitle}>
              Early signals that may help prevent future health issues
            </Text>
          </View>

          <View style={styles.analysisCard}>
            {selectedPet.predictiveAlerts.map((item) => (
              <View key={item.title} style={styles.analysisItem}>
                <View style={styles.analysisScoreBox}>
                  <Text style={styles.analysisScoreText}>{item.score}</Text>
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisTitle}>{item.title}</Text>
                  <Text style={styles.analysisNote}>{item.note}</Text>
                </View>
              </View>
            ))}

            <View style={styles.insightBox}>
              <Text style={styles.insightTitle}>Early Detection Insight</Text>
              <Text style={styles.insightText}>{selectedPet.insight}</Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate('PetOwnerQuickAssist', { user: loggedInUser })}
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerMedRec;
