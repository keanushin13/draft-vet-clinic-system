import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f4f9', 
  },
  topHeader: {
    backgroundColor: '#2c4760', 
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  headerLogo: {
    width: 35,
    height: 35,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    
  },
  appointmentBar: {
    backgroundColor: '#5ba1a6', 
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  notifIcon: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },
  mainCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarPlaceholder: {
    width: '100%',
    height: 220, // Approximate height for the calendar image
    marginBottom: 15,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#72a0ad',
    width: '48%',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  timeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#a9a9a9',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#30699b',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomNav: {
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 15,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 26,
    height: 26,
    marginBottom: 4,
    tintColor: '#000',
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  }
});