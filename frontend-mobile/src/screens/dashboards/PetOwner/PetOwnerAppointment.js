import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerAppointmentDesign';

const REASONS = ['Consultation', 'Vaccination', 'Deworming', 'Minor Surgery'];

const PETS = [
  { id: 'pet-1', name: 'Max', breed: 'Labrador Retriever' },
  { id: 'pet-2', name: 'Bella', breed: 'Shih Tzu' },
  { id: 'pet-3', name: 'Milo', breed: 'Persian Cat' },
];

const CURRENT_YEAR = 2026;
const CURRENT_MONTH_INDEX = 2;

const YEARS = [2026, 2027];
const MONTHS = [
  { label: 'Jan', value: 'January', index: 0 },
  { label: 'Feb', value: 'February', index: 1 },
  { label: 'Mar', value: 'March', index: 2 },
  { label: 'Apr', value: 'April', index: 3 },
  { label: 'May', value: 'May', index: 4 },
  { label: 'Jun', value: 'June', index: 5 },
  { label: 'Jul', value: 'July', index: 6 },
  { label: 'Aug', value: 'August', index: 7 },
  { label: 'Sep', value: 'September', index: 8 },
  { label: 'Oct', value: 'October', index: 9 },
  { label: 'Nov', value: 'November', index: 10 },
  { label: 'Dec', value: 'December', index: 11 },
];

const CALENDAR_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIMES = ['08:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];

const AI_RECOMMENDATIONS = [
  {
    title: 'Best Slot',
    value: 'Apr 13, 10:30 AM',
    note: 'Lower queue and ideal for routine wellness visits.',
  },
  {
    title: 'Alternative',
    value: 'Apr 14, 01:00 PM',
    note: 'Balanced availability with faster confirmation chances.',
  },
  {
    title: 'Reminder',
    value: 'Morning Visit',
    note: 'Recommended if your pet is calmer earlier in the day.',
  },
];

const buildCalendarDates = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const previousMonthDays = new Date(year, monthIndex, 0).getDate();
  const dates = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
    dates.push({
      key: `prev-${i}`,
      day: String(previousMonthDays - i),
      muted: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const isPastCurrentMonth =
      year === CURRENT_YEAR &&
      monthIndex === CURRENT_MONTH_INDEX &&
      day < 24;

    dates.push({
      key: `current-${day}`,
      day: String(day),
      muted: isPastCurrentMonth,
    });
  }

  while (dates.length % 7 !== 0) {
    dates.push({
      key: `next-${dates.length}`,
      day: String(dates.length % 7 === 0 ? 1 : (dates.length % 7) + 1),
      muted: true,
    });
  }

  return dates;
};

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
  const [dateSectionY, setDateSectionY] = useState(0);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState('13');
  const [selectedTime, setSelectedTime] = useState(TIMES[1]);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [showBookConfirm, setShowBookConfirm] = useState(false);
  const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRescheduleBanner, setShowRescheduleBanner] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const appointmentActions = [
    {
      key: 'reschedule',
      label: 'Reschedule',
      variant: 'secondary',
    },
    {
      key: 'cancel',
      label: 'Cancel',
      variant: 'danger',
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

  const selectedPetLabel = selectedPet
    ? `${selectedPet.name} - ${selectedPet.breed}`
    : 'Choose a pet first';

  const selectedMonth = MONTHS.find((month) => month.index === selectedMonthIndex);
  const availableMonths = MONTHS.filter(
    (month) => selectedYear > CURRENT_YEAR || month.index >= CURRENT_MONTH_INDEX,
  );

  const canBook = Boolean(selectedPet);
  const calendarDates = buildCalendarDates(selectedYear, selectedMonthIndex);

  useEffect(() => {
    if (!showNotificationToast) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowNotificationToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showNotificationToast]);

  useEffect(() => {
    const daysInSelectedMonth = new Date(
      selectedYear,
      selectedMonthIndex + 1,
      0,
    ).getDate();

    if (Number(selectedDate) > daysInSelectedMonth) {
      setSelectedDate(String(daysInSelectedMonth));
      return;
    }

    if (
      selectedYear === CURRENT_YEAR &&
      selectedMonthIndex === CURRENT_MONTH_INDEX &&
      Number(selectedDate) < 24
    ) {
      setSelectedDate('24');
    }
  }, [selectedDate, selectedMonthIndex, selectedYear]);

  const handleBookConfirm = () => {
    const newAppointment = {
      pet: selectedPet,
      reason: selectedReason,
      day: selectedDate,
      month: selectedMonth?.value || 'April',
      year: selectedYear,
      time: selectedTime,
    };

    setBookedAppointment(newAppointment);
    setShowBookConfirm(false);
    setShowNotificationToast(true);
    setShowRescheduleBanner(false);
  };

  const handleBellPress = () => {
    setShowNotificationToast(false);
    navigation.navigate('PetOwnerNotif', { user: loggedInUser });
  };

  const handleManagementAction = (actionKey) => {
    if (!bookedAppointment) {
      return;
    }

    if (actionKey === 'reschedule') {
      setShowRescheduleConfirm(true);
      return;
    }

    if (actionKey === 'cancel') {
      setShowCancelConfirm(true);
    }
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
                <Text style={styles.headerSubtitle}>Appointment Management</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notifButton}
                onPress={handleBellPress}
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
                    source={require('../../assets/User_Icon.png')}
                    style={styles.profileIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {showNotificationToast && (
            <View style={styles.notificationToast}>
              <View style={styles.notificationPointer} />
              <Text style={styles.notificationToastTitle}>Booking Sent</Text>
              <Text style={styles.notificationToastText}>
                You have just made a booking appointment.
              </Text>
            </View>
          )}

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
              <Text style={styles.headerCaption}>Veterinary Check-Up</Text>
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
            colors={['#7aa4c8', '#698fb0', '#567997']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text style={styles.heroEyebrow}>Book with confidence</Text>
            <Text style={styles.heroTitle}>Veterinary Check-Up Appointment</Text>
            <Text style={styles.heroDescription}>
              Book, confirm, reschedule, or cancel your visit while reviewing AI
              schedule recommendations for the best time slot.
            </Text>
          </LinearGradient>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Visit Details</Text>
            <Text style={styles.sectionSubtitle}>
              Choose your pet, reason, date, and time for the visit
            </Text>
          </View>

          <View style={styles.bookingCard}>
            <Text style={styles.fieldLabel}>Choose pet for check-up</Text>
            <View style={styles.optionGrid}>
              {PETS.map((pet) => {
                const isActive = selectedPet?.id === pet.id;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petChip, isActive && styles.petChipActive]}
                    onPress={() => setSelectedPet(pet)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[styles.petChipTitle, isActive && styles.petChipTitleActive]}
                    >
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

            <Text style={styles.fieldLabel}>Reason for visit</Text>
            <View style={styles.optionGrid}>
              {REASONS.map((reason) => {
                const isActive = reason === selectedReason;

                return (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.optionChip, isActive && styles.optionChipActive]}
                    onPress={() => setSelectedReason(reason)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        isActive && styles.optionChipTextActive,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View
              onLayout={(event) => setDateSectionY(event.nativeEvent.layout.y)}
            >
              <Text style={styles.fieldLabel}>Choose date</Text>
              {showRescheduleBanner && (
                <View style={styles.rescheduleBanner}>
                  <Text style={styles.rescheduleBannerTitle}>Reschedule Mode Active</Text>
                  <Text style={styles.rescheduleBannerText}>
                    Pick a new month, year, date, and time below.
                  </Text>
                </View>
              )}
              <View style={styles.calendarSelectorsRow}>
                <View style={styles.selectorGroup}>
                  <Text style={styles.selectorLabel}>Month</Text>
                  <View style={styles.selectorRow}>
                    {availableMonths.map((month) => {
                      const isActive = month.index === selectedMonthIndex;

                      return (
                        <TouchableOpacity
                          key={month.label}
                          style={[
                            styles.selectorChip,
                            isActive && styles.selectorChipActive,
                          ]}
                          onPress={() => setSelectedMonthIndex(month.index)}
                          activeOpacity={0.9}
                        >
                          <Text
                            style={[
                              styles.selectorChipText,
                              isActive && styles.selectorChipTextActive,
                            ]}
                          >
                            {month.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.selectorGroup}>
                  <Text style={styles.selectorLabel}>Year</Text>
                  <View style={styles.selectorRow}>
                    {YEARS.map((year) => {
                      const isActive = year === selectedYear;

                      return (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.selectorChip,
                            isActive && styles.selectorChipActive,
                          ]}
                          onPress={() => {
                            setSelectedYear(year);
                            if (year === CURRENT_YEAR && selectedMonthIndex < CURRENT_MONTH_INDEX) {
                              setSelectedMonthIndex(CURRENT_MONTH_INDEX);
                            }
                          }}
                          activeOpacity={0.9}
                        >
                          <Text
                            style={[
                              styles.selectorChipText,
                              isActive && styles.selectorChipTextActive,
                            ]}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarMonth}>
                    {selectedMonth?.value} {selectedYear}
                  </Text>
                  <Text style={styles.calendarMeta}>Choose your visit day</Text>
                </View>

                <View style={styles.calendarWeekRow}>
                  {CALENDAR_DAYS.map((day) => (
                    <Text key={day} style={styles.calendarWeekDay}>
                      {day}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {calendarDates.map((date) => {
                    const isActive = date.day === selectedDate;

                    return (
                      <TouchableOpacity
                        key={date.key}
                        style={[
                          styles.calendarDayCell,
                          isActive && styles.calendarDayCellActive,
                          date.muted && styles.calendarDayCellMuted,
                        ]}
                        onPress={() => !date.muted && setSelectedDate(date.day)}
                        activeOpacity={0.9}
                      >
                        <Text
                          style={[
                            styles.calendarDayText,
                            isActive && styles.calendarDayTextActive,
                            date.muted && styles.calendarDayTextMuted,
                          ]}
                        >
                          {date.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Choose time</Text>
            <View style={styles.timeCalendarCard}>
              <View style={styles.timeCalendarHeader}>
                <Text style={styles.timeCalendarTitle}>Available Schedule</Text>
                <Text style={styles.timeCalendarMeta}>Tap a slot to reserve it</Text>
              </View>

              <View style={styles.optionGrid}>
                {TIMES.map((time) => {
                  const isActive = time === selectedTime;

                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.slotChip, isActive && styles.slotChipActive]}
                      onPress={() => setSelectedTime(time)}
                      activeOpacity={0.9}
                    >
                      <Text
                        style={[
                          styles.slotChipText,
                          isActive && styles.slotChipTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <Text style={styles.summaryText}>Pet: {selectedPetLabel}</Text>
              <Text style={styles.summaryText}>Reason: {selectedReason}</Text>
              <Text style={styles.summaryText}>
                Date: {selectedMonth?.value} {selectedDate}, {selectedYear}
              </Text>
              <Text style={styles.summaryText}>Time: {selectedTime}</Text>
              <Text style={styles.summaryNote}>
                Confirmed schedules will appear in your upcoming appointment list.
              </Text>
            </View>

            <View style={styles.primaryButtonRow}>
              <TouchableOpacity
                style={[
                  styles.primaryActionButtonFull,
                  !canBook && styles.primaryActionButtonDisabled,
                ]}
                activeOpacity={0.9}
                onPress={() => canBook && setShowBookConfirm(true)}
              >
                <Text style={styles.primaryActionText}>Book & Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>AI Schedule Recommendations</Text>
            <Text style={styles.sectionSubtitle}>
              Smart suggestions for better visit timing
            </Text>
          </View>

          <View style={styles.recommendationCard}>
            {AI_RECOMMENDATIONS.map((item) => (
              <View key={item.title} style={styles.recommendationItem}>
                <View style={styles.recommendationBadge}>
                  <Text style={styles.recommendationBadgeText}>AI</Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{item.title}</Text>
                  <Text style={styles.recommendationValue}>{item.value}</Text>
                  <Text style={styles.recommendationNote}>{item.note}</Text>
                </View>
              </View>
            ))}
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
                  Confirm a booking first and your upcoming check-up details will
                  appear here.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.managementMeta}>
                  {bookedAppointment.pet.name} - {bookedAppointment.pet.breed}
                </Text>

                <View style={styles.managementInfoGrid}>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Reason</Text>
                    <Text style={styles.managementInfoValue}>
                      {bookedAppointment.reason}
                    </Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Date</Text>
                    <Text style={styles.managementInfoValue}>
                      {bookedAppointment.month} {bookedAppointment.day},{' '}
                      {bookedAppointment.year}
                    </Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Time</Text>
                    <Text style={styles.managementInfoValue}>
                      {bookedAppointment.time}
                    </Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Doctor</Text>
                    <Text style={styles.managementInfoValue}>Dr. Assigned</Text>
                  </View>
                </View>

                <View style={styles.managementActionRow}>
                  {appointmentActions.map((action) => (
                    <TouchableOpacity
                      key={action.key}
                      style={[
                        styles.managementActionButton,
                        action.variant === 'secondary' &&
                          styles.managementActionButtonBlue,
                        action.variant === 'danger' &&
                          styles.managementActionButtonDanger,
                      ]}
                      onPress={() => handleManagementAction(action.key)}
                      activeOpacity={0.9}
                    >
                      <Text
                        style={[
                          styles.managementActionText,
                          action.variant === 'secondary' &&
                            styles.managementActionTextLight,
                          action.variant === 'danger' &&
                            styles.managementActionTextDanger,
                        ]}
                      >
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, styles.activeNavItem]}
            onPress={() => navigation.navigate('PetOwnerMessages', { user: loggedInUser })}
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
          visible={showBookConfirm}
          onRequestClose={() => setShowBookConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to book this appointment for {selectedPetLabel}?
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowBookConfirm(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={handleBookConfirm}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalPrimaryText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={showRescheduleConfirm}
          onRequestClose={() => setShowRescheduleConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reschedule Appointment</Text>
              <Text style={styles.modalMessage}>
                Do you want to reschedule this appointment?
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowRescheduleConfirm(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={() => {
                    setShowRescheduleConfirm(false);
                    setShowRescheduleBanner(true);
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({
                        y: Math.max(dateSectionY - 18, 0),
                        animated: true,
                      });
                    }, 120);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalPrimaryText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
                  onPress={() => {
                    setShowCancelConfirm(false);
                    setBookedAppointment(null);
                    setShowRescheduleBanner(false);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalDangerText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerAppointment;
