import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffNotifDesign';

const StaffNotif = ({ navigation }) => {
  const notifications = [
    {
      id: '1',
      title: 'New Appointment',
      message: 'Maria Santos requested a Vet Visit for Buddy.',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Inventory Alert',
      message: 'Anti-rabies vaccine is running low (5 units left).',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'John Reyes paid P 800 for Wellness Check.',
      time: '3 hours ago',
      unread: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Notifications</Text>
        {/* Back Button functionality restored */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/Back_Icon.png')} style={[styles.topIcon, {tintColor: '#fff'}]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notifCard, notif.unread && styles.unreadCard]}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Image source={require('../../assets/paw1.png')} style={{width: 25, height: 25}} resizeMode="contain" />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifMessage}>{notif.message}</Text>
              <Text style={styles.timeText}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        {/* Account - Points to StaffProfile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffNotif;