import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import TextField from '../components/ui/TextField';
import GradientButton from '../components/ui/GradientButton';
import { getConversations } from '../services/chatService';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

interface ChatItem {
  _id: string;
  name?: string;
  type: 'direct' | 'group' | 'announcement';
  participants: Array<{ name: string; id: string }>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const ChatListScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'direct' | 'groups'>(
    'all'
  );
  const [searchText, setSearchText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const conversations = await getConversations();
      setChats(conversations);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || 'Failed to load chats'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredChats = chats.filter((chat) => {
    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'direct' && chat.type === 'direct') ||
      (filterTab === 'groups' && chat.type === 'group');

    const searchMatch =
      searchText === '' ||
      (chat.name &&
        chat.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (chat.participants &&
        chat.participants.some((p) =>
          p.name.toLowerCase().includes(searchText.toLowerCase())
        ));

    return matchesTab && searchMatch;
  });

  const getInitials = (name?: string, participants?: Array<{ name: string }>) => {
    if (name) {
      return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (participants && participants.length > 0) {
      return participants[0].name[0].toUpperCase();
    }
    return '?';
  };

  const getChatTitle = (chat: ChatItem): string => {
    if (chat.name) return chat.name;
    if (chat.type === 'direct' && chat.participants.length > 0) {
      return chat.participants[0].name;
    }
    return 'Unknown Chat';
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          item.unreadCount && item.unreadCount > 0 && styles.chatItemUnread,
        ]}
        onPress={() =>
          navigation.navigate('ChatRoom', {
            conversationId: item._id,
            title: getChatTitle(item),
          })
        }
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.avatarCircle,
            item.type === 'group' && styles.groupAvatar,
          ]}
        >
          {item.type === 'group' || item.type === 'announcement' ? (
            <Feather
              name={item.type === 'announcement' ? 'megaphone' : 'users'}
              size={16}
              color="white"
            />
          ) : (
            <Text style={styles.avatarText}>
              {getInitials(item.name, item.participants)}
            </Text>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.chatName,
                item.unreadCount &&
                  item.unreadCount > 0 &&
                  styles.chatNameUnread,
              ]}
              numberOfLines={1}
            >
              {getChatTitle(item)}
            </Text>
            {item.lastMessageTime && (
              <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
            )}
          </View>
          {item.lastMessage && (
            <Text
              style={[
                styles.chatPreview,
                item.unreadCount &&
                  item.unreadCount > 0 &&
                  styles.chatPreviewUnread,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          )}
        </View>

        {item.unreadCount && item.unreadCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}

        {item.type === 'announcement' && (
          <Text style={styles.readOnlyLabel}>Read-only</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper noPadding>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <TextField
            placeholder="Search conversations..."
            value={searchText}
            onChangeText={setSearchText}
            icon={<Feather name="search" size={13} color={Colors.text.hint} />}
          />
        </View>

        {/* New Chat Button */}
        <View style={styles.buttonSection}>
          <GradientButton
            label="+ New Chat"
            onPress={() => {
              /* TODO: Implement new chat */
            }}
            size="lg"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsSection}>
          {(['all', 'direct', 'groups'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilterTab(tab)}
              style={[styles.filterTab, filterTab === tab && styles.filterTabActive]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterTab === tab && styles.filterTabTextActive,
                ]}
              >
                {tab === 'all'
                  ? 'All'
                  : tab === 'direct'
                  ? 'Direct'
                  : 'Groups'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat List */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && filteredChats.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.accent.blue} />
          </View>
        ) : filteredChats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="message-circle" size={48} color={Colors.text.muted} />
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item._id}
            scrollEnabled
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  searchSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  buttonSection: {
    marginBottom: Spacing.md,
  },
  tabsSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: 0,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.info.bg,
    borderColor: Colors.info.border,
  },
  filterTabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.muted,
  },
  filterTabTextActive: {
    color: Colors.accent.lightBlue,
  },
  errorContainer: {
    backgroundColor: Colors.error.bg,
    borderWidth: 1,
    borderColor: Colors.error.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error.base,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.muted,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
    gap: Spacing.lg,
  },
  chatItemUnread: {
    backgroundColor: Colors.background.surface,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  groupAvatar: {
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  avatarText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  chatContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    flex: 1,
  },
  chatNameUnread: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  chatTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  chatPreview: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
  },
  chatPreviewUnread: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  badgeContainer: {
    backgroundColor: Colors.accent.blue,
    borderRadius: BorderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  readOnlyLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
});

export default ChatListScreen;
