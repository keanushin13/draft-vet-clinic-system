import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetPatientsDesign';

const VetPatients = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const patients = [
    { id: '1', name: 'Buddy', breed: 'Golden Retriever', owner: 'John Doe', lastVisit: 'Feb 05, 2026', status: 'Healthy' },
    { id: '2', name: 'Luna', breed: 'Siamese Cat', owner: 'Jane Smith', lastVisit: 'Jan 20, 2026', status: 'Follow-up' },
    { id: '3', name: 'Max', breed: 'Beagle', owner: 'Mike Ross', lastVisit: 'Feb 01, 2026', status: 'Under Treatment' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Dark Blue Brand Header */}
      <View style={styles.topHeader}>
        <Image 
          source={require('../../assets/paw1.png')} 
          style={{ width: 30, height: 30, marginRight: 10, tintColor: '#fff' }} 
          resizeMode="contain" 
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Teal Patients Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Patient Records</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
           <Image 
             source={require('../../assets/Bell_Icon.png')} 
             style={{ width: 22, height: 22, tintColor: '#fff' }} 
           />
        </TouchableOpacity>
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchSection}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search pet or owner name..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Main Content Area */}
      <ScrollView style={{ flex: 1, backgroundColor: '#E8F6F8' }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <TouchableOpacity 
                key={patient.id} 
                style={styles.patientCard}
                onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id })}
              >
                <View style={styles.patientInfo}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientBreed}>{patient.breed}</Text>
                    <Text style={styles.ownerName}>Owner: {patient.owner}</Text>
                  </View>
                </View>
                
                <View style={styles.statusSection}>
                  <Text style={styles.lastVisitText}>Last: {patient.lastVisit}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: patient.status === 'Healthy' ? '#d4edda' : '#fff3cd' }]}>
                    <Text style={styles.statusBadgeText}>{patient.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#5ba1a6', fontSize: 16, marginTop: 50 }}>
                No patient records found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation - Icons & Labels now Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('vet-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetProfile')}>
          <Image source={require('../../assets/Profile.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={[styles.navLabel, {color: '#000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetPatients;