import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetMedRecDesign';

const VetMedRec = ({ navigation }) => {
  // Sample Medical Record Data
  const medicalRecords = [
    {
      id: '1',
      date: 'Feb 05, 2026',
      petName: 'Buddy',
      owner: 'John Doe',
      diagnosis: 'Seasonal Allergies',
      treatment: 'Antihistamines prescribed',
      status: 'Closed',
    },
    {
      id: '2',
      date: 'Feb 01, 2026',
      petName: 'Luna',
      owner: 'Jane Smith',
      diagnosis: 'Post-Vaccination Follow-up',
      treatment: 'Normal recovery, no fever',
      status: 'Open',
    },
    {
      id: '3',
      date: 'Jan 28, 2026',
      petName: 'Max',
      owner: 'Mike Ross',
      diagnosis: 'Mild Gastritis',
      treatment: 'Special diet for 7 days',
      status: 'Closed',
    },
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

      {/* Teal Medical Records Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Medical Records</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
           <Image 
             source={require('../../assets/Bell_Icon.png')} 
             style={{ width: 22, height: 22, tintColor: '#fff' }} 
           />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={{ flex: 1, backgroundColor: '#E8F6F8' }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ padding: 15 }}>
          {medicalRecords.length > 0 ? (
            medicalRecords.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>{record.date}</Text>
                  <View style={[styles.statusTag, { backgroundColor: record.status === 'Open' ? '#FFF3CD' : '#D1E7DD' }]}>
                    <Text style={styles.statusTagText}>{record.status}</Text>
                  </View>
                </View>

                <View style={styles.petInfoSection}>
                  <Text style={styles.petNameText}>{record.petName}</Text>
                  <Text style={styles.ownerText}>Owner: {record.owner}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Diagnosis:</Text>
                  <Text style={styles.detailValue}>{record.diagnosis}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Treatment:</Text>
                  <Text style={styles.detailValue}>{record.treatment}</Text>
                </View>

                <TouchableOpacity style={styles.viewBtn}>
                  <Text style={styles.viewBtnText}>View Full Report</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Text style={{ color: '#5ba1a6', fontSize: 16 }}>No medical records available.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation - Icons & Labels set to Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('vet-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} />
          <Text style={[styles.navLabel, {color: '#000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetMedRec;