import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffUserManagementDesign';

const StaffUserManagement = ({ navigation }) => {
  const users = [
    { id: '1', name: 'Maria Santos', uid: 'USR-000076', email: 'maria@exmple.com', role: 'Pet Owner' },
    { id: '2', name: 'John Reyes', uid: 'USR-000074', email: 'john@example.com', role: 'Staff' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Blue Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar with Clickable Bell */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>User Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
          <Image 
            source={require('../../assets/Bell_Icon.png')} 
            style={styles.bellIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <View style={styles.userCountContainer}>
          <Text style={styles.userCountLabel}>All Users</Text>
          <View style={styles.userCountBadge}><Text style={styles.userCountText}>76</Text></View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={{color: '#999'}}>🔍 Search users</Text>
        </View>
        <View style={styles.roleFilter}>
          <Text style={{fontSize: 12, color: '#666'}}>Role: All</Text>
          <Text style={{fontSize: 12, color: '#666'}}>▼</Text>
        </View>
      </View>

      {/* User List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userMainInfo}>
              <View style={[styles.avatar, { backgroundColor: '#5da0a8', justifyContent: 'center', alignItems: 'center', borderRadius: 25 }]}>
                 <Text style={{color: '#fff', fontWeight: 'bold'}}>{user.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userIdEmail}>{user.uid}  |  {user.email}</Text>
                <View style={styles.roleTagContainer}>
                  <Text style={styles.roleLabel}>ROLE</Text>
                  <Text style={styles.roleValue}>👤 {user.role}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtnLarge}>
                <Text style={{color: '#72a0a6', fontWeight: 'bold'}}>📝 Edit</Text>
              </TouchableOpacity>
              <View style={styles.smallActions}>
                <TouchableOpacity style={styles.btnEditSmall}><Text style={styles.btnText}>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnDelete}><Text style={styles.btnText}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation - Black Icons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffUserManagement;