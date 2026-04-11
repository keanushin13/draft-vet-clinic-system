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

  headerBottomRowWrap: {
    overflow: 'hidden',
  },

  flowHeaderTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
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

  bookingCard: {
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

  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 10,
    marginTop: 4,
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  reasonCard: {
    width: '48%',
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    justifyContent: 'center',
  },

  reasonCardActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  reasonCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#173f5c',
  },

  reasonCardTitleActive: {
    color: '#ffffff',
  },

  reasonCardDescription: {
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '700',
    color: '#5f7f94',
  },

  reasonCardDescriptionActive: {
    color: '#d8ebf7',
  },

  reasonDetailCard: {
    backgroundColor: '#f4fbff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },

  reasonDetailLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 6,
  },

  reasonHelperText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: '#5f7f94',
    marginBottom: 12,
  },

  reasonSelectButton: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  reasonSelectValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  reasonSelectValuePlaceholder: {
    color: '#87a0b1',
  },

  reasonSelectChevron: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '900',
    color: '#5f7f94',
    textTransform: 'uppercase',
  },

  reasonSelectButtonDisabled: {
    backgroundColor: '#edf4f8',
    borderColor: '#dbe8f0',
  },

  reasonTextInput: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#173f5c',
    marginTop: 12,
  },

  reasonSummaryBox: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
  },

  reasonSummaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  reasonSummaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  flowStepBadge: {
    alignSelf: 'flex-start',
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e7f5ff',
    borderWidth: 1,
    borderColor: '#cae7f7',
    marginBottom: 16,
  },

  flowStepBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#173f5c',
    textAlign: 'center',
  },

  flowSummaryCard: {
    borderRadius: 20,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d5ebf8',
    padding: 16,
    marginBottom: 14,
  },

  flowSummaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  flowSummaryValue: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 12,
  },

  flowSummaryButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    borderRadius: 14,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  flowSummaryButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },

  petChip: {
    width: '48%',
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  petChipActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  petChipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 4,
  },

  petChipTitleActive: {
    color: '#ffffff',
  },

  petChipSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b7b90',
  },

  petChipSubtitleActive: {
    color: '#d8ebf7',
  },

  addPetChip: {
    width: '48%',
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: '#eef8ff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#b7d9eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  addPetChipPlus: {
    fontSize: 20,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 4,
  },

  addPetChipTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 3,
  },

  addPetChipSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5f7f94',
  },

  visitDateFieldCard: {
    backgroundColor: '#eff8ff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cfe6f5',
    padding: 14,
    marginBottom: 8,
  },

  visitDateInfoText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: '#5f7f94',
    marginBottom: 12,
  },

  visitCalendarTriggerButton: {
    minHeight: 64,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  visitCalendarTriggerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  visitCalendarTriggerValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173f5c',
  },

  visitCalendarTriggerValuePlaceholder: {
    color: '#87a0b1',
  },

  visitCalendarTriggerIconImage: {
    width: 26,
    height: 26,
    tintColor: '#173f5c',
  },

  optionChip: {
    width: '48%',
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  optionChipActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  optionChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#214866',
    textAlign: 'center',
  },

  optionChipTextActive: {
    color: '#ffffff',
  },

  rescheduleBanner: {
    backgroundColor: '#e8f4ff',
    borderWidth: 1,
    borderColor: '#cfe6f8',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  rescheduleBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 4,
  },

  rescheduleBannerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5b7b90',
    fontWeight: '600',
  },

  calendarSelectorsRow: {
    marginBottom: 12,
  },

  selectorGroup: {
    marginBottom: 10,
  },

  selectorLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6a8aa0',
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  selectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    marginRight: 8,
    marginBottom: 8,
  },

  selectorChipActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  selectorChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#214866',
  },

  selectorChipTextActive: {
    color: '#ffffff',
  },

  calendarCard: {
    backgroundColor: '#f4fbff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
  },

  calendarHeader: {
    marginBottom: 12,
  },

  calendarMonth: {
    fontSize: 16,
    fontWeight: '900',
    color: '#173f5c',
  },

  calendarMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#67869b',
    marginTop: 3,
  },

  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  calendarWeekDay: {
    width: '13.5%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#7b99ad',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  calendarDayCell: {
    width: '13.5%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dfedf7',
  },

  calendarDayCellActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  calendarDayCellMuted: {
    backgroundColor: '#edf4f8',
  },

  calendarDayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#214866',
  },

  calendarDayTextActive: {
    color: '#ffffff',
  },

  calendarDayTextMuted: {
    color: '#95acbb',
  },

  timeCalendarCard: {
    backgroundColor: '#f4fbff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    borderRadius: 22,
    padding: 14,
    marginBottom: 8,
  },

  timeCalendarHeader: {
    marginBottom: 10,
  },

  timeCalendarTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#173f5c',
  },

  timeCalendarMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#67869b',
    marginTop: 3,
  },

  slotChip: {
    width: '48%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  slotChipActive: {
    backgroundColor: '#2c7fb8',
    borderColor: '#2c7fb8',
  },

  slotChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#214866',
  },

  slotChipTextActive: {
    color: '#ffffff',
  },

  summaryCard: {
    backgroundColor: '#eef8ff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d5ebf8',
    marginTop: 6,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4d6c82',
    marginBottom: 6,
  },

  summaryNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
    marginTop: 4,
  },

  primaryButtonRow: {
    marginTop: 16,
  },

  inlineButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  primaryActionButtonFull: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryActionButtonDisabled: {
    backgroundColor: '#88a1b3',
  },

  primaryActionText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },

  recommendationCard: {
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

  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f4fbff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d7edf9',
    padding: 14,
    marginBottom: 12,
  },

  recommendationBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  recommendationBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },

  recommendationContent: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
  },

  recommendationValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#214866',
    marginTop: 3,
    marginBottom: 4,
  },

  recommendationNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
  },

  managementCard: {
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

  managementTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173f5c',
  },

  managementMeta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#628096',
    marginTop: 6,
    marginBottom: 14,
  },

  emptyStateCard: {
    backgroundColor: '#eef8ff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d5ebf8',
    marginTop: 14,
  },

  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 6,
  },

  emptyStateText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
  },

  managementInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  managementInfoItem: {
    width: '48%',
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  managementInfoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  managementInfoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  managementActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  managementActionButton: {
    width: '48%',
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#eef4f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d7e4ec',
  },

  managementActionButtonBlue: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  managementActionButtonDanger: {
    backgroundColor: '#fff1f1',
    borderColor: '#ffd7d7',
  },

  managementActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#49687a',
  },

  managementActionTextLight: {
    color: '#ffffff',
  },

  managementActionTextDanger: {
    color: '#cb5353',
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

  reasonPickerModalCard: {
    width: '100%',
    maxHeight: '78%',
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

  scheduleCalendarModalCard: {
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

  reasonPickerModalText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5d7b91',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },

  reasonPickerList: {
    marginBottom: 16,
  },

  reasonPickerListContent: {
    paddingBottom: 4,
  },

  reasonPickerOption: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#eef8ff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  reasonPickerOptionActive: {
    backgroundColor: '#173f5c',
    borderColor: '#173f5c',
  },

  reasonPickerOptionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  reasonPickerOptionTextActive: {
    color: '#ffffff',
  },

  scheduleCalendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 18,
    paddingHorizontal: 2,
  },

  scheduleCalendarNavButton: {
    minWidth: 82,
    minHeight: 46,
    borderRadius: 18,
    backgroundColor: '#e8f2f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  scheduleCalendarNavButtonDisabled: {
    opacity: 0.45,
  },

  scheduleCalendarNavButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#173f5c',
  },

  scheduleCalendarTitleWrap: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },

  scheduleCalendarActiveMonth: {
    fontSize: 15,
    fontWeight: '900',
    color: '#173f5c',
    marginBottom: 8,
    textAlign: 'center',
  },

  scheduleCalendarPickerWrapYear: {
    width: '100%',
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  scheduleCalendarPickerDropdown: {
    minHeight: 46,
  },

  scheduleDropdownContainer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  scheduleDropdownPlaceholder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#87a0b1',
  },

  scheduleDropdownSelectedText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  scheduleDropdownItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173f5c',
  },

  scheduleDropdownIcon: {
    width: 18,
    height: 18,
  },

  scheduleCalendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  scheduleCalendarWeekLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#6a8aa0',
    textTransform: 'uppercase',
  },

  scheduleCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },

  scheduleCalendarDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  scheduleCalendarDayCellEmpty: {
    backgroundColor: 'transparent',
  },

  scheduleCalendarDayCellDisabled: {
    backgroundColor: '#eef3f7',
  },

  scheduleCalendarDayCellAvailable: {
    backgroundColor: '#e9f8ef',
    borderWidth: 1,
    borderColor: '#bfe8cf',
  },

  scheduleCalendarDayCellSelected: {
    backgroundColor: '#173f5c',
  },

  scheduleCalendarDayCellAvailableSelected: {
    backgroundColor: '#2fa866',
    borderWidth: 1,
    borderColor: '#2fa866',
  },

  scheduleCalendarDayText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  scheduleCalendarDayTextEmpty: {
    color: 'transparent',
  },

  scheduleCalendarDayTextDisabled: {
    color: '#aabac6',
  },

  scheduleCalendarDayTextAvailable: {
    color: '#2f8d59',
  },

  scheduleCalendarDayTextSelected: {
    color: '#ffffff',
  },

  scheduleCalendarDayTextAvailableSelected: {
    color: '#ffffff',
  },

  scheduleCalendarDonePlaceholder: {
    width: '48%',
    minHeight: 48,
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

  modalDangerButton: {
    width: '48%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#cf5353',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalDangerText: {
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
