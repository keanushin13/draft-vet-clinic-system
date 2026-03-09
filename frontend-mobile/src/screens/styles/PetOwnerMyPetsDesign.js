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
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#888',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#444',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  petCard: {
    backgroundColor: '#fff',
    width: width * 0.44,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  petName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
  },
  petDetail: {
    fontSize: 11,
    color: '#444',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  viewAllBtn: {
    backgroundColor: '#72a0ad',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  addPetCard: {
    backgroundColor: '#f8faff',
    width: width * 0.44,
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addPetBtn: {
    backgroundColor: '#72a0ad',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  plusIcon: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: 'bold',
    marginRight: 5,
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
  },
});