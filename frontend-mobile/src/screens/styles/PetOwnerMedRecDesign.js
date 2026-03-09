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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    width: 25,
    height: 25,
    marginLeft: 15,
    tintColor: '#fff',
  },
  mainCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 20,
    padding: 15,
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  petInfo: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  recordSection: {
    backgroundColor: '#e8eaed', // Grey background for sections
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  rowLabel: {
    fontSize: 12,
    color: '#444',
  },
  rowValue: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
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