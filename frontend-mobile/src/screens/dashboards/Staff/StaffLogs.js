import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffLogsDesign';

const StaffLogs = ({ navigation, route }) => {
  const loggedInUser = route?.params?.user;
  const logs = [
    { id: '1', action: 'Updated Inventory: Bravecto', user: 'Staff: Aldwin', time: 'Feb 08, 2026 | 09:30 AM' },
    { id: '2', action: 'Approved Appointment: Buddy', user: 'Staff: Maria', time: 'Feb 08, 2026 | 08:45 AM' },
    { id: '3', action: 'Added New Pet: Luna', user: 'Staff: Aldwin', time: 'Feb 07, 2026 | 04:20 PM' },
    { id: '4', action: 'Processed Payment: P1000', user: 'Staff: Maria', time: 'Feb 07, 2026 | 02:15 PM' },
    { id: '5', action: 'System Login', user: 'Staff: Aldwin', time: 'Feb 07, 2026 | 08:00 AM' },
    { id: '6', action: 'Modified Schedule', user: 'Admin', time: 'Feb 06, 2026 | 05:00 PM' },
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
        <Text style={styles.titleText}>System Logs</Text>
        {/* Linked to StaffNotif */}
        <TouchableOpacity onPress={() => navigation.navigate('StaffNotif', { user: loggedInUser })}>
          <Image source={require('../../assets/Bell_Icon.png')} style={styles.bellIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search activity logs...</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {logs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logIndicator} />
            <View style={styles.logContent}>
              {/* Corrected style reference here */}
              <Text style={styles.logAction}>{log.action}</Text>
              <Text style={styles.logUser}>{log.user}</Text>
              <Text style={styles.logTime}>{log.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('staff-screen', { user: loggedInUser })}
        >
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('StaffMessages', { user: loggedInUser })}
        >
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('StaffProfile', { user: loggedInUser })}
        >
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffLogs;
