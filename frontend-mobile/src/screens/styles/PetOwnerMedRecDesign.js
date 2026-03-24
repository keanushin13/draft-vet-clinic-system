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

  selectorCard: {
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

  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  petChip: {
    width: '48%',
    minHeight: 74,
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

  summaryCard: {
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

  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  petAvatar: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: '#d9ecf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  petAvatarImage: {
    width: 40,
    height: 40,
    tintColor: '#173f5c',
  },

  petHeaderContent: {
    flex: 1,
  },

  petName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#173f5c',
  },

  petMeta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#68869c',
    marginTop: 5,
  },

  petId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5f7f94',
    marginTop: 8,
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

  dualSectionCard: {
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

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 12,
  },

  cardSpacing: {
    marginTop: 10,
  },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ba84a',
    marginTop: 6,
    marginRight: 12,
  },

  timelineDotBlue: {
    backgroundColor: '#2c7fb8',
  },

  timelineContent: {
    flex: 1,
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  timelineMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6a8aa0',
    marginTop: 4,
  },

  timelineNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
    marginTop: 6,
  },

  dataCard: {
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

  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  dataRowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  dataRowSubtext: {
    fontSize: 12,
    fontWeight: '700',
    color: '#68869c',
    marginTop: 4,
  },

  dataRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#214866',
    textAlign: 'right',
    maxWidth: '42%',
  },

  resultCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1f0fa',
    padding: 14,
    marginBottom: 12,
  },

  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  resultTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
    marginRight: 10,
  },

  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#e8f4ff',
    borderWidth: 1,
    borderColor: '#cde5f6',
  },

  resultBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e5d84',
  },

  resultNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
  },

  analysisCard: {
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

  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f4fbff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d7edf9',
    padding: 14,
    marginBottom: 12,
  },

  analysisScoreBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#173f5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  analysisScoreText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },

  analysisContent: {
    flex: 1,
  },

  analysisTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
  },

  analysisNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5f7f94',
    fontWeight: '600',
    marginTop: 6,
  },

  insightBox: {
    backgroundColor: '#eef8ff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d7edf9',
    padding: 16,
    marginTop: 4,
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 8,
  },

  insightText: {
    fontSize: 12,
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
});
