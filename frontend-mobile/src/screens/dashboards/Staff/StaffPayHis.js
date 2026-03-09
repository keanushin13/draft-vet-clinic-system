import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffPayHisDesign';

const StaffPayHis = ({ navigation }) => {
  const payments = [
    { id: '1', date: 'Oct 17, 2025', service: 'Vet Visit', amount: 'P 300' },
    { id: '2', date: 'Oct 31, 2025', service: 'Wellness Check & Vaccination', amount: 'P 800' },
    { id: '3', date: 'Nov 16, 2025', service: 'Follow-Up', amount: 'P 150' },
    { id: '4', date: 'Nov 30, 2025', service: 'Tick Vaccination', amount: 'P 250' },
    { id: '5', date: 'Dec 17, 2025', service: 'Deworming', amount: 'P 250' },
    { id: '6', date: 'Jan 11, 2026', service: '5-in-1 vaccination', amount: 'P 1000' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Payment History</Text>
        {/* Linked to StaffNotif */}
        <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
          <Image source={require('../../assets/Bell_Icon.png')} style={styles.bellIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Search payments...</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {payments.map((item) => (
          <View key={item.id} style={styles.paymentCard}>
            <View style={styles.cardTop}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.serviceText}>{item.service}</Text>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
            <View style={styles.cardBottom}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>{item.date}</Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>✓ PAID</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('StaffDashboard')}
        >
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('StaffMessages')}
        >
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        {/* Account - Points to StaffProfile */}
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('StaffProfile')}
        >
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffPayHis;