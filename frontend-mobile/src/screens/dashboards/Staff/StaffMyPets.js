import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffMyPetsDesign';

const StaffMyPets = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar with Back and Bell */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Patient Records</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={[styles.topIcon, {tintColor: '#fff', marginRight: 15}]} resizeMode="contain" />
          </TouchableOpacity>
          
          {/* Linked to StaffNotif */}
          <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
            <Image source={require('../../assets/Bell_Icon.png')} style={[styles.topIcon, {tintColor: '#2c4760'}]} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Today</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}><Text style={styles.activeTabText}>Day</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text style={styles.tabText}>Week</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Record Entry 1: Vet Visit */}
        <View style={styles.recordCard}>
          <View style={styles.timeColumn}><Text style={styles.timeText}>10:00AM</Text></View>
          {/* Fixed: Replaced <div> with <View> */}
          <View style={styles.infoColumn}>
            <View style={[styles.cardTypeTag, {backgroundColor: '#f1b44c'}]}>
              <Text style={styles.tagText}>Vet Visit Request</Text>
            </View>
            <View style={styles.petRow}>
              <Image source={require('../../assets/paw1.png')} style={styles.petAvatar} />
              <View>
                <Text style={styles.petName}>Buddy</Text>
                <Text style={styles.petDetails}>PF11244 | Male | 4 yrs</Text>
                <Text style={styles.petDetails}>Owner: Maria Santos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Record Entry 2: Treatment */}
        <View style={styles.recordCard}>
          <View style={styles.timeColumn}><Text style={styles.timeText}>12:00PM</Text></View>
          {/* Fixed: Replaced <div> with <View> */}
          <View style={styles.infoColumn}>
            <View style={[styles.cardTypeTag, {backgroundColor: '#5ba1a6'}]}>
              <Text style={styles.tagText}>Flea & Tick Treatment</Text>
            </View>
            <View style={styles.petRow}>
              <Image source={require('../../assets/paw1.png')} style={styles.petAvatar} />
              <View>
                <Text style={styles.petName}>Luna</Text>
                <Text style={styles.petDetails}>PF12507 | Female</Text>
                <Text style={styles.petDetails}>Owner: Rose Cruz</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        {/* Linked to StaffMessages */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        {/* Linked to StaffProfile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffMyPets;