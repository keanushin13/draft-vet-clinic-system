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

  logoWrap: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerLogo: {
    width: 48,
    height: 48,
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

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    overflow: 'hidden',
  },

  profileIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },

  profileButtonImage: {
    width: '100%',
    height: '100%',
  },

  headerNotificationToast: {
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

  headerNotificationText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: '#173f5c',
  },

  headerNotificationPointer: {
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

  headerBottomRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerBottomRowWrap: {
    overflow: 'hidden',
  },

  ownerSummary: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
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
    textAlign: 'right',
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

  menuTriggerButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTriggerIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },

  headerMenuPanel: {
    marginTop: 14,
    width: '100%',
    padding: 14,
    borderRadius: 28,
    backgroundColor: 'rgba(19, 61, 88, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'stretch',
  },

  headerMenuItem: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  headerMenuItemIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  headerMenuItemIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },

  headerMenuItemLabel: {
    flex: 1,
    fontSize: 14,
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
    maxWidth: '95%',
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

  petListCard: {
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

  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4fbff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  petRowActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  petAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  petAvatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#173f5c',
  },

  petAvatarImage: {
    width: 28,
    height: 28,
    tintColor: '#173f5c',
  },

  petAvatarImageCustom: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    tintColor: undefined,
  },

  petRowContent: {
    flex: 1,
  },

  petRowName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173f5c',
  },

  petRowNameActive: {
    color: '#ffffff',
  },

  petRowBreed: {
    fontSize: 12,
    fontWeight: '700',
    color: '#68869c',
    marginTop: 4,
  },

  petRowBreedActive: {
    color: '#d6eaf7',
  },

  petStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e8f4fb',
    borderWidth: 1,
    borderColor: '#d4e9f6',
  },

  petStatusPillActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.18)',
  },

  petStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#173f5c',
  },

  petStatusTextActive: {
    color: '#ffffff',
  },

  addPetButton: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#b7d9eb',
    backgroundColor: '#eef8ff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },

  addPetPlus: {
    fontSize: 20,
    fontWeight: '900',
    color: '#173f5c',
    marginRight: 8,
  },

  addPetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
  },

  emptyModeCard: {
    backgroundColor: '#eef8ff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d5ebf8',
    marginBottom: 20,
  },

  emptyModeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 6,
  },

  emptyModeText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5f7f94',
    fontWeight: '600',
  },

  detailCard: {
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

  detailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  secondaryActionButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#e8eef3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryActionButtonWide: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#e8eef3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  secondaryActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#49687a',
  },

  primaryActionButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryActionButtonWide: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  editActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  largePetAvatar: {
    width: 82,
    height: 82,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  largePetAvatarText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#173f5c',
  },

  largePetAvatarImage: {
    width: 48,
    height: 48,
    tintColor: '#173f5c',
  },

  largePetAvatarImageCustom: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    tintColor: undefined,
  },

  viewProfileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#173f5c',
  },

  profileBreed: {
    fontSize: 13,
    fontWeight: '700',
    color: '#67869b',
    marginTop: 4,
  },

  referenceCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5f7f94',
    marginTop: 8,
  },

  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  profileInfoItem: {
    width: '48%',
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  profileInfoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  profileInfoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  innerSectionCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3f2fb',
    marginTop: 12,
  },

  recordCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 10,
  },

  recordCardSectionSpacing: {
    marginTop: 10,
  },

  recordListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  recordBullet: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#2c7fb8',
    marginTop: 6,
    marginRight: 10,
  },

  recordItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#5f7f94',
    fontWeight: '600',
  },

  emptyRecordText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#7a95a7',
    fontWeight: '600',
  },

  visitTimelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  visitTimelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#173f5c',
    marginTop: 5,
    marginRight: 12,
  },

  visitTimelineContent: {
    flex: 1,
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  visitTimelineText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#173f5c',
    fontWeight: '700',
  },

  editPhotoSection: {
    alignItems: 'center',
    marginBottom: 18,
  },

  photoPickerLabel: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '800',
    color: '#173f5c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  photoSourceRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
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

  readOnlyField: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#edf5fa',
    borderWidth: 1,
    borderColor: '#dae8f0',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  readOnlyFieldText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#49687a',
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

  birthdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  birthdayPickerWrap: {
    width: '44%',
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  birthdayPickerWrapSmall: {
    width: '26%',
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  birthdayPicker: {
    color: '#173f5c',
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

  modalSingleButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  modalSingleButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  bottomNav: {
    position: 'absolute',
    right: 18,
    bottom: 16,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#173f5c',
    borderWidth: 2,
    borderColor: '#8fc7e8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
    width: '100%',
    height: '100%',
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeNavItem: {
    backgroundColor: 'transparent',
  },

  navIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#eaf6ff',
    borderWidth: 1,
    borderColor: '#c8e4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeNavIconWrap: {
    backgroundColor: '#eaf6ff',
  },

  navIcon: {
    width: 24,
    height: 24,
    tintColor: '#173f5c',
  },

  activeNavIcon: {
    tintColor: '#173f5c',
  },

  navLabel: {
    display: 'none',
  },

  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
