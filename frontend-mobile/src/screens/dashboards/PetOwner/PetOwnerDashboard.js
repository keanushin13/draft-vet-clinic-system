import React, { useEffect, useRef, useState } from 'react';
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
import { styles } from '../../styles/PetOwnerDashboardDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

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
  const scrollViewRef = useRef(null);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const headerMenuAnimation = useRef(new Animated.Value(0)).current;
  const lowerHeaderAnimation = useRef(new Animated.Value(1)).current;
  const isHeaderMenuAnimating = useRef(false);
  const isLowerHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

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
  const [activeServiceSlide, setActiveServiceSlide] = useState(0);
  const serviceSlides = [
    {
      key: 'service-1',
      image: require('../../assets/petowner1.png'),
    },
    {
      key: 'service-2',
      image: require('../../assets/petowner2.png'),
    },
    {
      key: 'service-3',
      image: require('../../assets/petowner3.png'),
    },
  ];
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
    const interval = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServiceSlide((current) => (current + 1) % serviceSlides.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [serviceSlides.length]);

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

  const handleHeaderMenuPress = (route) => {
    closeHeaderMenu();
    navigation.navigate(route, { user: loggedInUser });
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
                <Text style={styles.headerSubtitle}>Pet Owner Dashboard</Text>
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
              <Text style={styles.headerCaption}>Welcome</Text>
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
          <LinearGradient
            colors={['#6f95b8', '#5f86a8', '#4b6f8d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
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
            <Text style={styles.sectionTitle}>Services</Text>
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

          <LinearGradient
            colors={['#6f95b8', '#5f86a8', '#4b6f8d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.servicesSlideshowCard}
          >
            <View style={styles.servicesSlideshowFrame}>
              <Image
                source={serviceSlides[activeServiceSlide].image}
                style={styles.servicesSlideshowImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.servicesSlideshowDots}>
              {serviceSlides.map((slide, index) => (
                <View
                  key={slide.key}
                  style={[
                    styles.servicesSlideshowDot,
                    index === activeServiceSlide && styles.servicesSlideshowDotActive,
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
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

export default PetOwnerDashboard;
