import React, { useState } from 'react';
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

const AI_REPLY_SUGGESTIONS = [
  'Okay naman po, doc.',
  'Noted po. Thank you, doc.',
  'Can we schedule the follow-up checkup now?',
];

const PetOwnerMessageThread = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const conversation = route?.params?.conversation;
  const [messageDraft, setMessageDraft] = useState('');
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

  if (!conversation) {
    return (
      <SafeAreaView style={styles.threadFallbackContainer}>
        <Text style={styles.threadFallbackText}>Conversation not found.</Text>
      </SafeAreaView>
    );
  }

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

export default PetOwnerMessageThread;
