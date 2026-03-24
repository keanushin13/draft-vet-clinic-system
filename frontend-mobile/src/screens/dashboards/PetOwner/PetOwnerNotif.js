import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Reminder',
    title: 'Upcoming Appointment',
    body: 'Your veterinary check-up is scheduled for tomorrow at 8:00 AM.',
    time: '2 mins ago',
    priority: 'Today',
    accent: '#2f9af0',
  },
  {
    id: 'notif-2',
    category: 'Vaccination',
    title: 'Vaccination Reminder',
    body: "Bella's anti-rabies vaccine is due next week. Book early to keep the schedule secured.",
    time: '15 mins ago',
    priority: 'Reminder',
    accent: '#39b36b',
  },
  {
    id: 'notif-3',
    category: 'System',
    title: 'Clinic Announcement',
    body: 'Saturday walk-in slots are now open for consultation, deworming, and minor surgery.',
    time: '1 hour ago',
    priority: 'Update',
    accent: '#6a9cc5',
  },
  {
    id: 'notif-4',
    category: 'AI Alert',
    title: 'AI-Prioritized Urgent Alert',
    body: 'Hydration and appetite changes were flagged for early follow-up. Consider booking a check-up soon.',
    time: 'Today',
    priority: 'Urgent',
    accent: '#f47c6b',
  },
  {
    id: 'notif-5',
    category: 'Recent Activity',
    title: 'Booking Sent',
    body: 'Your appointment request was successfully submitted.',
    time: 'Recent',
    priority: 'Recent',
    accent: '#3d8dd1',
  },
  {
    id: 'notif-6',
    category: 'Recent Activity',
    title: 'Profile Updated',
    body: 'Your profile changes were saved successfully.',
    time: 'Recent',
    priority: 'Saved',
    accent: '#4b86c5',
  },
  {
    id: 'notif-7',
    category: 'Recent Activity',
    title: 'Pet Profile Updated',
    body: 'Your pet profile details were updated successfully.',
    time: 'Recent',
    priority: 'Saved',
    accent: '#5e91bd',
  },
  {
    id: 'notif-8',
    category: 'Recent Activity',
    title: 'New Pet Added',
    body: 'A new pet profile was added to your account.',
    time: 'Recent',
    priority: 'New',
    accent: '#7aa85c',
  },
];

const normalizeNotifications = (items = []) =>
  items
    .filter(Boolean)
    .map((item, index) => ({
      id: item.id || `route-notif-${index}-${Date.now()}`,
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

const PetOwnerNotif = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;

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

  const bottomNavItems = [
    {
      key: 'home',
      label: 'Home',
      icon: require('../../assets/Dashboard_Icon.png'),
      routeName: 'petowner-screen',
      active: false,
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: require('../../assets/Message_Icon.png'),
      routeName: 'PetOwnerMessages',
      active: false,
    },
    {
      key: 'account',
      label: 'Account',
      icon: require('../../assets/User_Icon.png'),
      routeName: 'PetOwnerProfile',
      active: false,
    },
  ];

  const deleteNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
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
                <Text style={styles.headerSubtitle}>Notifications Center</Text>
              </View>
            </View>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{notifications.length} alerts</Text>
            </View>
          </View>

          <View style={styles.headerBottomRow}>
            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Stay updated</Text>
              <Text style={styles.ownerName}>
                Reminders, announcements, and urgent alerts
              </Text>
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
            <Text style={styles.heroEyebrow}>Notification feed</Text>
            <Text style={styles.heroTitle}>Track reminders and urgent updates</Text>
            <Text style={styles.heroDescription}>
              Receive appointment reminders, vaccination notices, clinic announcements,
              and AI-prioritized alerts in one place. Swipe left on any card to delete it.
            </Text>
          </LinearGradient>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Latest Notifications</Text>
            <Text style={styles.sectionSubtitle}>
              Includes your recent booking and profile update alerts
            </Text>
          </View>

          {notifications.length ? (
            notifications.map((item) => (
              <NotificationRow
                key={item.id}
                item={item}
                onDelete={deleteNotification}
              />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No notifications left</Text>
              <Text style={styles.emptyText}>
                New reminders and updates will appear here once there is fresh activity.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.routeName, { user: loggedInUser })}
              activeOpacity={0.9}
            >
              <View style={styles.navIconWrap}>
                <Image
                  source={item.icon}
                  style={styles.navIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerNotif;
