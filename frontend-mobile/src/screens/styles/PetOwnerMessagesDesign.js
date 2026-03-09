import { StyleSheet } from 'react-native';

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
  titleBar: {
    backgroundColor: '#5ba1a6', 
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  notifIcon: {
    width: 25,
    height: 25,
    tintColor: '#2c4760',
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    elevation: 2,
  },
  searchPlaceholder: {
    color: '#888',
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#444',
  },
  messageItem: {
    backgroundColor: '#e8eaed', // Grey background for message row
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#fff',
  },
  messageContent: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messagePreview: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#888',
    position: 'absolute',
    right: 15,
    top: 15,
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
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  }
});