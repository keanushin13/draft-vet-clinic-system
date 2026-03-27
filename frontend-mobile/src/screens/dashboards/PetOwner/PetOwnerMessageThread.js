import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/PetOwnerMessagesDesign';

const AI_REPLY_SUGGESTIONS = [
  'Okay naman po, doc.',
  'Noted po. Thank you, doc.',
  'Can we schedule the follow-up checkup now?',
];

const PetOwnerMessageThread = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const conversation = route?.params?.conversation;
  const scrollViewRef = useRef(null);
  const profileImageUri = loggedInUser?.profileImageUri || loggedInUser?.avatar || '';
  const headerDisplayName =
    loggedInUser?.username ||
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    'Pet Owner';
  const headerMenuAnimation = useRef(new Animated.Value(0)).current;
  const lowerHeaderAnimation = useRef(new Animated.Value(1)).current;
  const isHeaderMenuAnimating = useRef(false);
  const isLowerHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
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

  if (!conversation) {
    return (
      <SafeAreaView style={styles.threadFallbackContainer}>
        <Text style={styles.threadFallbackText}>Conversation not found.</Text>
      </SafeAreaView>
    );
  }

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
                    source={require('../../assets/User_Icon.png')}
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
              <Text style={styles.headerCaption}>Message thread</Text>
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

        <View style={styles.threadTopBar}>
          <TouchableOpacity
            style={styles.threadBackButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Image
              source={require('../../assets/Back_Icon.png')}
              style={styles.threadBackIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.threadTopTitle}>Messages</Text>

          <View style={styles.threadTopSpacer} />
        </View>

        <View style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderProfile}>
              <View style={styles.chatHeaderAvatarWrap}>
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.chatHeaderAvatar}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.chatHeaderTextWrap}>
                <Text style={styles.chatHeaderName}>{conversation.doctor}</Text>
                <Text style={styles.chatHeaderStatus}>{conversation.role}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.threadScrollContent}
          >
            <LinearGradient
              colors={['#edf6fb', '#ddeef7', '#d7ebf5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chatBody}
            >
              {conversation.messages.map((message) => {
                const isUser = message.from === 'user';

                return (
                  <View
                    key={message.id}
                    style={[
                      styles.bubbleRow,
                      isUser && styles.bubbleRowUser,
                    ]}
                  >
                    {!isUser ? (
                      <View style={styles.bubbleAvatarWrap}>
                        <Image
                          source={require('../../assets/paw1.png')}
                          style={styles.bubbleAvatar}
                          resizeMode="contain"
                        />
                      </View>
                    ) : null}

                    <View style={styles.bubbleContent}>
                      <View
                        style={[
                          styles.chatBubble,
                          isUser ? styles.userBubble : styles.doctorBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chatBubbleText,
                            isUser && styles.userBubbleText,
                          ]}
                        >
                          {message.text}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.bubbleTime,
                          isUser && styles.bubbleTimeUser,
                        ]}
                      >
                        {message.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </LinearGradient>

            <View style={styles.aiSuggestionsWrap}>
              {AI_REPLY_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.aiSuggestionChip}
                  onPress={() => setMessageDraft(suggestion)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.aiSuggestionChipText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.composerRow}>
            <TextInput
              value={messageDraft}
              onChangeText={setMessageDraft}
              placeholder="Write a message..."
              placeholderTextColor="#9aaab6"
              style={styles.composerInput}
            />

            <TouchableOpacity style={styles.sendButton} activeOpacity={0.9}>
              <Text style={styles.sendButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerMessageThread;
