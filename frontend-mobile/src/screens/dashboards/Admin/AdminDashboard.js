import { LinearGradient } from 'expo-linear-gradient';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/AdminDashboardDesign';

const AdminDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header - No tint, original colors */}
      <View style={styles.topHeader}>
        <Image 
          source={require('../../assets/paw1.png')} 
          style={styles.headerLogo} 
          resizeMode="contain" 
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* 2. Welcome Bar - Bell Icon in Black */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Welcome, Admin</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminNotif')}>
          <Image 
            source={require('../../assets/Bell_Icon.png')} 
            style={[styles.bellIcon, { tintColor: '#000000' }]} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>

      {/* 3. Body */}
      <LinearGradient colors={['#eef9fb', '#dcf1f4']} style={styles.body}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AdminUserManagement')}
        >
          <View style={styles.iconContainer}>
            {/* Using UserManagement_Icon.png with black tint */}
            <Image 
              source={require('../../assets/UserManagement_Icon.png')} 
              style={[styles.menuIcon, { tintColor: '#000000' }]} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.menuLabel}>User{"\n"}Management</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* 4. Bottom Nav */}
      <View style={styles.bottomNav}>
        {/* Home - Original color (No tint) */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('admin-screen')}>
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={styles.navIcon} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#2c4760'}]}>Home</Text>
        </TouchableOpacity>
        
        {/* Messages - Force Black */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminMessages')}>
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Messages</Text>
        </TouchableOpacity>

        {/* Account - Force Black */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminProfile')}>
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
            resizeMode="contain" 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;