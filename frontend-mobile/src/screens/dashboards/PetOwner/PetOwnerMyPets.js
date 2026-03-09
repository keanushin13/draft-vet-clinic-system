import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/PetOwnerMyPetsDesign';

const PetOwnerMyPets = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar with Back and Notification Buttons */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>My Pets</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
                source={require('../../assets/Back_Icon.png')} 
                style={[styles.notifIcon, { marginRight: 15, tintColor: '#fff' }]} 
                resizeMode="contain" 
            />
          </TouchableOpacity>
          {/* Notification Button */}
          <TouchableOpacity onPress={() => navigation.navigate('PetOwnerNotif')}>
             <Image source={require('../../assets/Bell_Icon.png')} style={styles.notifIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image source={require('../../assets/paw1.png')} style={styles.menuIcon} resizeMode="contain" />
          <Text style={styles.searchInput}>Search pets</Text>
          <Image source={require('../../assets/paw1.png')} style={styles.searchIcon} resizeMode="contain" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {/* Pet Card 1: Bella */}
        <View style={styles.petCard}>
          <Image source={require('../../assets/paw1.png')} style={styles.petImage} />
          <Text style={styles.petName}>Name: Bella</Text>
          <Text style={styles.petDetail}>Pet Reference Code:</Text>
          <Text style={styles.petDetail}>Pet_ID091023</Text>
          <Text style={styles.petDetail}>Breed: Golden Retriever</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.btnText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Card 2: Max */}
        <View style={styles.petCard}>
          <Image source={require('../../assets/paw1.png')} style={styles.petImage} />
          <Text style={styles.petName}>Name: Max</Text>
          <Text style={styles.petDetail}>Pet Reference Code:</Text>
          <Text style={styles.petDetail}>Pet_ID953678</Text>
          <Text style={styles.petDetail}>Breed: Garfield</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.btnText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Add Pet Card */}
        <View style={styles.addPetCard}>
          <TouchableOpacity style={styles.addPetBtn}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.btnText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('petowner-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PetOwnerMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('PetOwnerProfile')}
        >
          <Image source={require('../../assets/User_Icon.png')} style={styles.navIcon} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PetOwnerMyPets;