import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerMessagesDesign';

const PetOwnerMessages = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Messages Bar with Back and Notif buttons */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Messages</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Added Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={require('../../assets/Back_Icon.png')} 
              style={[styles.notifIcon, { marginRight: 15, tintColor: '#fff' }]} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
          {/* Fixed Bell Icon Navigation */}
          <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
             <Image 
               source={require('../../assets/Bell_Icon.png')} 
               style={styles.notifIcon} 
               resizeMode="contain" 
             />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search Messages</Text>
          <Image source={require('../../assets/paw1.png')} style={styles.searchIcon} resizeMode="contain" />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Doctor 1 */}
        <TouchableOpacity style={styles.messageItem}>
          <Image source={require('../../assets/paw1.png')} style={styles.avatar} />
          <View style={styles.messageContent}>
            <Text style={styles.doctorName}>Dr. Sarah Dela Cruz</Text>
            <Text style={styles.messagePreview} numberOfLines={1}>
              Dr. Sarah: You're welcome, see you on the follow-up che...
            </Text>
          </View>
          <Text style={styles.timeText}>10:58am</Text>
        </TouchableOpacity>

        {/* Doctor 2 */}
        <TouchableOpacity style={styles.messageItem}>
          <Image source={require('../../assets/paw1.png')} style={styles.avatar} />
          <View style={styles.messageContent}>
            <Text style={styles.doctorName}>Dr. Michael Cruz</Text>
            <Text style={styles.messagePreview} numberOfLines={1}>
              Dr. Michael: Please make sure na mapainom po sya nung vita...
            </Text>
          </View>
          <Text style={styles.timeText}>12/13/2025</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('petowner-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        {/* Linked Account to Profile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={styles.navIcon} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerMessages;