import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef9fb' },
  topHeader: { backgroundColor: '#2c4760', flexDirection: 'row', alignItems: 'center', padding: 15 },
  headerLogo: { width: 30, height: 30, marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  welcomeBar: { backgroundColor: '#5ba1a6', flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  welcomeText: { color: '#fff', fontSize: 20, fontWeight: '500' },
  bellIcon: { width: 20, height: 20, tintColor: '#fff' },
  searchBox: { backgroundColor: '#fff', margin: 15, borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#ddd' },
  searchInput: { flex: 1, fontSize: 16 },
  messageRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  textContainer: { flex: 1, marginLeft: 15 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  timeText: { fontSize: 12, color: '#999' },
  msgText: { fontSize: 14, color: '#666', marginTop: 4 },
  bottomNav: { flexDirection: 'row', height: 70, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navIcon: { width: 24, height: 24 },
  navLabel: { fontSize: 12, color: '#666', marginTop: 4 }
});