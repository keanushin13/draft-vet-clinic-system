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
    paddingVertical: 15,
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
  topIcon: {
    width: 22,
    height: 22,
  },
  scrollContent: {
    padding: 15,
  },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#5ba1a6',
  },
  unreadCard: {
    backgroundColor: '#f0f9fa',
    borderLeftColor: '#f1b44c',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#eef2f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notifMessage: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },
  bottomNav: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navLabel: {
    fontSize: 11,
    color: '#333',
    marginTop: 4,
  },
});