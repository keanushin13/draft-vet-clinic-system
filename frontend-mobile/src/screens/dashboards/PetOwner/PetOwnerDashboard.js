import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerDashboardDesign';

const PetOwnerDashboard = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';
  const profileName =
    loggedInUser?.fullName ||
    loggedInUser?.name ||
    loggedInUser?.username ||
    'Pet Owner';
  const profileEmail = loggedInUser?.email || 'No email found';
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';

  const heroSlides = [
    {
      key: 'alerts',
      label: 'Alerts',
      title: 'Displays alerts, notifications, and updates',
      description:
        'See wellness reminders, important clinic notices, and recent account activity in one moving panel.',
    },
    {
      key: 'appointments',
      label: 'Upcoming',
      title: 'Shows upcoming appointments',
      description:
        'Review your next pet visit schedule quickly so you never miss your appointment time.',
    },
    {
      key: 'updates',
      label: 'Updates',
      title: 'Tracks latest dashboard changes',
      description:
        'Follow new records, booking progress, and fresh updates automatically every few seconds.',
    },
  ];

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const bottomNavItems = [
    {
      key: 'home',
      label: 'Home',
      icon: require('../../assets/Dashboard_Icon.png'),
      route: 'petowner-screen',
      active: true,
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
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text style={styles.headerTitle}>PawCruz</Text>
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
              <Text style={styles.headerSubtitle}>Welcome back</Text>
              <Text style={styles.ownerName}>{headerDisplayName}</Text>
            </View>

            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>3 pets linked</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient
            colors={['#6f95b8', '#5f86a8', '#4b6f8d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <View style={styles.welcomeHeaderRow}>
              <View style={styles.welcomeTextWrap}>
                <Text style={styles.welcomeSmall}>Hello there,</Text>
                <Text style={styles.welcomeText}>Welcome, {headerDisplayName}</Text>
              </View>

              <View style={styles.welcomeProfileAvatarWrap}>
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.welcomeProfileAvatarCustom}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/paw1.png')}
                    style={styles.welcomeProfileAvatar}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>

            <View style={styles.heroSlideCard}>
              <View style={styles.heroSlideTopRow}>
                <Text style={styles.heroSlideLabel}>
                  {heroSlides[activeHeroSlide].label}
                </Text>

                <View style={styles.heroDotsRow}>
                  {heroSlides.map((slide, index) => (
                    <View
                      key={slide.key}
                      style={[
                        styles.heroDot,
                        index === activeHeroSlide && styles.heroDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.heroSlideTitle}>
                {heroSlides[activeHeroSlide].title}
              </Text>
              <Text style={styles.welcomeDesc}>
                {heroSlides[activeHeroSlide].description}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>AI Health Insight</Text>
            <Text style={styles.sectionSubtitle}>Latest pet wellness summary</Text>
          </View>

          <View style={styles.aiCard}>
            <View style={styles.aiTopRow}>
              <View style={styles.aiScoreBox}>
                <Text style={styles.aiScoreNumber}>A</Text>
              </View>

              <View style={styles.aiSummaryContent}>
                <Text style={styles.aiMainTitle}>Health Score Overview</Text>
                <Text style={styles.aiMainSubtitle}>Max - Labrador Retriever</Text>
              </View>
            </View>

            <View style={styles.scoreGrid}>
              <View style={styles.scoreItem}>
                <View style={[styles.scoreCircle, styles.greenCircle]}>
                  <Text style={styles.scoreLetter}>A</Text>
                </View>
                <Text style={styles.scoreItemTitle}>Activity</Text>
                <Text style={styles.scoreItemDesc}>Excellent</Text>
              </View>

              <View style={styles.scoreItem}>
                <View style={[styles.scoreCircle, styles.greenCircle]}>
                  <Text style={styles.scoreLetter}>A</Text>
                </View>
                <Text style={styles.scoreItemTitle}>Appetite</Text>
                <Text style={styles.scoreItemDesc}>Normal</Text>
              </View>

              <View style={styles.scoreItem}>
                <View style={[styles.scoreCircle, styles.yellowCircle]}>
                  <Text style={styles.scoreLetter}>B</Text>
                </View>
                <Text style={styles.scoreItemTitle}>Hydration</Text>
                <Text style={styles.scoreItemDesc}>Monitor</Text>
              </View>

              <View style={styles.scoreItem}>
                <View style={[styles.scoreCircle, styles.greenCircle]}>
                  <Text style={styles.scoreLetter}>A</Text>
                </View>
                <Text style={styles.scoreItemTitle}>Mood</Text>
                <Text style={styles.scoreItemDesc}>Stable</Text>
              </View>
            </View>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>Highlights</Text>
              <Text style={styles.highlightText}>
                - Max shows healthy activity and a stable condition today.
              </Text>
              <Text style={styles.highlightText}>
                - Continue monitoring water intake for possible mild dehydration.
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <Text style={styles.sectionSubtitle}>Main tools and features</Text>
          </View>

          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('PetOwnerAppointment', { user: loggedInUser })}
              activeOpacity={0.9}
            >
              <View style={styles.iconCircle}>
                <Image
                  source={require('../../assets/Appointment_Icon.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.menuLabel}>Book</Text>
              <Text style={styles.menuLabel}>Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('PetOwnerMyPets', { user: loggedInUser })}
              activeOpacity={0.9}
            >
              <View style={styles.iconCircle}>
                <Image
                  source={require('../../assets/Pets_Icon.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.menuLabel}>My Pets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('PetOwnerMedRec', { user: loggedInUser })}
              activeOpacity={0.9}
            >
              <View style={styles.iconCircle}>
                <Image
                  source={require('../../assets/Medical_Icon.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.menuLabel}>Medical</Text>
              <Text style={styles.menuLabel}>Records</Text>
            </TouchableOpacity>
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

export default PetOwnerDashboard;
