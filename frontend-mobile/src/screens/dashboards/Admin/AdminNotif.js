import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/AdminNotifDesign';

const AdminNotif = ({ navigation }) => {
  // Sample notification data
  const notifications = [
    { 
      id: '1', 
      title: 'New User Registered', 
      description: 'A new Staff member (John Doe) has been added to the system.', 
      time: '2 mins ago', 
      unread: true 
    },
    { 
      id: '2', 
      title: 'System Update', 
      description: 'Server maintenance completed successfully at 12:00 AM.', 
      time: '5 hours ago', 
      unread: false 
    },
  ];

  const renderNotif = ({ item }) => (
    <View style={[styles.notifCard, item.unread && styles.unreadCard]}>
      <View style={styles.notifIconContainer}>
        <Image 
          source={require('../../assets/Bell_Icon.png')} 
          style={[styles.notifTypeIcon, { tintColor: item.unread ? '#5ba1a6' : '#999' }]} 
        />
      </View>
      <View style={styles.notifTextContent}>
        <View style={styles.notifHeaderRow}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
        <Text style={styles.notifDescription}>{item.description}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* 2. Sub Header */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Notification List */}
      <FlatList
        data={notifications}
        renderItem={renderNotif}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No new notifications.</Text>
          </View>
        }
      />

      {/* 4. Bottom Nav - Consistent Black Icons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('admin-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, { tintColor: '#000000' }]} />
          <Text style={[styles.navLabel, { color: '#000000' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, { tintColor: '#000000' }]} />
          <Text style={[styles.navLabel, { color: '#000000' }]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminProfile')}>
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, { tintColor: '#2c4760' }]} />
          <Text style={[styles.navLabel, { color: '#2c4760' }]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminNotif;