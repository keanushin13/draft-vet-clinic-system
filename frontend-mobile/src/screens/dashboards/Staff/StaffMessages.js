import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffMessagesDesign';

const StaffMessages = ({ navigation }) => {
  const messages = [
    {
      id: '1',
      time: '10:30AM',
      user: 'Maria Santos',
      lastMsg: 'Is the appointment for Buddy confirmed?',
      status: 'Inquiry',
      tagColor: '#f1b44c',
    },
    {
      id: '2',
      time: '12:00PM',
      user: 'Rose Cruz',
      lastMsg: 'Thank you for the treatment today!',
      status: 'Follow-up',
      tagColor: '#5ba1a6',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar with Back and Bell */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Messages</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Back Functionality */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={[styles.topIcon, {tintColor: '#fff', marginRight: 15}]} resizeMode="contain" />
          </TouchableOpacity>
          
          {/* Notification Bell - Linked to StaffNotif */}
          <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
            <Image source={require('../../assets/Bell_Icon.png')} style={[styles.topIcon, {tintColor: '#2c4760'}]} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}><Text style={styles.activeTabText}>All</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Unread</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Archived</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {messages.map((item) => (
          <TouchableOpacity key={item.id} style={styles.recordCard} activeOpacity={0.7}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            
            <View style={styles.infoColumn}>
              <View style={[styles.cardTypeTag, {backgroundColor: item.tagColor}]}>
                <Text style={styles.tagText}>{item.status}</Text>
              </View>
              <View style={styles.petRow}>
                <Image source={require('../../assets/paw1.png')} style={styles.petAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.petName}>{item.user}</Text>
                  <Text style={styles.petDetails} numberOfLines={1}>{item.lastMsg}</Text>
                </View>
              </View>
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
        
        {/* Messages (Active State) */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#5ba1a6'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#5ba1a6'}]}>Messages</Text>
        </TouchableOpacity>

        {/* Account - Linked to StaffProfile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffMessages;