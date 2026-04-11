import { useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/AdminMessagesDesign';

const AdminMessages = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const messages = [
    { id: '1', name: 'Reizzan Ewan', lastMsg: "You: You're welcome! ðŸ¾", time: '12/13/2025', avatar: require('../../assets/Profile.png') },
    { id: '2', name: 'Dr. Sarah Dela Cruz', lastMsg: "Dr. Sarah: You're welcome, see you on the follow-up che...", time: '10:58am', avatar: require('../../assets/Profile.png') },
    { id: '3', name: 'Dr. Michael Cruz', lastMsg: 'Dr. Michael: Please make sure na mapainom po sya nung vita....', time: '12/13/2025', avatar: require('../../assets/Profile.png') },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageRow}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.rowHeader}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.msgText} numberOfLines={1}>{item.lastMsg}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Brand Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* 2. Messages Title Bar - BELL IS NOW CLICKABLE */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminNotif')}>
          <Image 
            source={require('../../assets/Bell_Icon.png')} 
            style={[styles.bellIcon, { tintColor: '#000000' }]} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>

      {/* 3. Search Bar */}
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Search Messages" 
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.searchIcon}>ðŸ”</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {/* 4. Bottom Nav - Consistent High-Visibility Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('admin-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000000'}]} />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#2c4760'}]} />
          <Text style={[styles.navLabel, {color: '#2c4760'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminProfile')}>
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, {tintColor: '#000000'}]} />
          <Text style={[styles.navLabel, {color: '#000000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminMessages;