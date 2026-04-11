import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerNotifDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'staff-notif-1',
    category: 'Appointment',
    title: 'New Appointment Request',
    body: 'A pet owner submitted a new consultation request for tomorrow morning.',
    time: '2 mins ago',
    priority: 'Today',
    accent: '#2f9af0',
  },
  {
    id: 'staff-notif-2',
    category: 'Inventory',
    title: 'Low Stock Alert',
    body: 'Anti-rabies vaccine stock is getting low. Review the inventory list soon.',
    time: '15 mins ago',
    priority: 'Reminder',
    accent: '#39b36b',
  },
  {
    id: 'staff-notif-3',
    category: 'System',
    title: 'Clinic Announcement',
    body: 'Saturday walk-in slots were updated and are now available for staff review.',
    time: '1 hour ago',
    priority: 'Update',
    accent: '#6a9cc5',
  },
  {
    id: 'staff-notif-4',
    category: 'Payment',
    title: 'Payment Received',
    body: 'A recent clinic payment was recorded successfully in the payment history.',
    time: 'Today',
    priority: 'Recent',
    accent: '#f0a33a',
  },
  {
    id: 'staff-notif-5',
    category: 'Recent Activity',
    title: 'Profile Updated',
    body: 'Your staff profile changes were saved successfully.',
    time: 'Recent',
    priority: 'Saved',
    accent: '#4b86c5',
  },
  {
    id: 'staff-notif-6',
    category: 'AI Alert',
    title: 'Quick Assist Suggestion',
    body: 'Quick Assist flagged appointment congestion in the morning schedule.',
    time: 'Recent',
    priority: 'AI',
    accent: '#f47c6b',
  },
];

const normalizeNotifications = (items = []) =>
  items
    .filter(Boolean)
    .map((item, index) => ({
      id: item.id || `route-staff-notif-${index}-${Date.now()}`,
      category: item.category || 'Recent Activity',
      title: item.title || 'New Notification',
      body: item.body || '',
      time: item.time || 'Just now',
      priority: item.priority || 'Recent',
      accent: item.accent || '#3d8dd1',
    }));

const NotificationRow = ({ item, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -110) {
          Animated.timing(translateX, {
            toValue: -420,
            duration: 180,
            useNativeDriver: true,
          }).start(() => onDelete(item.id));
          return;
        }

        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.notificationRowWrap}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteBackgroundText}>Delete</Text>
      </View>

      <Animated.View
        style={[
          styles.notifItem,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.notifAccent, { backgroundColor: item.accent }]} />

        <View style={styles.notifContent}>
          <View style={styles.notifMetaRow}>
            <Text style={styles.notifCategory}>{item.category}</Text>
            <View style={[styles.priorityPill, { borderColor: item.accent }]}>
              <Text style={[styles.priorityPillText, { color: item.accent }]}>
                {item.priority}
              </Text>
            </View>
          </View>

          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifBody}>{item.body}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const StaffNotif = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Staff';
  const scrollViewRef = useRef(null);
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

  const routeNotifications = useMemo(
    () =>
      normalizeNotifications([
        ...(route?.params?.notification ? [route.params.notification] : []),
        ...(route?.params?.notifications || []),
      ]),
    [route?.params?.notification, route?.params?.notifications],
  );

  const [notifications, setNotifications] = useState([
    ...routeNotifications,
    ...DEFAULT_NOTIFICATIONS,
  ]);

  useEffect(() => {
    setNotifications([...routeNotifications, ...DEFAULT_NOTIFICATIONS]);
  }, [routeNotifications]);

  const deleteNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
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
              onPress={() => navigation.navigate('staff-screen', { user: loggedInUser })}
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
                <Text style={styles.headerSubtitle}>Notifications Center</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => navigation.navigate('StaffNotif', { user: loggedInUser })}
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
                onPress={() => navigation.navigate('StaffProfile', { user: loggedInUser })}
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
                <Text style={styles.headerCaption}>Stay updated</Text>
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
            <Text style={styles.sectionTitle}>Latest Notifications</Text>
            <Text style={styles.sectionSubtitle}>
              Includes new appointments, inventory alerts, payments, and recent activity
            </Text>
          </View>

          {notifications.length ? (
            notifications.map((item) => (
              <NotificationRow key={item.id} item={item} onDelete={deleteNotification} />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No notifications left</Text>
              <Text style={styles.emptyText}>
                New staff reminders and updates will appear here once there is fresh activity.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate('StaffQuickAssist', { user: loggedInUser })}
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

export default StaffNotif;
