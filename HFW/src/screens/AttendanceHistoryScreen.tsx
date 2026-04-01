import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

interface HistoryRecord {
  id: string;
  date: string;
  day: string;
  loginTime: string;
  logoutTime: string;
  location: string;
  status: 'present' | 'absent' | 'wfh';
  hours: string;
}

const AttendanceHistoryScreen = () => {
  const [filterPeriod, setFilterPeriod] = useState<'month' | 'week' | 'custom'>(
    'month'
  );

  const records: HistoryRecord[] = [
    {
      id: '1',
      date: '20',
      day: 'Fri',
      loginTime: '09:00 AM',
      logoutTime: '06:30 PM',
      location: 'Office HQ',
      status: 'present',
      hours: '9h 30m',
    },
    {
      id: '2',
      date: '19',
      day: 'Thu',
      loginTime: '08:45 AM',
      logoutTime: '05:45 PM',
      location: 'Office HQ',
      status: 'present',
      hours: '9h',
    },
    {
      id: '3',
      date: '18',
      day: 'Wed',
      loginTime: '--:--',
      logoutTime: '--:--',
      location: 'Remote',
      status: 'wfh',
      hours: '8h',
    },
    {
      id: '4',
      date: '17',
      day: 'Tue',
      loginTime: '09:15 AM',
      logoutTime: '02:00 PM',
      location: 'Office HQ',
      status: 'absent',
      hours: '4h 45m',
    },
  ];

  const getStatusVariant = (status: 'present' | 'absent' | 'wfh') => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'wfh':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: 'present' | 'absent' | 'wfh') => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'wfh':
        return 'WFH';
      default:
        return 'Unknown';
    }
  };

  const filterChips = [
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'Last Month' },
    { id: 'week2', label: 'Weekly' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <ScreenWrapper noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Attendance History</Text>
            <Text style={styles.subtitle}>Daily, weekly & monthly logs</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>This Month</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <FlatList
          data={filterChips}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                index === 0 && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  index === 0 && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          scrollEnabled={false}
          gap={Spacing.sm}
          style={styles.chipContainer}
          contentContainerStyle={{ gap: Spacing.sm }}
        />

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { borderColor: Colors.success.border }]}>
            <Text style={styles.summaryLabel}>Present</Text>
            <Text style={[styles.summaryValue, { color: Colors.success.base }]}>
              18
            </Text>
          </Card>
          <Card style={[styles.summaryCard, { borderColor: Colors.error.border }]}>
            <Text style={styles.summaryLabel}>Absent</Text>
            <Text style={[styles.summaryValue, { color: Colors.error.base }]}>
              1
            </Text>
          </Card>
          <Card style={[styles.summaryCard, { borderColor: Colors.info.border }]}>
            <Text style={styles.summaryLabel}>WFH</Text>
            <Text style={[styles.summaryValue, { color: Colors.accent.lightBlue }]}>
              2
            </Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Hours</Text>
            <Text style={styles.summaryValue}>162h</Text>
          </Card>
        </View>

        {/* History List */}
        <View style={styles.historyContainer}>
          {records.map((record) => (
            <View key={record.id} style={styles.historyItem}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateDay}>{record.date}</Text>
                <Text style={styles.dateName}>
                  {record.day}
                </Text>
              </View>

              <View style={styles.timesColumn}>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{record.loginTime}</Text>
                  <Text style={styles.separator}>→</Text>
                  <Text style={styles.timeText}>{record.logoutTime}</Text>
                </View>
                <Text style={styles.location}>{record.location}</Text>
              </View>

              <Text style={styles.hours}>{record.hours}</Text>

              <Badge
                label={getStatusLabel(record.status)}
                variant={getStatusVariant(record.status)}
                size="sm"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  filterButton: {
    backgroundColor: Colors.info.bg,
    borderColor: Colors.info.border,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.lightBlue,
    fontWeight: Typography.fontWeight.medium,
  },
  chipContainer: {
    marginVertical: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.info.bg,
    borderColor: Colors.info.border,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.muted,
  },
  chipTextActive: {
    color: Colors.accent.lightBlue,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  historyContainer: {
    gap: Spacing.xs,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  dateColumn: {
    alignItems: 'center',
    minWidth: 40,
  },
  dateDay: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  dateName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  timesColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  separator: {
    fontSize: Typography.fontSize.xs,
    color: Colors.border.default,
  },
  location: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
  },
  hours: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent.lightBlue,
    minWidth: 28,
  },
});

export default AttendanceHistoryScreen;
