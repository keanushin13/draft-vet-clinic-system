import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Brand Header
  topHeader: {
    backgroundColor: '#2c4760',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  // Notifications Sub-header
  calendarHeader: {
    backgroundColor: '#5da0a8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  calendarHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Divider Text
  timeDivider: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c4760',
    marginBottom: 10,
    marginLeft: 5,
  },
  // Notification Cards
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#5da0a8',
  },
  notifIconContainer: {
    marginRight: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c4760',
  },
  notifTime: {
    fontSize: 11,
    color: '#999',
  },
  notifDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5da0a8',
    position: 'absolute',
    top: 15,
    right: 10,
  },
  // Bottom Navigation
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
    color: '#666',
  },
});