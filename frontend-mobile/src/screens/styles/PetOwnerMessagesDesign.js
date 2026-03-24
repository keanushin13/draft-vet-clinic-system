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
    paddingBottom: 16,
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
    width: 24,
    height: 24,
  },

  brandBlock: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
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

  messagesHeaderCard: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#5d9cac',
    borderWidth: 1,
    borderColor: '#7eb4c1',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  searchCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 26,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dceef8',
    marginBottom: 16,
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

  messagesHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },

  inboxCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 26,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dceef8',
    marginBottom: 18,
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

  searchInputWrap: {
    height: 42,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d7edf9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#173f5c',
    paddingRight: 10,
  },

  searchIcon: {
    width: 16,
    height: 16,
    tintColor: '#6e8a9d',
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#edf4f8',
  },

  messageRowActive: {
    backgroundColor: '#eef7fc',
    borderRadius: 16,
    borderBottomColor: 'transparent',
  },

  messageAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e2eef8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  messageAvatar: {
    width: 22,
    height: 22,
    tintColor: '#173f5c',
  },

  messageContent: {
    flex: 1,
  },

  messageTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  messageDoctorName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#173f5c',
    marginRight: 8,
  },

  messageDoctorNameActive: {
    color: '#173f5c',
  },

  messageTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8098aa',
  },

  messageTimeActive: {
    color: '#5f7f94',
  },

  messagePreview: {
    fontSize: 11,
    lineHeight: 16,
    color: '#658296',
    marginTop: 4,
    fontWeight: '600',
  },

  messagePreviewActive: {
    color: '#4d6c82',
  },

  rowUnreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2c7fb8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },

  rowUnreadBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffff',
  },

  inboxOnlyHintCard: {
    backgroundColor: '#eef8ff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d7edf9',
    padding: 16,
    marginBottom: 20,
  },

  inboxOnlyHintTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173f5c',
    marginBottom: 6,
  },

  inboxOnlyHintText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5d7b91',
    fontWeight: '600',
  },

  chatCard: {
    backgroundColor: '#f8fcff',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dceef8',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#7da5bc',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  chatHeader: {
    minHeight: 56,
    backgroundColor: '#5d9cac',
    borderBottomWidth: 1,
    borderBottomColor: '#7eb4c1',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  chatHeaderProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  chatHeaderAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2eef8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  chatHeaderAvatar: {
    width: 18,
    height: 18,
    tintColor: '#173f5c',
  },

  chatHeaderTextWrap: {
    flex: 1,
  },

  chatHeaderName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  chatHeaderStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e5f5fb',
    marginTop: 2,
  },

  chatBody: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  bubbleRowUser: {
    justifyContent: 'flex-end',
  },

  bubbleAvatarWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2eef8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  bubbleAvatar: {
    width: 12,
    height: 12,
    tintColor: '#173f5c',
  },

  bubbleContent: {
    maxWidth: '78%',
  },

  chatBubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  doctorBubble: {
    backgroundColor: '#242424',
    borderBottomLeftRadius: 8,
  },

  userBubble: {
    backgroundColor: '#2f9af0',
    borderBottomRightRadius: 8,
    alignSelf: 'flex-end',
  },

  chatBubbleText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#ffffff',
    fontWeight: '600',
  },

  userBubbleText: {
    color: '#ffffff',
  },

  bubbleTime: {
    fontSize: 10,
    color: '#6b8798',
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 4,
  },

  bubbleTimeUser: {
    textAlign: 'right',
    marginRight: 4,
    marginLeft: 0,
  },

  aiSuggestionsWrap: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  aiSuggestionChip: {
    backgroundColor: '#eef8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d7edf9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  aiSuggestionChipText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: '#173f5c',
  },

  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 14,
  },

  composerInput: {
    flex: 1,
    minHeight: 42,
    borderRadius: 20,
    backgroundColor: '#ececec',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#173f5c',
    marginRight: 10,
    fontWeight: '600',
  },

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d7edf9',
  },

  sendButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
    marginTop: -2,
  },

  threadTopBar: {
    minHeight: 56,
    marginHorizontal: 18,
    marginTop: 2,
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: '#5d9cac',
    borderWidth: 1,
    borderColor: '#7eb4c1',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  threadBackButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  threadBackIcon: {
    width: 16,
    height: 16,
    tintColor: '#ffffff',
  },

  threadTopTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },

  threadTopSpacer: {
    width: 34,
    height: 34,
  },

  threadScrollContent: {
    paddingBottom: 6,
  },

  threadFallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c212b',
    paddingHorizontal: 24,
  },

  threadFallbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
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
