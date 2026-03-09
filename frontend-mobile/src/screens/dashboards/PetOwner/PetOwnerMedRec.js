import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/PetOwnerMedRecDesign';

const PetOwnerMedRec = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar with Functional Back and Notification Buttons */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Medical Records</Text>
        <View style={styles.headerIcons}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/Back_Icon.png')} style={styles.topIcon} resizeMode="contain" />
          </TouchableOpacity>
          {/* Notification Button - Now Clickable */}
          <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
            <Image 
              source={require('../../assets/Bell_Icon.png')} 
              style={[styles.topIcon, {tintColor: '#2c4760'}]} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.mainCard}>
          <View style={styles.petHeader}>
            <Image source={require('../../assets/paw1.png')} style={styles.petImage} />
            <View>
              <Text style={styles.petInfo}>Name: Bella</Text>
              <Text style={styles.petInfo}>ID: Pet_ID091023 | Male | 4 Years Old</Text>
            </View>
          </View>

          {/* Pet Summary */}
          <View style={styles.recordSection}>
            <Text style={styles.sectionTitle}>Pet Summary</Text>
            <View style={styles.row}><Text style={styles.rowLabel}>Breed:</Text><Text style={styles.rowValue}>Golden Retriever</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Weight:</Text><Text style={styles.rowValue}>25kgs</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Microchip ID:</Text><Text style={styles.rowValue}>33054379</Text></View>
          </View>

          {/* Vaccination Records */}
          <View style={styles.recordSection}>
            <Text style={styles.sectionTitle}>Vaccination Records</Text>
            <View style={styles.row}><Text style={styles.rowLabel}>Rabies:</Text><Text style={styles.rowValue}>Due Feb 15, 2026</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Distemper:</Text><Text style={styles.rowValue}>Due Feb 29, 2026</Text></View>
          </View>

          {/* Medication History */}
          <View style={styles.recordSection}>
            <Text style={styles.sectionTitle}>Medication History</Text>
            <View style={styles.row}><Text style={styles.rowLabel}>Bravecto:</Text><Text style={styles.rowValue}>Flea & Tick</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Amoxicillin:</Text><Text style={styles.rowValue}>1000mg, 2x daily</Text></View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav - Fully Linked */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('petowner-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={styles.navIcon} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerMedRec;