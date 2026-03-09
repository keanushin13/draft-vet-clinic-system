import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  // Medical Record Card Styles
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDate: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444',
  },
  petInfoSection: {
    marginBottom: 10,
  },
  petNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c4760',
  },
  ownerText: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5da0a8',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  viewBtn: {
    marginTop: 10,
    backgroundColor: '#f0f4f7',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#2c4760',
    fontSize: 13,
    fontWeight: 'bold',
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
    fontWeight: '500',
  },
});