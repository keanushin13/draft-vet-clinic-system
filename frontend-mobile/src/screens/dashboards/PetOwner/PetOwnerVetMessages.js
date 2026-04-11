import React from 'react';
import {
  Animated,
  Image,
  Keyboard,
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

const VET_CONVERSATIONS = [
  {
    id: 'vet-chat-1',
    doctor: 'Dr. Sarah Dela Cruz',
    role: 'Follow-up Care',
    preview: "You're welcome, see you on the follow-up checkup.",
    time: '10:58am',
    unread: 1,
    messages: [
      { id: 'vm-1', from: 'doctor', text: 'Good day! How is your dog today?', time: '10:43am' },
      { id: 'vm-2', from: 'user', text: 'Okay naman po, doc.', time: '10:43am' },
      { id: 'vm-3', from: 'doctor', text: 'Please continue the medicine twice a day after meals.', time: '10:52am' },
      { id: 'vm-4', from: 'user', text: 'Noted po. Thank you, doc.', time: '10:54am' },
      { id: 'vm-5', from: 'doctor', text: "You're welcome. See you on the follow-up checkup.", time: '10:58am' },
    ],
  },
  {
    id: 'vet-chat-2',
    doctor: 'Dr. Michael Cruz',
    role: 'Nutrition Advice',
    preview: 'Please make sure na mapainom po siya ng vitamins after meals.',
    time: '9:12am',
    unread: 0,
    messages: [
      { id: 'vm-6', from: 'doctor', text: 'Please make sure na mapainom po siya ng vitamins after meals.', time: '9:12am' },
    ],
  },
];

const VET_OPTIONS = VET_CONVERSATIONS.map((conversation) => ({
  ...conversation,
  title: conversation.doctor,
  icon: require('../../assets/send.png'),
}));

const QUICK_CHAT_OPTIONS = [
  'Ask about my pet symptoms',
  'Request follow-up schedule',
  'Check medicine instructions',
];

const formatCurrentTime = (date) => date.toLocaleTimeString([], {
  hour: 'numeric',
  minute: '2-digit',
}).toLowerCase();

const PetOwnerVetMessages = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const selectedVet = route?.params?.selectedVet || null;
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const displayName =
    loggedInUser?.fullName ||
    loggedInUser?.name ||
    loggedInUser?.username ||
    'Pet Owner';
  const headerMenuAnimation = React.useRef(new Animated.Value(0)).current;
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(formatCurrentTime(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredVetOptions = VET_OPTIONS.filter((item) => {

    if (!normalizedQuery) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.role.toLowerCase().includes(normalizedQuery)
    );
  });

  const suggestionOptions = normalizedQuery ? filteredVetOptions.slice(0, 6) : [];
  const showSuggestions = isSearchFocused && suggestionOptions.length > 0;

  const handleSelectVet = (selectedVet) => {
    setSearchQuery(selectedVet.title);
    setIsSearchFocused(false);
    Keyboard.dismiss();
    navigation.navigate('PetOwnerVetMessages', {
      user: loggedInUser,
      selectedVet,
    });
  };

  const handleSearchSubmit = () => {
    if (!normalizedQuery || !filteredVetOptions.length) {
      return;
    }

    handleSelectVet(filteredVetOptions[0]);
  };

  const handleBackPress = () => {
    if (selectedVet) {
      setSearchQuery('');
      setIsSearchFocused(false);
      Keyboard.dismiss();
      navigation.setParams({ selectedVet: null });
      return;
    }

    navigation.goBack();
  };

  const headerMenuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: require('../../assets/Dashboard_Icon.png'), route: 'petowner-screen' },
    { key: 'appointment', label: 'Appointment', icon: require('../../assets/Appointment_Icon.png'), route: 'PetOwnerAppointment' },
    { key: 'mypets', label: 'My Pets', icon: require('../../assets/Pets_Icon.png'), route: 'PetOwnerMyPets' },
    { key: 'messages', label: 'Messages', icon: require('../../assets/Message_Icon.png'), route: 'PetOwnerMessages' },
    { key: 'medical', label: 'Medical Records', icon: require('../../assets/Medical_Icon.png'), route: 'PetOwnerMedRec' },
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
                <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
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
                <Image source={require('../../assets/Bell_Icon.png')} style={styles.notifIcon} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('PetOwnerProfile', { user: loggedInUser })}
                activeOpacity={0.85}
              >
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.profileButtonImage} resizeMode="cover" />
                ) : (
                  <Image source={DEFAULT_PROFILE_IMAGE} style={styles.profileIcon} resizeMode="contain" />
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

              <TouchableOpacity style={styles.backTriggerButton} onPress={handleBackPress} activeOpacity={0.85}>
                <Image source={require('../../assets/Back_Icon.png')} style={styles.backTriggerIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <View style={styles.ownerSummary}>
              <Text style={styles.headerCaption}>Chat with Veterinarian</Text>
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
                    <Image source={item.icon} style={styles.headerMenuItemIcon} resizeMode="contain" />
                  </View>
                  <Text style={styles.headerMenuItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ) : null}
        </LinearGradient>

        {selectedVet ? (
          <>
            <ScrollView
              style={styles.chatArea}
              contentContainerStyle={[styles.chatContent, localStyles.chatContent]}
              showsVerticalScrollIndicator={false}
            >
                <View style={styles.quickAssistMessageRow}>
                  <View style={styles.quickAssistMessageCard}>
                    <Text style={styles.quickAssistMessageText}>
                      Quick chat with {selectedVet.doctor}
                    </Text>

                    {QUICK_CHAT_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.quickAssistActionButton}
                      activeOpacity={0.9}
                    >
                        <Text style={styles.quickAssistActionButtonText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.quickAssistMessageTime}>{currentTime}</Text>
                </View>
            </ScrollView>

            <View style={styles.inputBar}>
              <View style={styles.inlineInputWrap}>
                <TextInput
                  editable={false}
                  placeholder={`Message ${selectedVet.doctor}...`}
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
          </>
        ) : (
          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
            <View style={styles.messagesHeaderCard}>
              <Text style={styles.messagesHeaderTitle}>Choose Veterinarian</Text>
            </View>

            <View style={styles.searchCard}>
              <View style={styles.searchInputWrap}>
                <TextInput
                  placeholder="Search veterinarian"
                  placeholderTextColor="#6e8a9d"
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  style={styles.searchIconButton}
                  onPress={handleSearchSubmit}
                  activeOpacity={0.85}
                >
                  <Image
                    source={require('../../assets/Search.png')}
                    style={styles.searchIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {showSuggestions ? (
                <View style={styles.searchDropdown}>
                  {suggestionOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.searchDropdownItem}
                      onPress={() => handleSelectVet(item)}
                      activeOpacity={0.88}
                    >
                      <View style={styles.searchDropdownTextWrap}>
                        <Text style={styles.searchDropdownTitle}>{item.title}</Text>
                        <Text style={styles.searchDropdownSubtitle}>{item.role}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.optionsCard}>
              {filteredVetOptions.length ? (
                filteredVetOptions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.optionRow}
                    onPress={() => handleSelectVet(item)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{item.title}</Text>
                      <Text style={styles.optionSubtitle}>{item.role}</Text>
                    </View>

                    <View style={styles.optionIconWrap}>
                      <Image
                        source={item.icon}
                        style={styles.optionIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.inboxOnlyHintText}>No veterinarian found for "{searchQuery.trim()}".</Text>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  chatContent: {
    justifyContent: 'flex-end',
    minHeight: '100%',
  },
});

export default PetOwnerVetMessages;
