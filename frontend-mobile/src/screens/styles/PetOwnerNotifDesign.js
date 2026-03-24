import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  headerBar: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#0f2d45',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },

  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },

  brandBlock: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },

  headerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    marginTop: 2,
  },

  headerBadge: {
    minHeight: 42,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ownerSummary: {
    flex: 1,
  },

  headerCaption: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '700',
    marginBottom: 2,
  },

  ownerName: {
    fontSize: 20,
    lineHeight: 26,
    color: '#ffffff',
    fontWeight: '900',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 120,
  },

  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#2b4f6f',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  heroEyebrow: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e7f4ff',
    marginBottom: 6,
  },

  heroTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '600',
  },

  sectionHeaderWrap: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#9fd6ff',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#b9d5e8',
    fontWeight: '600',
  },

  notificationRowWrap: {
    marginBottom: 14,
    position: 'relative',
  },

  deleteBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 116,
    borderRadius: 24,
    backgroundColor: '#cf5544',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  deleteBackgroundText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },

  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fcff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#dceef8',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#7da5bc',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
      },
      android: {
        elevation: 7,
      },
    }),
  },

  notifAccent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 12,
  },

  notifContent: {
    flex: 1,
  },

  notifMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  notifCategory: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5c7a8f',
  },

  priorityPill: {
    minHeight: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  priorityPillText: {
    fontSize: 11,
    fontWeight: '900',
  },

  notifTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 6,
  },

  notifBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#587589',
    fontWeight: '600',
  },

  notifTime: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#86a0b1',
  },

  emptyCard: {
    backgroundColor: '#eef8ff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d7edf9',
    padding: 18,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5d7b91',
    fontWeight: '600',
  },

  bottomNav: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 16,
    height: 86,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#d7e9f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#7da5bc',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  navItem: {
    flex: 1,
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },

  navIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#edf6fb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navIcon: {
    width: 21,
    height: 21,
    tintColor: '#6b8798',
  },

  navLabel: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '800',
    color: '#6b8798',
  },
});
