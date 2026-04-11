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
import { styles } from '../../styles/StaffDashboardDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const quickAccessItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: require('../../assets/Dashboard_Icon.png'),
    route: 'staff-screen',
  },
  {
    key: 'appointment',
    label: 'Appointment',
    icon: require('../../assets/Appointment_Icon.png'),
    route: 'StaffAppointment',
  },
  {
    key: 'mypets',
    label: 'Pets Profile',
    icon: require('../../assets/Pets_Icon.png'),
    route: 'StaffPetsProfile',
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: require('../../assets/Message_Icon.png'),
    route: 'StaffMessages',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: require('../../assets/Inventory_Icon.png'),
    route: 'StaffInventory',
  },
  {
    key: 'user-management',
    label: 'User Management',
    icon: require('../../assets/UserManagement_Icon.png'),
    route: 'StaffUserManagement',
  },
  {
    key: 'payment-history',
    label: 'Payment History',
    icon: require('../../assets/payment_icon.png'),
    route: 'StaffPayHis',
  },
  {
    key: 'activity-logs',
    label: 'Activity Logs',
    icon: require('../../assets/Log_Icon.png'),
    route: 'StaffLogs',
  },
];

const overviewItems = [
  {
    key: 'appointments',
    value: '12',
    title: 'Appointments',
    description: 'Booked today',
    circleStyle: 'green',
  },
  {
    key: 'pet-owners',
    value: '18',
    title: 'Pet Owners',
    description: 'Assisted today',
    circleStyle: 'green',
  },
  {
    key: 'inventory',
    value: '4',
    title: 'Inventory',
    description: 'Low stock alerts',
    circleStyle: 'yellow',
  },
  {
    key: 'payments',
    value: 'P7k',
    title: 'Payments',
    description: 'Processed today',
    circleStyle: 'green',
  },
];

const primaryServices = [
  {
    key: 'appointment',
    label: ['Manage', 'Appointments'],
    icon: require('../../assets/Appointment_Icon.png'),
    route: 'StaffAppointment',
  },
  {
    key: 'user-management',
    label: ['User', 'Management'],
    icon: require('../../assets/UserManagement_Icon.png'),
    route: 'StaffUserManagement',
  },
  {
    key: 'inventory',
    label: ['Track', 'Inventory'],
    icon: require('../../assets/Inventory_Icon.png'),
    route: 'StaffInventory',
  },
];

const secondaryServices = [
  {
    key: 'pets',
    label: ['Pets', 'Profile'],
    icon: require('../../assets/Pets_Icon.png'),
    route: 'StaffPetsProfile',
  },
  {
    key: 'payments',
    label: ['Payment', 'History'],
    icon: require('../../assets/payment_icon.png'),
    route: 'StaffPayHis',
  },
  {
    key: 'logs',
    label: ['Activity', 'Logs'],
    icon: require('../../assets/Log_Icon.png'),
    route: 'StaffLogs',
  },
];

const StaffDashboard = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Staff';
  const scrollViewRef = useRef(null);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const headerMenuAnimation = useRef(new Animated.Value(0)).current;
  const lowerHeaderAnimation = useRef(new Animated.Value(1)).current;
  const isHeaderMenuAnimating = useRef(false);
  const isLowerHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

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

  const navigateWithUser = (screenName) => {
    navigation.navigate(screenName, { user: loggedInUser });
  };

  const handleHeaderMenuPress = (screenName) => {
    closeHeaderMenu(() => navigateWithUser(screenName));
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
            <View style={styles.brandSection}>
              <View style={styles.logoWrap}>
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.brandBlock}>
                <Text style={styles.headerTitle}>PawCruz</Text>
                <Text style={styles.headerSubtitle}>Staff Dashboard</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => navigateWithUser('StaffNotif')}
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
                onPress={() => navigateWithUser('StaffProfile')}
                activeOpacity={0.85}
              >
                <Image
                  source={DEFAULT_PROFILE_IMAGE}
                  style={styles.profileIcon}
                  resizeMode="contain"
                />
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
              {quickAccessItems.map((item, index) => {
                const itemEnterStart = index * 0.08;
                const itemEnterMid = Math.min(itemEnterStart + 0.45, 0.99);
                const itemOpacity = headerMenuAnimation.interpolate({
                  inputRange: [itemEnterStart, itemEnterMid, 1],
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
                      style={[
                        styles.headerMenuItem,
                        index === quickAccessItems.length - 1 && styles.headerMenuItemLast,
                      ]}
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
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <Text style={styles.sectionSubtitle}>Clinic summary and daily activity</Text>
          </View>

          <View style={styles.aiCard}>
            <View style={styles.aiTopRow}>
              <View style={styles.aiScoreBox}>
                <Text style={styles.aiScoreNumber}>6</Text>
              </View>

              <View style={styles.aiSummaryContent}>
                <Text style={styles.aiMainTitle}>Open Service Areas</Text>
                <Text style={styles.aiMainSubtitle}>Front desk snapshot for today</Text>
              </View>
            </View>

            <View style={styles.scoreGrid}>
              {overviewItems.map((item) => (
                <View key={item.key} style={styles.scoreItem}>
                  <View
                    style={[
                      styles.scoreCircle,
                      item.circleStyle === 'yellow'
                        ? styles.yellowCircle
                        : styles.greenCircle,
                    ]}
                  >
                    <Text style={styles.scoreLetter}>{item.value}</Text>
                  </View>
                  <Text style={styles.scoreItemTitle}>{item.title}</Text>
                  <Text style={styles.scoreItemDesc}>{item.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>Highlights</Text>
              <Text style={styles.highlightText}>
                - Appointment requests are steady through the afternoon clinic block.
              </Text>
              <Text style={styles.highlightText}>
                - Inventory review is needed for four items before tomorrow&apos;s opening.
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Services</Text>
            <Text style={styles.sectionSubtitle}>Quick access to staff tools and tasks</Text>
          </View>

          <View style={styles.menuGrid}>
            {primaryServices.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.menuCard}
                onPress={() => navigateWithUser(item.route)}
                activeOpacity={0.9}
              >
                <View style={styles.iconCircle}>
                  <Image
                    source={item.icon}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                {item.label.map((line) => (
                  <Text key={line} style={styles.menuLabel}>
                    {line}
                  </Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.menuGrid, styles.menuGridSecondary]}>
            {secondaryServices.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.menuCard}
                onPress={() => navigateWithUser(item.route)}
                activeOpacity={0.9}
              >
                <View style={styles.iconCircle}>
                  <Image
                    source={item.icon}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                {item.label.map((line) => (
                  <Text key={line} style={styles.menuLabel}>
                    {line}
                  </Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigateWithUser('StaffQuickAssist')}
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

export default StaffDashboard;
