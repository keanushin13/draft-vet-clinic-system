import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetMessagesDesign';

const VetMessages = ({ navigation }) => {
  // Sample Chat Data
  const chats = [
    {
      id: '1',
      ownerName: 'John Doe',
      petName: 'Buddy',
      lastMessage: 'Is the prescription ready for pick up?',
      time: '09:45 AM',
      unreadCount: 2,
    },
    {
      id: '2',
      ownerName: 'Jane Smith',
      petName: 'Luna',
      lastMessage: 'Thank you for the check-up yesterday!',
      time: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '3',
      ownerName: 'Mike Ross',
      petName: 'Max',
      lastMessage: 'When is the next vaccination due?',
      time: 'Saturday',
      unreadCount: 0,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Blue Brand Header */}
      <View style={styles.topHeader}>
        <Image 
          source={require('../../assets/paw1.png')} 
          style={{ width: 30, height: 30, marginRight: 10, tintColor: '#fff' }} 
          resizeMode="contain" 
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Teal Messages Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
           <Image 
             source={require('../../assets/Bell_Icon.png')} 
             style={{ width: 22, height: 22, tintColor: '#fff' }} 
           />
        </TouchableOpacity>
      </View>

      {/* Main Messaging Area */}
      <ScrollView style={{ flex: 1, backgroundColor: '#E8F6F8' }}>
        <View style={{ paddingVertical: 10 }}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <TouchableOpacity key={chat.id} style={styles.chatCard}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{chat.ownerName.charAt(0)}</Text>
                </View>
                
                <View style={styles.chatDetails}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.ownerName}>{chat.ownerName}</Text>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                  </View>
                  
                  <Text style={styles.petNameTag}>Pet: {chat.petName}</Text>
                  
                  <View style={styles.messageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    {chat.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Text style={{ color: '#5ba1a6', fontSize: 16 }}>No active conversations</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation - Icons & Labels set to Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('vet-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetProfile')}>
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetMessages;