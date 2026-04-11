import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetNotifDesign';

const VetNotif = ({ navigation }) => {
  const notifications = [
    {
      id: '1',
      title: 'New Appointment',
      description: 'John Doe booked an appointment for Buddy (Golden Retriever) at 09:00 AM.',
      time: '10m ago',
      type: 'appointment',
      isUnread: true,
    },
    {
      id: '2',
      title: 'New Message',
      description: 'Jane Smith sent you a message regarding Luna\'s vaccination.',
      time: '1h ago',
      type: 'message',
      isUnread: true,
    },
    {
      id: '3',
      title: 'System Reminder',
      description: 'Don\'t forget to update your clinic hours for the upcoming holiday.',
      time: '5h ago',
      type: 'system',
      isUnread: false,
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

      {/* Teal Notifications Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Notifications</Text>
        <TouchableOpacity onPress={() => console.log('Mark all as read')}>
           <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#E8F6F8' }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
          
          <Text style={styles.timeDivider}>Today</Text>

          {notifications.map((notif) => (
            <TouchableOpacity key={notif.id} style={[styles.notifCard, notif.isUnread && styles.unreadCard]}>
              <View style={styles.notifIconContainer}>
                {/* Notification Category Icons - Set to Black tint */}
                <View style={[styles.iconCircle, { backgroundColor: notif.type === 'appointment' ? '#5ba1a6' : '#2c4760' }]}>
                   <Image 
                     source={notif.type === 'message' ? require('../../assets/Message_Icon.png') : require('../../assets/Bell_Icon.png')} 
                     style={{ width: 18, height: 18, tintColor: '#000' }} // Icon inside circle now Black
                   />
                </View>
              </View>

              <View style={styles.notifContent}>
                <View style={styles.notifHeaderRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                <Text style={styles.notifDescription} numberOfLines={2}>
                  {notif.description}
                </Text>
              </View>
              
              {notif.isUnread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation - All Icons now Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('vet-screen')}>
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} // Black
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetMessages')}>
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} // Black
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetProfile')}>
          <Image 
            source={require('../../assets/Profile.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} // Black
            resizeMode="contain" 
          />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetNotif;