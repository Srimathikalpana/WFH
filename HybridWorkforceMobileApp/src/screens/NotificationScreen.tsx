import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  SectionList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

interface Notification {
  id: string;
  type: 'checkin' | 'reminder' | 'idle' | 'message' | 'system';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  avatar: string;
  avatarColor: string;
}

interface NotificationSection {
  title: string;
  data: Notification[];
}

const NotificationScreen = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSection[]>([
    {
      title: 'Today',
      data: [
        {
          id: '1',
          type: 'checkin',
          title: 'Check-in Successful',
          body: 'Your attendance has been marked as present',
          timestamp: '2:45 PM',
          isRead: false,
          avatar: '✓',
          avatarColor: Colors.success.bg,
        },
        {
          id: '2',
          type: 'reminder',
          title: 'Idle Reminder',
          body: 'You have been idle for 15 minutes',
          timestamp: '1:30 PM',
          isRead: false,
          avatar: '!',
          avatarColor: Colors.warning.bg,
        },
        {
          id: '3',
          type: 'idle',
          title: 'Status Update',
          body: 'Your status has been set to idle',
          timestamp: '1:15 PM',
          isRead: false,
          avatar: '◯',
          avatarColor: Colors.info.bg,
        },
      ],
    },
    {
      title: 'Yesterday',
      data: [
        {
          id: '4',
          type: 'message',
          title: 'New Team Message',
          body: 'Engineering Team posted in #general channel',
          timestamp: 'Yesterday',
          isRead: true,
          avatar: 'ET',
          avatarColor: Colors.background.elevated,
        },
        {
          id: '5',
          type: 'system',
          title: 'System Notification',
          body: 'Performance update released for mobile app v2.4.1',
          timestamp: 'Yesterday',
          isRead: true,
          avatar: '⚙',
          avatarColor: '#1C0D2A',
        },
      ],
    },
  ]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleMarkAllRead = async () => {
    const updated = notifications.map((section) => ({
      ...section,
      data: section.data.map((notif) => ({ ...notif, isRead: true })),
    }));
    setNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications
      .map((section) => ({
        ...section,
        data: section.data.filter((notif) => notif.id !== id),
      }))
      .filter((section) => section.data.length > 0);
    setNotifications(updated);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const getAvatarBg = () => {
      switch (item.type) {
        case 'checkin':
          return Colors.success.bg;
        case 'reminder':
          return Colors.warning.bg;
        case 'idle':
          return Colors.info.bg;
        case 'message':
          return Colors.background.elevated;
        case 'system':
          return '#1C0D2A';
        default:
          return Colors.background.elevated;
      }
    };

    const getAvatarText = () => {
      switch (item.type) {
        case 'checkin':
          return '✓';
        case 'reminder':
          return '!';
        case 'idle':
          return '◯';
        case 'message':
          return 'TM';
        case 'system':
          return '⚙';
        default:
          return '●';
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.notifItem,
          !item.isRead && styles.notifItemUnread,
        ]}
        onPress={() => {
          // Mark as read
          const updated = notifications.map((section) => ({
            ...section,
            data: section.data.map((notif) =>
              notif.id === item.id ? { ...notif, isRead: true } : notif
            ),
          }));
          setNotifications(updated);
        }}
      >
        <View
          style={[styles.notifAvatar, { backgroundColor: getAvatarBg() }]}
        >
          <Text style={styles.notifAvatarText}>{getAvatarText()}</Text>
        </View>

        <View style={styles.notifContent}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifBody}>{item.body}</Text>
          <Text style={styles.notifTime}>{item.timestamp}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Feather name="x" size={16} color={Colors.text.hint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <ScreenWrapper noPadding>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <SectionList
            sections={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.notifList}
            refreshing={loading}
            onRefresh={handleRefresh}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.text.muted} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  markAllRead: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.blue,
    fontWeight: Typography.fontWeight.medium,
  },
  notifList: {
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.hint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
    backgroundColor: 'transparent',
  },
  notifItemUnread: {
    backgroundColor: Colors.background.surface,
  },
  notifAvatar: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: Spacing.xs,
  },
  notifAvatarText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  notifContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  notifTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  notifBody: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    lineHeight: 1.4,
  },
  notifTime: {
    fontSize: Typography.fontSize.xs,
    color: '#374151',
    marginTop: Spacing.xs,
  },
  unreadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.accent.blue,
    marginTop: Spacing.md,
    flexShrink: 0,
  },
  deleteButton: {
    padding: Spacing.sm,
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.muted,
  },
});

export default NotificationScreen;
