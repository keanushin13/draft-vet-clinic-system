import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/VetAppointmentDesign';

const VetAppointment = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('12');

  const days = [
    { day: 'Mon', date: '09' },
    { day: 'Tue', date: '10' },
    { day: 'Wed', date: '11' },
    { day: 'Thu', date: '12' },
    { day: 'Fri', date: '13' },
    { day: 'Sat', date: '14' },
  ];

  const appointments = [
    { id: '1', time: '09:00 AM', petName: 'Buddy', owner: 'John Doe', type: 'Check-up' },
    { id: '2', time: '10:30 AM', petName: 'Luna', owner: 'Jane Smith', type: 'Vaccination' },
    { id: '3', time: '02:00 PM', petName: 'Max', owner: 'Mike Ross', type: 'Surgery' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.topHeader}>
        <Image 
          source={require('../../assets/paw1.png')} 
          style={{ width: 30, height: 30, marginRight: 10, tintColor: '#fff' }} 
          resizeMode="contain" 
        />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Sub-header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>Appointments</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VetNotif')}>
           <Image 
             source={require('../../assets/Bell_Icon.png')} 
             style={{ width: 22, height: 22, tintColor: '#fff' }} 
           />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#E8F6F8' }} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Custom Date Scroller */}
        <View style={styles.dateSelectorContainer}>
          <Text style={styles.monthText}>February 2026</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((item) => (
              <TouchableOpacity 
                key={item.date} 
                onPress={() => setSelectedDay(item.date)}
                style={[
                  styles.dateCard, 
                  selectedDay === item.date && styles.selectedDateCard
                ]}
              >
                <Text style={[styles.dayLabel, selectedDay === item.date && styles.selectedText]}>{item.day}</Text>
                <Text style={[styles.dateLabel, selectedDay === item.date && styles.selectedText]}>{item.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Appointment List */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        {appointments.map((item) => (
          <View key={item.id} style={styles.appointmentCard}>
            <View>
              <Text style={styles.timeText}>{item.time}</Text>
              <Text style={styles.petNameText}>{item.petName}</Text>
              <Text style={styles.ownerText}>Owner: {item.owner}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav - Icons & Labels set to Black */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('vet-screen')}>
          <Image 
            source={require('../../assets/Dashboard_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} 
            resizeMode="contain"
          />
          <Text style={[styles.navLabel, {color: '#000'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetMessages')}>
          <Image 
            source={require('../../assets/Message_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} 
            resizeMode="contain"
          />
          <Text style={[styles.navLabel, {color: '#000'}]}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VetProfile')}>
          <Image 
            source={require('../../assets/User_Icon.png')} 
            style={[styles.navIcon, {tintColor: '#000'}]} 
            resizeMode="contain"
          />
          <Text style={[styles.navLabel, {color: '#000'}]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VetAppointment;