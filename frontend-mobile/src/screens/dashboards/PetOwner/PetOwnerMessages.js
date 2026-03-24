import React, { useMemo, useState } from 'react';
import {
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

const CONVERSATIONS = [
  {
    id: 'chat-1',
    doctor: 'Dr. Sarah Dela Cruz',
    role: 'Active 8 mins ago',
    preview: "You're welcome, see you on the follow-up checkup.",
    time: '10:58am',
    unread: 1,
    messages: [
      {
        id: 'm-1',
        from: 'doctor',
        text: 'Good day! How is your dog today?',
        time: '10:43am',
      },
      {
        id: 'm-2',
        from: 'user',
        text: 'Okay naman po, doc.',
        time: '10:43am',
      },
      {
        id: 'm-3',
        from: 'doctor',
        text: 'Please continue the medicine twice a day after meals.',
        time: '10:52am',
      },
      {
        id: 'm-4',
        from: 'user',
        text: 'Noted po. Thank you, doc.',
        time: '10:54am',
      },
      {
        id: 'm-5',
        from: 'doctor',
        text: "You're welcome. See you on the follow-up checkup.",
        time: '10:58am',
      },
    ],
  },
  {
    id: 'chat-2',
    doctor: 'Dr. Michael Cruz',
    role: 'Last seen yesterday',
    preview: 'Please make sure na mapainom po siya ng vitamins after meals.',
    time: '12/13/2025',
    unread: 0,
    messages: [
      {
        id: 'm-6',
        from: 'doctor',
        text: 'Please make sure na mapainom po siya ng vitamins after meals.',
        time: '9:12am',
      },
    ],
  },
];

const PetOwnerMessages = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const [searchText, setSearchText] = useState('');

  const bottomNavItems = [
    {
      key: 'home',
      label: 'Home',
      icon: require('../../assets/Dashboard_Icon.png'),
      route: 'petowner-screen',
      active: false,
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: require('../../assets/Message_Icon.png'),
      route: 'PetOwnerMessages',
      active: true,
    },
    {
      key: 'account',
      label: 'Account',
      icon: require('../../assets/User_Icon.png'),
      route: 'PetOwnerProfile',
      active: false,
    },
  ];

  const filteredConversations = useMemo(
    () =>
      CONVERSATIONS.filter((conversation) =>
        `${conversation.doctor} ${conversation.role} ${conversation.preview}`
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      ),
    [searchText],
  );

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
                style={styles.logoWrap}
                onPress={() => navigation.navigate('petowner-screen', { user: loggedInUser })}
                activeOpacity={0.85}
              >
                <Image
                  source={require('../../assets/paw1.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.brandBlock}>
                <Text style={styles.headerTitle}>PawCruz</Text>
              </View>
            </View>

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
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchCard}>
            <View style={styles.searchInputWrap}>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search Messages"
                placeholderTextColor="#87a0b1"
                style={styles.searchInput}
              />
              <Image
                source={require('../../assets/Message_Icon.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.messagesHeaderCard}>
            <Text style={styles.messagesHeaderTitle}>Messages</Text>
          </View>

          <View style={styles.inboxCard}>
            {filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.messageRow}
                onPress={() =>
                  navigation.navigate('PetOwnerMessageThread', {
                    user: loggedInUser,
                    conversation,
                  })
                }
                activeOpacity={0.9}
              >
                  <View style={styles.messageAvatarWrap}>
                    <Image
                      source={require('../../assets/paw1.png')}
                      style={styles.messageAvatar}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.messageContent}>
                    <View style={styles.messageTopRow}>
                      <Text style={styles.messageDoctorName}>
                        {conversation.doctor}
                      </Text>
                      <Text style={styles.messageTime}>
                        {conversation.time}
                      </Text>
                    </View>

                    <Text numberOfLines={2} style={styles.messagePreview}>
                      {conversation.preview}
                    </Text>
                  </View>
                {conversation.unread ? (
                  <View style={styles.rowUnreadBadge}>
                    <Text style={styles.rowUnreadBadgeText}>{conversation.unread}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inboxOnlyHintCard}>
            <Text style={styles.inboxOnlyHintTitle}>Open a Conversation</Text>
            <Text style={styles.inboxOnlyHintText}>
              Tap Dr. Sarah or another clinic message above to open the full
              conversation on a separate page.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {bottomNavItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, item.active && styles.activeNavItem]}
              onPress={() => navigation.navigate(item.route, { user: loggedInUser })}
              activeOpacity={0.9}
            >
              <View
                style={[styles.navIconWrap, item.active && styles.activeNavIconWrap]}
              >
                <Image
                  source={item.icon}
                  style={[styles.navIcon, item.active && styles.activeNavIcon]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.navLabel, item.active && styles.activeNavLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PetOwnerMessages;
