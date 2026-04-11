import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerAppointmentDesign';
import {
  OTHER_OPTION_VALUE,
  VISIT_REASONS,
  buildReasonSummary,
  getBookedAppointment as getStoredBookedAppointment,
  getReasonDetailLabel,
  getReasonDetailOptions,
  getReasonHelperText,
  getReasonLabel,
  setBookedAppointment as setStoredBookedAppointment,
} from './PetOwnerAppointmentData';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');

const PetOwnerAppointment = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';

  const scrollViewRef = useRef(null);
  const headerMenuAnimation = useRef(new Animated.Value(0)).current;
  const lowerHeaderAnimation = useRef(new Animated.Value(1)).current;
  const isHeaderMenuAnimating = useRef(false);
  const isLowerHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedReasonDetail, setSelectedReasonDetail] = useState('');
  const [customReasonText, setCustomReasonText] = useState('');
  const [showReasonDetailPicker, setShowReasonDetailPicker] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(() => getStoredBookedAppointment());
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const shouldResetBookingFlow = Boolean(route?.params?.resetBookingFlow);

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

  const reasonOptions = getReasonDetailOptions(selectedReason);
  const reasonDetailLabel = getReasonDetailLabel(selectedReason);
  const reasonHelperText = getReasonHelperText(selectedReason);
  const selectedReasonDetailLabel =
    reasonOptions.find((item) => item.value === selectedReasonDetail)?.label || '';
  const isCustomReason =
    selectedReason === 'consultation' && selectedReasonDetail === OTHER_OPTION_VALUE;
  const reasonDetailValue = isCustomReason ? customReasonText.trim() : selectedReasonDetail;
  const selectedReasonSummary = selectedReason
    ? buildReasonSummary(selectedReason, reasonDetailValue)
    : 'Choose a visit reason first';
  const canContinue = Boolean(selectedReason) && Boolean(reasonDetailValue);

  const resetBookingFlow = useCallback(() => {
    setSelectedReason('');
    setSelectedReasonDetail('');
    setCustomReasonText('');
    setShowReasonDetailPicker(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBookedAppointment(getStoredBookedAppointment());

      if (shouldResetBookingFlow) {
        resetBookingFlow();
        setShowCancelConfirm(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        navigation.setParams({ resetBookingFlow: undefined });
      }
    }, [navigation, resetBookingFlow, shouldResetBookingFlow]),
  );

  useEffect(() => {
    if (!selectedReason) {
      setSelectedReasonDetail('');
      setCustomReasonText('');
      setShowReasonDetailPicker(false);
      return;
    }

    setSelectedReasonDetail('');
    setCustomReasonText('');
    setShowReasonDetailPicker(false);
  }, [selectedReason]);

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

  const handleHeaderMenuPress = (screenRoute) => {
    closeHeaderMenu();
    navigation.navigate(screenRoute, { user: loggedInUser });
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

  const handleNext = () => {
    if (!canContinue) {
      return;
    }

    navigation.navigate('PetOwnerAppointmentSchedule', {
      user: loggedInUser,
      appointmentDraft: {
        reason: selectedReason,
        reasonLabel: getReasonLabel(selectedReason),
        reasonDetail: selectedReasonDetail,
        reasonDetailValue,
        reasonSummary: buildReasonSummary(selectedReason, reasonDetailValue),
      },
    });
  };

  const handleRescheduleAppointment = () => {
    if (!bookedAppointment) {
      return;
    }

    navigation.navigate('PetOwnerAppointmentSchedule', {
      user: loggedInUser,
      appointmentDraft: {
        reasonSummary: bookedAppointment.reason,
      },
      existingAppointment: bookedAppointment,
    });
  };

  const handleCancelAppointment = () => {
    setStoredBookedAppointment(null);
    setBookedAppointment(null);
    setShowCancelConfirm(false);
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
                <Text style={styles.headerSubtitle}>Appointment</Text>
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
                <Text style={styles.headerCaption}>Step 1 of 2</Text>
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
            <Text style={styles.sectionTitle}>Reason for Visit</Text>
            <Text style={styles.sectionSubtitle}>
              Start by choosing the service before moving to pet and schedule.
            </Text>
          </View>

          <View style={styles.bookingCard}>
            <View style={styles.flowStepBadge}>
              <Text style={styles.flowStepBadgeText}>Step 1</Text>
            </View>

            <Text style={styles.fieldLabel}>Choose visit reason</Text>
            <View style={styles.optionGrid}>
              {VISIT_REASONS.map((reason) => {
                const isActive = reason.value === selectedReason;

                return (
                  <TouchableOpacity
                    key={reason.value}
                    style={[styles.reasonCard, isActive && styles.reasonCardActive]}
                    onPress={() => setSelectedReason(reason.value)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.reasonCardTitle,
                        isActive && styles.reasonCardTitleActive,
                      ]}
                    >
                      {reason.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedReason ? (
              <>
                <View style={styles.reasonDetailCard}>
                  <Text style={styles.reasonDetailLabel}>{reasonDetailLabel}</Text>
                  <Text style={styles.reasonHelperText}>{reasonHelperText}</Text>
                  <TouchableOpacity
                    style={styles.reasonSelectButton}
                    onPress={() => setShowReasonDetailPicker(true)}
                    activeOpacity={0.88}
                  >
                    <Text
                      style={[
                        styles.reasonSelectValue,
                        !selectedReasonDetailLabel && styles.reasonSelectValuePlaceholder,
                      ]}
                    >
                      {selectedReasonDetailLabel || `Select ${reasonDetailLabel.toLowerCase()}`}
                    </Text>
                    <Text style={styles.reasonSelectChevron}>v</Text>
                  </TouchableOpacity>

                  {isCustomReason ? (
                    <TextInput
                      value={customReasonText}
                      onChangeText={setCustomReasonText}
                      style={styles.reasonTextInput}
                      placeholder="Type your consultation concern"
                      placeholderTextColor="#87a0b1"
                    />
                  ) : null}

                  <View style={styles.reasonSummaryBox}>
                    <Text style={styles.reasonSummaryLabel}>Selected Visit Reason</Text>
                    <Text style={styles.reasonSummaryValue}>{selectedReasonSummary}</Text>
                  </View>
                </View>

                <View style={styles.inlineButtonRow}>
                  <TouchableOpacity
                    style={styles.modalSecondaryButton}
                    onPress={() => navigation.navigate('petowner-screen', { user: loggedInUser })}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.modalSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalPrimaryButton,
                      !canContinue && styles.primaryActionButtonDisabled,
                    ]}
                    onPress={handleNext}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.modalPrimaryText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Appointment Management</Text>
            <Text style={styles.sectionSubtitle}>
              Reschedule or cancel your current booking
            </Text>
          </View>

          <View style={styles.managementCard}>
            <Text style={styles.managementTitle}>Upcoming Check-Up</Text>

            {!bookedAppointment ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No booked appointment yet</Text>
                <Text style={styles.emptyStateText}>
                  Confirm a booking first and your upcoming check-up details will appear here.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.managementMeta}>
                  {bookedAppointment.pet?.name} - {bookedAppointment.pet?.breed}
                </Text>

                <View style={styles.managementInfoGrid}>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Reason</Text>
                    <Text style={styles.managementInfoValue}>{bookedAppointment.reason}</Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Date</Text>
                    <Text style={styles.managementInfoValue}>
                      {bookedAppointment.month} {bookedAppointment.day}, {bookedAppointment.year}
                    </Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Time</Text>
                    <Text style={styles.managementInfoValue}>{bookedAppointment.time}</Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Doctor</Text>
                    <Text style={styles.managementInfoValue}>Dr. Assigned</Text>
                  </View>
                </View>

                <View style={styles.managementActionRow}>
                  <TouchableOpacity
                    style={[
                      styles.managementActionButton,
                      styles.managementActionButtonBlue,
                    ]}
                    onPress={handleRescheduleAppointment}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.managementActionText,
                        styles.managementActionTextLight,
                      ]}
                    >
                      Reschedule
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.managementActionButton,
                      styles.managementActionButtonDanger,
                    ]}
                    onPress={() => setShowCancelConfirm(true)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.managementActionText,
                        styles.managementActionTextDanger,
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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

        <Modal
          transparent
          animationType="fade"
          visible={showCancelConfirm}
          onRequestClose={() => setShowCancelConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Cancel Appointment</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to cancel this appointment?
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowCancelConfirm(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDangerButton}
                  onPress={handleCancelAppointment}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalDangerText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={showReasonDetailPicker}
          onRequestClose={() => setShowReasonDetailPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.reasonPickerModalCard}>
              <Text style={styles.modalTitle}>{reasonDetailLabel}</Text>
              <Text style={styles.reasonPickerModalText}>
                Choose the best option for this visit reason.
              </Text>
              <ScrollView
                style={styles.reasonPickerList}
                contentContainerStyle={styles.reasonPickerListContent}
                showsVerticalScrollIndicator={false}
              >
                {reasonOptions.map((item) => {
                  const isActive = item.value === selectedReasonDetail;

                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.reasonPickerOption,
                        isActive && styles.reasonPickerOptionActive,
                      ]}
                      onPress={() => {
                        setSelectedReasonDetail(item.value);
                        setShowReasonDetailPicker(false);
                      }}
                      activeOpacity={0.88}
                    >
                      <Text
                        style={[
                          styles.reasonPickerOptionText,
                          isActive && styles.reasonPickerOptionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowReasonDetailPicker(false)}
                activeOpacity={0.9}
              >
                <Text style={styles.modalSecondaryText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerAppointment;
