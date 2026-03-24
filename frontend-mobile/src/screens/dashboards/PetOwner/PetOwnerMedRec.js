import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerMedRecDesign';

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
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';

  const [selectedPetId, setSelectedPetId] = useState(PET_RECORDS[0].id);

  const selectedPet =
    PET_RECORDS.find((pet) => pet.id === selectedPetId) || PET_RECORDS[0];

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
                <Text style={styles.headerSubtitle}>Medical Records</Text>
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

          <View style={styles.headerBottomRow}>
            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Health records overview</Text>
              <Text style={styles.ownerName}>{headerDisplayName}</Text>
            </View>

            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>{selectedPet.name} active</Text>
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
            <Text style={styles.heroEyebrow}>Health overview</Text>
            <Text style={styles.heroTitle}>Medical records and predictive care</Text>
            <Text style={styles.heroDescription}>
              View diagnoses and treatments, access medications and lab results,
              and get predictive health analysis that helps detect potential
              issues early.
            </Text>
          </LinearGradient>

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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerMedRec;
