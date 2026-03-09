import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
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
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
    marginRight: 15,
  },
  notifIcon: {
    width: 25,
    height: 25,
    tintColor: '#2c4760',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  userBasicInfo: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  detailContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: '#999',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 50,
  },
  editButton: {
    backgroundColor: '#72a0ad',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#b22222', // Red for logout
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
  container: { flex: 1, padding: 20 },
  logoutButton: { padding: 15, backgroundColor: "#2c7be5", borderRadius: 10 },
  logoutText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  confirmBtn: { backgroundColor: "#ff4d4d", padding: 10, borderRadius: 10, marginBottom: 10, width: "80%", alignItems: "center" },
  cancelBtn: { backgroundColor: "#ccc", padding: 10, borderRadius: 10, width: "80%", alignItems: "center" },

});