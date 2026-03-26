import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import GradientButton from '../components/ui/GradientButton';
import { getDashboard } from '../services/dashboardService';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: 'checkin' | 'status' | 'leave' | 'other';
}

interface DashboardData {
  stats?: {
    loginTime?: string;
    workMode?: string;
    activeTime?: string;
    idleTime?: string;
    daysThisMonth?: number;
    productivity?: number;
    attendance?: number;
  };
}

const LOG_ITEM_HEIGHT = 48;

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<'available' | 'idle' | 'offline'>(
    'available'
  );
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      text: 'Checked in — Office mode',
      time: '12:36 PM',
      type: 'checkin',
    },
    {
      id: '2',
      text: 'Status set to Available',
      time: '12:36 PM',
      type: 'status',
    },
  ]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard(user.role);
      setDashboard(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || 'Failed to load dashboard'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = dashboard?.stats;
  const loginTime =
    stats?.loginTime && stats.loginTime !== 'N/A'
      ? new Date(stats.loginTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Not checked in';

  const getStatusColor = () => {
    switch (userStatus) {
      case 'available':
        return Colors.success.base;
      case 'idle':
        return Colors.warning.base;
      case 'offline':
        return Colors.error.base;
      default:
        return Colors.success.base;
    }
  };

  const getStatusDot = () => {
    switch (userStatus) {
      case 'available':
        return { size: 6, color: Colors.success.base };
      case 'idle':
        return { size: 6, color: Colors.warning.base };
      case 'offline':
        return { size: 6, color: Colors.error.base };
      default:
        return { size: 6, color: Colors.success.base };
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'attendance':
        navigation.navigate('Attendance');
        break;
      case 'leave':
        navigation.navigate('Leave');
        break;
      case 'wfh':
        navigation.navigate('Leave');
        break;
      case 'reports':
        navigation.navigate('Attendance');
        break;
      default:
        break;
    }
  };

  const statusDot = getStatusDot();

  return (
    <ScreenWrapper noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good Afternoon, {user?.name?.split(' ')[0]} 👋
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              • Workspace: Office
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Feather name="bell" size={14} color={Colors.text.muted} />
            <View style={styles.unreadDot} />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusTop}>
            <Badge
              label={userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
              variant={
                userStatus === 'available'
                  ? 'success'
                  : userStatus === 'idle'
                  ? 'warning'
                  : 'error'
              }
              size="sm"
              icon={
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor() },
                  ]}
                />
              }
            />
            <Text style={styles.loginTime}>Logged in {loginTime}</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Active Time</Text>
              <Text style={[styles.timeValue, { color: Colors.success.base }]}>
                {stats?.activeTime || '0h'}
              </Text>
              <Text style={styles.timeSub}>Running</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Idle Time</Text>
              <Text style={styles.timeValue}>
                {stats?.idleTime || '0h'}
              </Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Work Mode</Text>
              <Text style={styles.timeValue}>{stats?.workMode || 'Office'}</Text>
            </View>
          </View>
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Days This Month</Text>
            <Text style={styles.statValue}>{stats?.daysThisMonth || 20}</Text>
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Productivity</Text>
            <Text style={styles.statValue}>{stats?.productivity || 92}%</Text>
            <View style={[styles.statChip, styles.statChipGreen]}>
              <Text style={[styles.statChipText, styles.statChipGreenText]}>
                Excellent
              </Text>
            </View>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>{stats?.attendance || 95}%</Text>
            <View style={[styles.statChip, styles.statChipGreen]}>
              <Text style={[styles.statChipText, styles.statChipGreenText]}>
                Good
              </Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {[
            { id: 'attendance', label: 'Mark\nAttendance', icon: 'check-circle', color: '#0D1F10' },
            { id: 'leave', label: 'Apply\nLeave', icon: 'calendar', color: '#1A1200' },
            { id: 'wfh', label: 'Apply\nWFH', icon: 'home', color: '#0A1A2E' },
            { id: 'reports', label: 'View\nReports', icon: 'bar-chart-2', color: '#1C0D2A' },
          ].map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Feather name={action.icon as any} size={18} color="white" />
              </View>
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity */}
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.activityContainer}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View
                style={[
                  styles.activityDot,
                  {
                    backgroundColor:
                      activity.type === 'checkin'
                        ? Colors.success.base
                        : Colors.accent.blue,
                  },
                ]}
              />
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  notificationButton: {
    width: 28,
    height: 28,
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.error.base,
    borderWidth: 1,
    borderColor: Colors.background.base,
  },
  errorContainer: {
    backgroundColor: Colors.error.bg,
    borderWidth: 1,
    borderColor: Colors.error.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error.base,
  },
  statusCard: {
    gap: Spacing.md,
  },
  statusTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loginTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  timeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timeBox: {
    flex: 1,
    backgroundColor: Colors.background.base,
    borderWidth: 1,
    borderColor: Colors.border.lighter,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  timeLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
    marginBottom: Spacing.xs,
  },
  timeValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  timeSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  statChip: {
    backgroundColor: Colors.warning.bg,
    borderColor: Colors.warning.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  statChipGreen: {
    backgroundColor: Colors.success.bg,
    borderColor: Colors.success.border,
  },
  statChipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.warning.base,
    fontWeight: Typography.fontWeight.medium,
  },
  statChipGreenText: {
    color: Colors.success.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionIcon: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  activityContainer: {
    gap: 1,
    marginBottom: Spacing.xl,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
  },
});

