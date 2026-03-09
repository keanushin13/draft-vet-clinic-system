import { useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/AdminUserManagementDesign';

const AdminUserManagement = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const users = [
    { id: '1', name: 'Maria Santos', uid: 'USR-000076', email: 'maria@example.com', role: 'Pet Owner', avatar: require('../../assets/User_Icon.png') },
    { id: '2', name: 'John Reyes', uid: 'USR-000074', email: 'john@example.com', role: 'Staff', avatar: require('../../assets/User_Icon.png') },
  ];

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.cardMain}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userDetail}>{item.uid}  |  {item.email}</Text>
          <View style={styles.roleContainer}>
            <View style={styles.roleLabel}><Text style={styles.roleLabelText}>ROLE</Text></View>
            <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>👤 {item.role}</Text></View>
          </View>
        </View>
      </View>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.miniBtn}><Text style={styles.miniBtnText}>☑ Edit</Text></TouchableOpacity>
        <div style={styles.rightActions}>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#6a9ab0'}]}><Text style={styles.actionBtnText}>🖊 Edit</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#b36a6a'}]}><Text style={styles.actionBtnText}>🗑 Delete</Text></TouchableOpacity>
        </div>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Sub Header - BELL NOW FUNCTIONAL */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>User Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminNotif')}>
          <Image 
            source={require('../../assets/Bell_Icon.png')} 
            style={[styles.bellIcon, { tintColor: '#000000' }]} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Filters Row */}
        <View style={styles.filterRow}>
          <View style={styles.userCount}><Text style={styles.userCountText}>All Users  <Text style={styles.countBadge}>76</Text></Text></View>
          <TouchableOpacity style={styles.addUserBtn}><Text style={styles.addUserBtnText}>Add User</Text></TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={{marginRight: 8}}>🔍</Text>
          <TextInput placeholder="Search users" style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>

        {/* Role Dropdown Mock */}
        <TouchableOpacity style={styles.roleFilter}>
          <Text>🛡 Role: All</Text>
          <Text>▼</Text>
        </TouchableOpacity>

        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('admin-screen')}>
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminMessages')}>
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000000'}]} 
          />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminProfile')}>
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#2c4760'}]} 
          />
          <Text style={[styles.navLabel, {color: '#2c4760'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminUserManagement;