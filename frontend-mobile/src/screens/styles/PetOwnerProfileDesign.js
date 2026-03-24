import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 120,
  },

  headerBar: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
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
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backIcon: {
    width: 18,
    height: 18,
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
    fontWeight: '700',
    color: '#c3ddee',
    marginTop: 3,
  },

  notifButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notifBadge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#f47c6b',
    borderWidth: 2,
    borderColor: '#245f8e',
  },

  notifIcon: {
    width: 21,
    height: 21,
    tintColor: '#ffffff',
  },

  notificationToast: {
    position: 'absolute',
    top: 72,
    right: 22,
    width: 210,
    backgroundColor: '#f8fcff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dceef8',
    ...Platform.select({
      ios: {
        shadowColor: '#0f2d45',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  notificationPointer: {
    position: 'absolute',
    top: -8,
    right: 16,
    width: 16,
    height: 16,
    backgroundColor: '#f8fcff',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: '#dceef8',
    transform: [{ rotate: '45deg' }],
  },

  notificationToastTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 4,
  },

  notificationToastText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5d7b91',
    fontWeight: '600',
  },

  headerBottomRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ownerSummary: {
    flex: 1,
  },

  headerCaption: {
    fontSize: 12,
    color: '#b8d4e5',
    fontWeight: '700',
  },

  ownerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },

  ownerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    marginLeft: 12,
  },

  ownerBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#5b84a3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  heroEyebrow: {
    color: '#dbeaf5',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 32,
  },

  heroDescription: {
    color: '#edf7fc',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '96%',
    fontWeight: '500',
  },

  sectionHeaderWrap: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7fd3ff',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#d5ecf8',
    marginTop: 3,
    fontWeight: '600',
  },

  profileCard: {
    backgroundColor: '#fcfeff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#edf7fd',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#b7e6ff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: '#d9ecf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatar: {
    width: 48,
    height: 48,
    tintColor: '#173f5c',
  },

  avatarCustom: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },

  profileTopContent: {
    flex: 1,
  },

  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#173f5c',
  },

  profileMeta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#68869c',
    marginTop: 5,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  infoItem: {
    width: '48%',
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  formCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3f2fb',
  },

  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6a8aa0',
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  inputField: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#173f5c',
  },

  photoSourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 10,
  },

  photoSourceButton: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#f4fbff',
    paddingVertical: 14,
    alignItems: 'center',
  },

  photoSourceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#173f5c',
  },

  actionCard: {
    backgroundColor: '#fcfeff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#edf7fd',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#b7e6ff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: {
        elevation: 7,
      },
    }),
  },

  editButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },

  cancelEditButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#e7edf2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelEditButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4f6a7b',
  },

  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#fff1f1',
    borderWidth: 1,
    borderColor: '#ffd7d7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#c24a4a',
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

  activeNavItem: {
    backgroundColor: '#173f5c',
  },

  navIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#edf6fb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeNavIconWrap: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  navIcon: {
    width: 21,
    height: 21,
    tintColor: '#6b8798',
  },

  activeNavIcon: {
    tintColor: '#ffffff',
  },

  navLabel: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '800',
    color: '#6b8798',
  },

  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '800',
  },

  confirmBtn: {
    backgroundColor: '#cf5353',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },

  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },

  cancelBtn: {
    backgroundColor: '#e7edf2',
    paddingVertical: 12,
    borderRadius: 14,
    width: '80%',
    alignItems: 'center',
  },

  cancelBtnText: {
    color: '#4f6a7b',
    fontWeight: '800',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 18, 28, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#f8fcff',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: '#dbeef8',
    ...Platform.select({
      ios: {
        shadowColor: '#0f2d45',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: '#5d7b91',
    fontWeight: '600',
    textAlign: 'center',
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  modalSecondaryButton: {
    width: '48%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#eaf1f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalSecondaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4f6a7b',
  },

  modalPrimaryButton: {
    width: '48%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalPrimaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});
