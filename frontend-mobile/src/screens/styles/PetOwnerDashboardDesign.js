import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9fa',
  },
  topHeader: {
    backgroundColor: '#2c4760',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLogo: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeBar: {
    backgroundColor: '#5da0a8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  notifIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  menuItem: {
    width: width * 0.28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 20, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  menuLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
  },
});