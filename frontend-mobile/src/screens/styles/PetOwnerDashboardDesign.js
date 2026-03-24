import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

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
    paddingBottom: 110,
  },

  headerBar: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 0,

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
  },

  logoWrap: {
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

  headerLogo: {
    width: 25,
    height: 25,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ffffff',
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

  headerSubtitle: {
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

  welcomeCard: {
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

  welcomeSmall: {
    color: '#dbeaf5',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  welcomeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  welcomeTextWrap: {
    flex: 1,
    marginRight: 14,
  },

  welcomeText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 32,
  },

  welcomeProfileAvatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  welcomeProfileAvatar: {
    width: 34,
    height: 34,
    tintColor: '#ffffff',
  },

  welcomeProfileAvatarCustom: {
    width: '100%',
    height: '100%',
  },

  welcomeDesc: {
    color: '#edf7fc',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '95%',
    fontWeight: '500',
  },

  heroSlideCard: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  heroSlideTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  heroSlideLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#dbeaf5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  heroDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.34)',
    marginLeft: 6,
  },

  heroDotActive: {
    width: 18,
    backgroundColor: '#ffffff',
  },

  heroSlideTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
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

  aiCard: {
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

  aiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  aiScoreBox: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#26b14f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  aiScoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },

  aiSummaryContent: {
    flex: 1,
  },

  aiMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 4,
  },

  aiMainSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5d7b91',
  },

  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  scoreItem: {
    width: '48%',
    backgroundColor: '#f4fbff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d7edf9',
  },

  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  greenCircle: {
    backgroundColor: '#e6f8eb',
    borderWidth: 3,
    borderColor: '#27b446',
  },

  yellowCircle: {
    backgroundColor: '#fff8e2',
    borderWidth: 3,
    borderColor: '#e0b400',
  },

  scoreLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: '#173f5c',
  },

  scoreItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 3,
  },

  scoreItemDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b8798',
    textAlign: 'center',
  },

  highlightBox: {
    backgroundColor: '#eef8ff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d5ebf8',
  },

  highlightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 8,
  },

  highlightText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#587286',
    fontWeight: '600',
    marginBottom: 4,
  },

  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  menuCard: {
    width: '31.5%',
    minHeight: 142,
    backgroundColor: '#fcfeff',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e3f3fb',
    ...Platform.select({
      ios: {
        shadowColor: '#b8e7ff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
      },
      android: {
        elevation: 7,
      },
    }),
  },

  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#e8f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d4ebf8',
  },

  iconImage: {
    width: 26,
    height: 26,
    tintColor: '#173f5c',
  },

  menuLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#173f5c',
    fontWeight: '800',
    lineHeight: 16,
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
