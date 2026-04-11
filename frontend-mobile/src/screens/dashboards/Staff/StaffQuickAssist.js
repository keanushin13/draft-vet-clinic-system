import React from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as messageStyles } from '../../styles/PetOwnerMessagesDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const StaffQuickAssist = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const displayName =
    loggedInUser?.fullName ||
    loggedInUser?.name ||
    loggedInUser?.username ||
    'Staff';
  const headerMenuAnimation = React.useRef(new Animated.Value(0)).current;
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(() =>
    new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    }).toLowerCase(),
  );

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }).toLowerCase(),
      );
    }, 1000 * 30);

    return () => clearInterval(timerId);
  }, []);

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

  const toggleHeaderMenu = () => {
    const nextVisible = !isHeaderMenuVisible;
    setIsHeaderMenuVisible(nextVisible);
    Animated.timing(headerMenuAnimation, {
      toValue: nextVisible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const handleHeaderMenuPress = (routeName) => {
    setIsHeaderMenuVisible(false);
    headerMenuAnimation.setValue(0);
    navigation.navigate(routeName, { user: loggedInUser });
  };

  return (
    <LinearGradient
      colors={['#022c42', '#0c212b', '#15394e']}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
                  <Text style={styles.headerSubtitle}>Staff Quick Assist</Text>
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
                  <Image
                    source={DEFAULT_PROFILE_IMAGE}
                    style={styles.profileIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.headerBottomRow}>
              <View style={messageStyles.headerControls}>
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

                <TouchableOpacity
                  style={messageStyles.backTriggerButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.85}
                >
                  <Image
                    source={require('../../assets/Back_Icon.png')}
                    style={messageStyles.backTriggerIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.ownerSummary}>
                <Text style={styles.headerCaption}>AI Staff Assistant</Text>
                <Text style={styles.ownerName}>{displayName}</Text>
              </View>
            </View>

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
                    ],
                  },
                ]}
              >
                {headerMenuItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
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
                ))}
              </Animated.View>
            ) : null}
          </LinearGradient>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              Disclaimer: Quick Assist suggestions are AI-generated for clinic workflow
              guidance only. Please verify any important operational or medical decision
              with the appropriate staff member or veterinarian.
            </Text>
          </View>

          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.messageRow}>
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>
                  Hi {displayName}, welcome to Staff Quick Assist! Which task do you want
                  help with today: appointments, inventory, pets, users, or payments?
                </Text>

                <TouchableOpacity style={styles.addPetButton} activeOpacity={0.9}>
                  <Text style={styles.addPetButtonText}>+ Start New Assist</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.messageTime}>{currentTime}</Text>
            </View>
          </ScrollView>

          <View style={messageStyles.inputBar}>
            <View style={messageStyles.inlineInputWrap}>
              <TextInput
                editable={false}
                placeholder="Ask about staff tasks here..."
                placeholderTextColor="#8aa2b4"
                style={messageStyles.inlineInput}
              />
              <Image
                source={require('../../assets/send.png')}
                style={messageStyles.inlineSendImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  headerBar: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#0f2d45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brandSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerLogo: {
    width: 48,
    height: 48,
  },

  brandBlock: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: '#c3ddee',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notifButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  notifBadge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#f47c6b',
    borderWidth: 2,
    borderColor: '#245f8e',
  },

  notifIcon: {
    width: 21,
    height: 21,
    tintColor: '#ffffff',
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    overflow: 'hidden',
  },

  profileIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },

  headerBottomRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuTriggerButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTriggerIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },

  ownerSummary: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  headerCaption: {
    fontSize: 12,
    color: '#b8d4e5',
    fontWeight: '700',
    textAlign: 'right',
  },

  ownerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
    textAlign: 'right',
  },

  headerMenuPanel: {
    marginTop: 14,
    width: '100%',
    padding: 14,
    borderRadius: 28,
    backgroundColor: 'rgba(19, 61, 88, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'stretch',
  },

  headerMenuItem: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  headerMenuItemIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  headerMenuItemIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },

  headerMenuItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },

  disclaimerCard: {
    marginHorizontal: 18,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d5ebf8',
  },

  disclaimerText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 21,
    color: '#587286',
    fontWeight: '600',
  },

  chatArea: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 26,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  messageCard: {
    flex: 1,
    maxWidth: '84%',
    backgroundColor: '#fcfeff',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: '#dceef8',
    shadowColor: '#88bddf',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  messageText: {
    fontSize: 17,
    lineHeight: 29,
    color: '#173f5c',
    fontWeight: '600',
  },

  addPetButton: {
    marginTop: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#245f8e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addPetButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },

  messageTime: {
    marginLeft: 10,
    marginBottom: 14,
    fontSize: 12,
    color: '#d5ecf8',
    fontWeight: '700',
  },
});

export default StaffQuickAssist;
