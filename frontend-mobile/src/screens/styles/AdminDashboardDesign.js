import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c4760', 
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2c4760',
  },
  headerLogo: {
    width: 35,
    height: 35,
    marginRight: 10,
    tintColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#5ba1a6', 
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  bellIcon: {
    width: 22,
    height: 22,
    tintColor: '#2c4760',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    alignItems: 'center',
    width: width * 0.25, 
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#2c4760',
  },
  menuLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: '#888',
  },
  navLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});