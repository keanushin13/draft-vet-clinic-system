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
import { styles } from '../../styles/PetOwnerMessagesDesign';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const PetOwnerStaffMessages = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const displayName =
    loggedInUser?.fullName ||
    loggedInUser?.name ||
    loggedInUser?.username ||
    'Pet Owner';
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
    <LinearGradient colors={['#022c42', '#0c212b', '#15394e']} style={styles.background}>
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
                <Text style={styles.headerSubtitle}>Message Center</Text>
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

          <View style={styles.headerBottomRow}>
            <View style={styles.headerControls}>
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
                style={styles.backTriggerButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Image
                  source={require('../../assets/Back_Icon.png')}
                  style={styles.backTriggerIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Chat with Staff</Text>
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
            Chat with clinic staff here for appointments,  follow-ups, and general clinic assistance.
          </Text>
        </View>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={[styles.chatContent, localStyles.chatContent]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.quickAssistMessageRow, localStyles.quickAssistMessageRow]}>
            <View style={styles.quickAssistMessageCard}>
              <Text style={styles.quickAssistMessageText}>
                Hi {displayName}, welcome to PawCruz Staff Chat! Need help with appointments, or clinic concerns?
              </Text>

              <TouchableOpacity
                style={styles.quickAssistActionButton}
                activeOpacity={0.9}
              >
                <Text style={styles.quickAssistActionButtonText}>Clinic Hours & Availability</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAssistSecondaryActionButton}
                activeOpacity={0.9}
              >
                <Text style={styles.quickAssistActionButtonText}>Book an Appointment</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.quickAssistMessageTime}>{currentTime}</Text>
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inlineInputWrap}>
            <TextInput
              editable={false}
              placeholder="Enter your inquries here..."
              placeholderTextColor="#8aa2b4"
              style={styles.inlineInput}
            />
            <Image
              source={require('../../assets/send.png')}
              style={styles.inlineSendImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  chatContent: {
    justifyContent: 'flex-end',
    minHeight: '100%',
  },

  quickAssistMessageRow: {
    marginTop: 0,
  },
});

export default PetOwnerStaffMessages;
