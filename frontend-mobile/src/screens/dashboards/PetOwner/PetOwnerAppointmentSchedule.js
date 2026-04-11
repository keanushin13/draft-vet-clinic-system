import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerAppointmentDesign';
import { getAllPets } from './PetOwnerMyPetsInfo';
import {
  AI_RECOMMENDATIONS,
  CALENDAR_DAYS,
  CURRENT_DAY,
  CURRENT_MONTH_INDEX,
  CURRENT_YEAR,
  MONTHS,
  YEARS,
  getBookedAppointment as getStoredBookedAppointment,
  setBookedAppointment as setStoredBookedAppointment,
} from './PetOwnerAppointmentData';
import {
  buildDaySlots,
  createDateKey,
  getSharedAppointmentCalendarState,
  isDateEnabledForBookings,
} from '../Staff/StaffAppointmentData';

const DEFAULT_PROFILE_IMAGE = require('../../assets/Profile.png');
const CALENDAR_ICON = require('../../assets/calendar.png');

const buildCalendarDays = (visibleMonthDate) => {
  const year = visibleMonthDate.getFullYear();
  const month = visibleMonthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const isSameCalendarDate = (leftDate, rightDate) => (
  leftDate?.getFullYear() === rightDate?.getFullYear() &&
  leftDate?.getMonth() === rightDate?.getMonth() &&
  leftDate?.getDate() === rightDate?.getDate()
);

const getAppointmentDateFromBooking = (appointment) => {
  const monthIndex =
    MONTHS.find((month) => month.value === appointment?.month)?.index ?? CURRENT_MONTH_INDEX;
  const day = Math.max(Number(appointment?.day) || CURRENT_DAY, 1);
  const year = Number(appointment?.year) || CURRENT_YEAR;

  return new Date(year, monthIndex, day);
};

const formatBookedTimestamp = (value) => {
  if (!value) {
    return 'Waiting for submission';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Waiting for submission';
  }

  const monthLabel = MONTHS[date.getMonth()]?.value || 'Appointment';
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';
  const hour = date.getHours() % 12 || 12;

  return `${monthLabel} ${date.getDate()}, ${date.getFullYear()} • ${hour}:${minutes} ${period}`;
};

const PetOwnerAppointmentSchedule = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const appointmentDraft = route?.params?.appointmentDraft || {};
  const existingAppointment = route?.params?.existingAppointment || null;
  const preselectedPetId = route?.params?.preselectedPetId || '';
  const initialPets = getAllPets();
  const initialAppointmentDate = existingAppointment
    ? getAppointmentDateFromBooking(existingAppointment)
    : null;
  const initialSelectedPet =
    initialPets.find((pet) => pet.id === preselectedPetId) || existingAppointment?.pet || null;
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';
  const ownerDisplayName =
    loggedInUser?.fullName ||
    loggedInUser?.name ||
    loggedInUser?.username ||
    'Pet Owner';
  const headerMenuAnimation = React.useRef(new Animated.Value(0)).current;
  const isHeaderMenuAnimating = React.useRef(false);

  const [pets, setPets] = useState(initialPets);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(initialSelectedPet);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    initialAppointmentDate?.getMonth() ?? CURRENT_MONTH_INDEX,
  );
  const [selectedYear, setSelectedYear] = useState(
    initialAppointmentDate?.getFullYear() ?? CURRENT_YEAR,
  );
  const [selectedDate, setSelectedDate] = useState(
    initialAppointmentDate ? String(initialAppointmentDate.getDate()) : '',
  );
  const [selectedTime, setSelectedTime] = useState(existingAppointment?.time || '');
  const [calendarMonthDate, setCalendarMonthDate] = useState(
    initialAppointmentDate
      ? new Date(initialAppointmentDate.getFullYear(), initialAppointmentDate.getMonth(), 1)
      : new Date(CURRENT_YEAR, CURRENT_MONTH_INDEX, 1),
  );
  const [pendingAppointmentDate, setPendingAppointmentDate] = useState(initialAppointmentDate);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(() => getStoredBookedAppointment());
  const [staffCalendarState, setStaffCalendarState] = useState(
    () => getSharedAppointmentCalendarState(),
  );
  const [showBookConfirm, setShowBookConfirm] = useState(false);
  const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const selectedReasonSummary =
    appointmentDraft.reasonSummary ||
    existingAppointment?.reason ||
    'Choose a visit reason on the previous step.';
  const hasReason = Boolean(appointmentDraft.reasonSummary || existingAppointment?.reason);
  const hasSelectedPet = Boolean(selectedPet);
  const hasConfirmedDate = Boolean(selectedDate);
  const selectedPetLabel = selectedPet
    ? `${selectedPet.name} - ${selectedPet.breed}`
    : 'Choose a pet first';
  const selectedReferenceCode = selectedPet?.referenceCode || 'Not available yet';
  const selectedMonth = MONTHS.find((month) => month.index === selectedMonthIndex);
  const selectedDateLabel = hasConfirmedDate
    ? `${selectedMonth?.value} ${selectedDate}, ${selectedYear}`
    : 'Select appointment date';
  const pendingRequestStatus = 'Pending Request';
  const bookedRequestReferenceCode =
    bookedAppointment?.referenceCode || bookedAppointment?.pet?.referenceCode || 'Not available';
  const bookedRequestOwnerName = bookedAppointment?.ownerName || ownerDisplayName;
  const bookedRequestStatus = bookedAppointment?.status || pendingRequestStatus;
  const bookedRequestTimestamp = formatBookedTimestamp(bookedAppointment?.bookedAt);
  const yearOptions = useMemo(
    () =>
      YEARS.map((year) => ({
        label: String(year),
        value: String(year),
      })),
    [],
  );
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonthDate), [calendarMonthDate]);
  const activeCalendarDate =
    pendingAppointmentDate ||
    (hasConfirmedDate
      ? new Date(selectedYear, selectedMonthIndex, Number(selectedDate))
      : null);
  const selectedDateKey = hasConfirmedDate
    ? createDateKey(selectedYear, selectedMonthIndex, Number(selectedDate))
    : '';
  const selectedDateIsOpen = selectedDateKey
    ? isDateEnabledForBookings(
        selectedDateKey,
        staffCalendarState.daySchedules,
        staffCalendarState.appointments,
      )
    : false;
  const availableTimeSlots = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return buildDaySlots(
      selectedDateKey,
      staffCalendarState.daySchedules,
      staffCalendarState.appointments,
    )
      .filter((slot) => slot.isBookable)
      .map((slot) => slot.time);
  }, [selectedDateKey, staffCalendarState.appointments, staffCalendarState.daySchedules]);
  const canBook =
    hasReason &&
    hasSelectedPet &&
    hasConfirmedDate &&
    selectedDateIsOpen &&
    Boolean(selectedTime);

  const appointmentActions = [
    { key: 'reschedule', label: 'Reschedule', variant: 'secondary' },
    { key: 'cancel', label: 'Cancel', variant: 'danger' },
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

  const resetScheduleSelection = useCallback(() => {
    setSelectedYear(CURRENT_YEAR);
    setSelectedMonthIndex(CURRENT_MONTH_INDEX);
    setSelectedDate('');
    setSelectedTime('');
    setCalendarMonthDate(new Date(CURRENT_YEAR, CURRENT_MONTH_INDEX, 1));
    setPendingAppointmentDate(null);
  }, []);

  const restoreExistingAppointmentSelection = useCallback(() => {
    if (!existingAppointment) {
      resetScheduleSelection();
      return;
    }

    const existingDate = getAppointmentDateFromBooking(existingAppointment);

    setSelectedYear(existingDate.getFullYear());
    setSelectedMonthIndex(existingDate.getMonth());
    setSelectedDate(String(existingDate.getDate()));
    setSelectedTime(existingAppointment.time || '');
    setCalendarMonthDate(new Date(existingDate.getFullYear(), existingDate.getMonth(), 1));
    setPendingAppointmentDate(existingDate);
  }, [existingAppointment, resetScheduleSelection]);

  const isDateOpenForBooking = useCallback(
    (date) => {
      if (!date) {
        return false;
      }

      return isDateEnabledForBookings(
        createDateKey(date.getFullYear(), date.getMonth(), date.getDate()),
        staffCalendarState.daySchedules,
        staffCalendarState.appointments,
      );
    },
    [staffCalendarState.appointments, staffCalendarState.daySchedules],
  );

  useFocusEffect(
    useCallback(() => {
      const nextPets = getAllPets();
      setPets(nextPets);
      setBookedAppointment(getStoredBookedAppointment());
      setStaffCalendarState(getSharedAppointmentCalendarState());

      if (preselectedPetId) {
        const matchedPet = nextPets.find((pet) => pet.id === preselectedPetId);

        if (matchedPet) {
          setSelectedPet(matchedPet);
          resetScheduleSelection();
        }

        navigation.setParams({ preselectedPetId: undefined });
        return;
      }

      if (selectedPet?.id) {
        const refreshedSelectedPet = nextPets.find((pet) => pet.id === selectedPet.id);

        if (refreshedSelectedPet) {
          setSelectedPet(refreshedSelectedPet);
        }
      }
    }, [navigation, preselectedPetId, resetScheduleSelection, selectedPet?.id]),
  );

  useEffect(() => {
    if (!hasConfirmedDate) {
      return;
    }

    const daysInSelectedMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();

    if (Number(selectedDate) > daysInSelectedMonth) {
      setSelectedDate(String(daysInSelectedMonth));
      return;
    }

    if (
      selectedYear === CURRENT_YEAR &&
      selectedMonthIndex === CURRENT_MONTH_INDEX &&
      Number(selectedDate) < CURRENT_DAY
    ) {
      setSelectedDate(String(CURRENT_DAY));
    }
  }, [hasConfirmedDate, selectedDate, selectedMonthIndex, selectedYear]);

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    if (availableTimeSlots.includes(selectedTime)) {
      return;
    }

    setSelectedTime('');
  }, [availableTimeSlots, selectedTime]);

  const handleSelectPet = (pet) => {
    const isDifferentPet = selectedPet?.id !== pet.id;

    setSelectedPet(pet);

    if (!isDifferentPet) {
      return;
    }

    if (existingAppointment?.pet?.id === pet.id) {
      restoreExistingAppointmentSelection();
      return;
    }

    resetScheduleSelection();
  };

  const handleAddPetPress = () => {
    navigation.navigate('PetOwnerMyPetsEdit', {
      user: loggedInUser,
      returnToRoute: 'PetOwnerAppointmentSchedule',
      returnToParams: {
        appointmentDraft,
        existingAppointment,
      },
    });
  };

  const openAppointmentCalendar = () => {
    const fallbackDay =
      selectedYear === CURRENT_YEAR && selectedMonthIndex === CURRENT_MONTH_INDEX ? CURRENT_DAY : 1;
    const baseDate = hasConfirmedDate
      ? new Date(selectedYear, selectedMonthIndex, Number(selectedDate))
      : new Date(selectedYear, selectedMonthIndex, fallbackDay);

    setCalendarMonthDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    setPendingAppointmentDate(hasConfirmedDate && isDateOpenForBooking(baseDate) ? baseDate : null);
    setShowAppointmentCalendar(true);
  };

  const handleAppointmentDateSelect = (day) => {
    const nextDate = new Date(
      calendarMonthDate.getFullYear(),
      calendarMonthDate.getMonth(),
      day,
    );

    setPendingAppointmentDate(nextDate);
  };

  const handleAppointmentDateDone = () => {
    if (!pendingAppointmentDate || !isDateOpenForBooking(pendingAppointmentDate)) {
      return;
    }

    const nextYear = pendingAppointmentDate.getFullYear();
    const nextMonthIndex = pendingAppointmentDate.getMonth();
    const nextDay = String(pendingAppointmentDate.getDate());
    const previousDateKey = hasConfirmedDate
      ? `${selectedYear}-${selectedMonthIndex}-${selectedDate}`
      : '';
    const nextDateKey = `${nextYear}-${nextMonthIndex}-${nextDay}`;

    setSelectedYear(nextYear);
    setSelectedMonthIndex(nextMonthIndex);
    setSelectedDate(nextDay);
    setCalendarMonthDate(new Date(nextYear, nextMonthIndex, 1));
    setPendingAppointmentDate(null);
    setShowAppointmentCalendar(false);

    if (previousDateKey !== nextDateKey) {
      setSelectedTime('');
    }
  };

  const shiftCalendarMonth = (direction) => {
    setCalendarMonthDate((current) => {
      const candidateDate = new Date(current.getFullYear(), current.getMonth() + direction, 1);
      const earliestAllowedDate = new Date(CURRENT_YEAR, CURRENT_MONTH_INDEX, 1);
      const latestAllowedDate = new Date(Math.max(...YEARS), 11, 1);

      if (candidateDate < earliestAllowedDate || candidateDate > latestAllowedDate) {
        return current;
      }

      return candidateDate;
    });
    setPendingAppointmentDate(null);
  };

  const handleCalendarYearChange = (item) => {
    const year = Number(item.value);
    const adjustedMonthIndex =
      year === CURRENT_YEAR
        ? Math.max(calendarMonthDate.getMonth(), CURRENT_MONTH_INDEX)
        : calendarMonthDate.getMonth();

    setCalendarMonthDate(new Date(year, adjustedMonthIndex, 1));
    setPendingAppointmentDate(null);
  };

  const handleBookConfirm = () => {
    const bookedAt = new Date().toISOString();
    const newAppointment = {
      pet: selectedPet,
      reason: selectedReasonSummary,
      day: selectedDate,
      month: selectedMonth?.value || 'April',
      year: selectedYear,
      time: selectedTime,
      status: pendingRequestStatus,
      ownerName: ownerDisplayName,
      referenceCode: selectedPet?.referenceCode || '',
      bookedAt,
    };

    setBookedAppointment(newAppointment);
    setStoredBookedAppointment(newAppointment);
    setShowBookConfirm(false);
    navigation.navigate('PetOwnerAppointment', {
      user: loggedInUser,
      resetBookingFlow: true,
    });
  };

  const handleBackToReason = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('PetOwnerAppointment', { user: loggedInUser });
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

    openHeaderMenu();
  };

  const handleHeaderMenuPress = (screenRoute) => {
    closeHeaderMenu();
    navigation.navigate(screenRoute, { user: loggedInUser });
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

          <View style={styles.headerBottomRowWrap}>
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

              <View style={styles.flowHeaderTextWrap}>
                <Text style={styles.headerCaption}>Step 2 of 2</Text>
                <Text style={styles.ownerName}>{headerDisplayName}</Text>
              </View>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Schedule Appointment</Text>
            <Text style={styles.sectionSubtitle}>
              Choose the pet first, then date, then time.
            </Text>
          </View>

          <View style={styles.bookingCard}>
            <View style={styles.flowStepBadge}>
              <Text style={styles.flowStepBadgeText}>Step 2</Text>
            </View>

            <View style={styles.flowSummaryCard}>
              <Text style={styles.flowSummaryLabel}>Visit Reason</Text>
              <Text style={styles.flowSummaryValue}>{selectedReasonSummary}</Text>
              <TouchableOpacity
                style={styles.flowSummaryButton}
                onPress={handleBackToReason}
                activeOpacity={0.88}
              >
                <Text style={styles.flowSummaryButtonText}>Change Reason</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Choose pet for check-up</Text>
            <View style={styles.optionGrid}>
              {pets.map((pet) => {
                const isActive = selectedPet?.id === pet.id;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petChip, isActive && styles.petChipActive]}
                    onPress={() => handleSelectPet(pet)}
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

              <TouchableOpacity
                style={styles.addPetChip}
                onPress={handleAddPetPress}
                activeOpacity={0.88}
              >
                <Text style={styles.addPetChipPlus}>+</Text>
                <Text style={styles.addPetChipTitle}>Add Pet</Text>
                <Text style={styles.addPetChipSubtitle}>Create a pet profile</Text>
              </TouchableOpacity>
            </View>

            {!pets.length ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No pets available yet</Text>
                <Text style={styles.emptyStateText}>
                  Add a pet profile first so you can continue with appointment scheduling.
                </Text>
              </View>
            ) : null}

            {hasSelectedPet ? (
              <>
                <View style={styles.sectionHeaderWrap}>
                  <Text style={styles.sectionTitle}>AI Schedule Recommendations</Text>
                  <Text style={styles.sectionSubtitle}>
                    Smart suggestions for {selectedPet.name}&apos;s visit timing
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

                  <Text style={styles.fieldLabel}>Choose appointment date</Text>
                <View style={styles.visitDateFieldCard}>
                  <Text style={styles.visitDateInfoText}>
                    Pick from the green clinic dates that staff marked as available.
                  </Text>
                  <TouchableOpacity
                    style={styles.visitCalendarTriggerButton}
                    onPress={openAppointmentCalendar}
                    activeOpacity={0.88}
                  >
                    <View>
                      <Text style={styles.visitCalendarTriggerLabel}>Selected Date</Text>
                      <Text
                        style={[
                          styles.visitCalendarTriggerValue,
                          !hasConfirmedDate && styles.visitCalendarTriggerValuePlaceholder,
                        ]}
                      >
                        {selectedDateLabel}
                      </Text>
                    </View>
                    <Image
                      source={CALENDAR_ICON}
                      style={styles.visitCalendarTriggerIconImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : null}

            {hasConfirmedDate ? (
              <>
                <Text style={styles.fieldLabel}>Choose time</Text>
                <View style={styles.timeCalendarCard}>
                  <View style={styles.timeCalendarHeader}>
                    <Text style={styles.timeCalendarTitle}>Available Schedule</Text>
                    <Text style={styles.timeCalendarMeta}>Tap an open staff slot to reserve it</Text>
                  </View>

                  {selectedDateIsOpen && availableTimeSlots.length ? (
                    <View style={styles.optionGrid}>
                      {availableTimeSlots.map((time) => {
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
                  ) : (
                    <View style={styles.emptyStateCard}>
                      <Text style={styles.emptyStateTitle}>No open time slots on this date</Text>
                      <Text style={styles.emptyStateText}>
                        Choose another green date from the calendar to see staff-approved times.
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Pending Request Summary</Text>
                  <Text style={styles.summaryText}>Status: {pendingRequestStatus}</Text>
                  <Text style={styles.summaryText}>Reason: {selectedReasonSummary}</Text>
                  <Text style={styles.summaryText}>Pet: {selectedPetLabel}</Text>
                  <Text style={styles.summaryText}>
                    Animal Code Reference: {selectedReferenceCode}
                  </Text>
                  <Text style={styles.summaryText}>Owner Name: {ownerDisplayName}</Text>
                  <Text style={styles.summaryText}>Date: {selectedDateLabel}</Text>
                  <Text style={styles.summaryText}>
                    Time: {selectedTime || 'Choose time first'}
                  </Text>
                </View>

              </>
            ) : null}

            <View style={styles.inlineButtonRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={handleBackToReason}
                activeOpacity={0.9}
              >
                <Text style={styles.modalSecondaryText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPrimaryButton,
                  !canBook && styles.primaryActionButtonDisabled,
                ]}
                onPress={() => canBook && setShowBookConfirm(true)}
                activeOpacity={0.9}
              >
                <Text style={styles.modalPrimaryText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Pending Request</Text>
            <Text style={styles.sectionSubtitle}>
              Review, reschedule, or cancel your submitted appointment request
            </Text>
          </View>

          <View style={styles.managementCard}>
            <Text style={styles.managementTitle}>Pending Request Details</Text>

            {!bookedAppointment ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No pending request yet</Text>
                <Text style={styles.emptyStateText}>
                  Submit an appointment request first and the pending details will appear here.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.managementMeta}>
                  {bookedAppointment.pet.name} - {bookedAppointment.pet.breed}
                </Text>

                <View style={styles.managementInfoGrid}>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Status</Text>
                    <Text style={styles.managementInfoValue}>{bookedRequestStatus}</Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Reason</Text>
                    <Text style={styles.managementInfoValue}>{bookedAppointment.reason}</Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Animal Code Reference</Text>
                    <Text style={styles.managementInfoValue}>{bookedRequestReferenceCode}</Text>
                  </View>
                  <View style={styles.managementInfoItem}>
                    <Text style={styles.managementInfoLabel}>Owner Name</Text>
                    <Text style={styles.managementInfoValue}>{bookedRequestOwnerName}</Text>
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
                    <Text style={styles.managementInfoLabel}>Time Booked</Text>
                    <Text style={styles.managementInfoValue}>{bookedRequestTimestamp}</Text>
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
          visible={showAppointmentCalendar}
          onRequestClose={() => setShowAppointmentCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.scheduleCalendarModalCard}>
              <Text style={styles.modalTitle}>Choose Appointment Date</Text>
              <Text style={styles.modalMessage}>
                Pick the exact visit date from the green clinic dates below.
              </Text>

              <View style={styles.scheduleCalendarHeaderRow}>
                <TouchableOpacity
                  style={styles.scheduleCalendarNavButton}
                  onPress={() => shiftCalendarMonth(-1)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.scheduleCalendarNavButtonText}>Previous</Text>
                </TouchableOpacity>
                <View style={styles.scheduleCalendarTitleWrap}>
                  <Text style={styles.scheduleCalendarActiveMonth}>
                    {MONTHS[calendarMonthDate.getMonth()].value}
                  </Text>
                  <View style={styles.scheduleCalendarPickerWrapYear}>
                    <Dropdown
                      style={styles.scheduleCalendarPickerDropdown}
                      containerStyle={styles.scheduleDropdownContainer}
                      placeholderStyle={styles.scheduleDropdownPlaceholder}
                      selectedTextStyle={styles.scheduleDropdownSelectedText}
                      itemTextStyle={styles.scheduleDropdownItemText}
                      iconStyle={styles.scheduleDropdownIcon}
                      activeColor="#edf7fd"
                      data={yearOptions}
                      labelField="label"
                      valueField="value"
                      placeholder="Year"
                      value={String(calendarMonthDate.getFullYear())}
                      onChange={handleCalendarYearChange}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.scheduleCalendarNavButton,
                    calendarMonthDate.getFullYear() === Math.max(...YEARS) &&
                      calendarMonthDate.getMonth() === 11 &&
                      styles.scheduleCalendarNavButtonDisabled,
                  ]}
                  onPress={() => shiftCalendarMonth(1)}
                  activeOpacity={0.88}
                  disabled={
                    calendarMonthDate.getFullYear() === Math.max(...YEARS) &&
                    calendarMonthDate.getMonth() === 11
                  }
                >
                  <Text style={styles.scheduleCalendarNavButtonText}>Next</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scheduleCalendarWeekHeader}>
                {CALENDAR_DAYS.map((label) => (
                  <Text key={label} style={styles.scheduleCalendarWeekLabel}>
                    {label}
                  </Text>
                ))}
              </View>

              <View style={styles.scheduleCalendarGrid}>
                {calendarDays.map((day, index) => {
                  const cellDate = day
                    ? new Date(
                        calendarMonthDate.getFullYear(),
                        calendarMonthDate.getMonth(),
                        day,
                      )
                    : null;
                  const isPastDate = day
                    ? (
                      calendarMonthDate.getFullYear() === CURRENT_YEAR &&
                      calendarMonthDate.getMonth() === CURRENT_MONTH_INDEX &&
                      day < CURRENT_DAY
                    )
                    : false;
                  const isStaffAvailable = cellDate ? isDateOpenForBooking(cellDate) : false;
                  const isSelected =
                    cellDate && isSameCalendarDate(activeCalendarDate, cellDate);
                  const isDisabled = !day || isPastDate || !isStaffAvailable;

                  return (
                    <TouchableOpacity
                      key={`${calendarMonthDate.getMonth()}-${calendarMonthDate.getFullYear()}-${index}`}
                      style={[
                        styles.scheduleCalendarDayCell,
                        !day && styles.scheduleCalendarDayCellEmpty,
                        isStaffAvailable && styles.scheduleCalendarDayCellAvailable,
                        isPastDate && styles.scheduleCalendarDayCellDisabled,
                        day && !isPastDate && !isStaffAvailable && styles.scheduleCalendarDayCellDisabled,
                        isSelected && styles.scheduleCalendarDayCellSelected,
                        isSelected &&
                          isStaffAvailable &&
                          styles.scheduleCalendarDayCellAvailableSelected,
                      ]}
                      onPress={() => day && !isDisabled && handleAppointmentDateSelect(day)}
                      disabled={isDisabled}
                      activeOpacity={0.88}
                    >
                      <Text
                        style={[
                          styles.scheduleCalendarDayText,
                          !day && styles.scheduleCalendarDayTextEmpty,
                          isStaffAvailable && styles.scheduleCalendarDayTextAvailable,
                          isPastDate && styles.scheduleCalendarDayTextDisabled,
                          day && !isPastDate && !isStaffAvailable && styles.scheduleCalendarDayTextDisabled,
                          isSelected && styles.scheduleCalendarDayTextSelected,
                          isSelected &&
                            isStaffAvailable &&
                            styles.scheduleCalendarDayTextAvailableSelected,
                        ]}
                      >
                        {day || ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => {
                    setPendingAppointmentDate(null);
                    setShowAppointmentCalendar(false);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                {pendingAppointmentDate ? (
                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={handleAppointmentDateDone}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.modalPrimaryText}>Done</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.scheduleCalendarDonePlaceholder} />
                )}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={showBookConfirm}
          onRequestClose={() => setShowBookConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Confirm Pending Request</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to send this pending appointment request for {selectedPetLabel}?
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
                  onPress={() => setShowRescheduleConfirm(false)}
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
                    setStoredBookedAppointment(null);
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

export default PetOwnerAppointmentSchedule;
