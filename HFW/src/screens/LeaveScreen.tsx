import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import Card from '../components/ui/Card';
import TextField from '../components/ui/TextField';
import GradientButton from '../components/ui/GradientButton';
import Badge from '../components/ui/Badge';
import { useLeave } from '../hooks/useLeave';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

type TabType = 'new' | 'requests' | 'team';
type RequestType = 'leave' | 'wfh';
type RequestStatus = 'approved' | 'pending' | 'rejected';

interface LeaveRequest {
  id: string;
  type: RequestType;
  duration: string;
  reason: string;
  status: RequestStatus;
  dates: string;
}

const LeaveScreen = () => {
  const { leaveBalance, apply, loading } = useLeave();
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [requestType, setRequestType] = useState<RequestType>('leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [requests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'wfh',
      duration: '1 day',
      reason: 'Remote work',
      status: 'approved',
      dates: 'Mar 15, 2026',
    },
    {
      id: '2',
      type: 'leave',
      duration: '3 days',
      reason: 'Personal',
      status: 'pending',
      dates: 'Mar 20-22, 2026',
    },
  ]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await apply({
        type: requestType,
        startDate,
        endDate,
        reason,
      });
      Alert.alert('Success', 'Request submitted successfully');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request');
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'new') {
      return (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>New Request</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>REQUEST TYPE</Text>
            <View style={styles.typeToggle}>
              {(['leave', 'wfh'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setRequestType(type)}
                  style={[
                    styles.typeButton,
                    requestType === type && styles.typeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      requestType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type === 'leave' ? 'Leave' : 'WFH'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Feather name="calendar" size={13} color={Colors.text.muted} />
                <Text style={styles.dateInputText}>
                  {startDate || 'Select'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Feather name="calendar" size={13} color={Colors.text.muted} />
                <Text style={styles.dateInputText}>{endDate || 'Select'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>REASON</Text>
            <View style={styles.reasonInput}>
              <Text style={styles.reasonText}>
                {reason || 'Enter reason for leave...'}
              </Text>
            </View>
          </View>

          <GradientButton
            label="Submit Request"
            onPress={handleSubmit}
            disabled={loading}
            size="lg"
          />
        </Card>
      );
    }

    if (activeTab === 'requests') {
      return (
        <View>
          <View style={styles.balanceRow}>
            {[
              { label: 'Casual Leave', value: '8/12', bg: Colors.warning.bg, color: Colors.warning.base },
              {label: 'Sick Leave', value: '5/6', bg: Colors.error.bg, color: Colors.error.base },
              { label: 'WFH Days', value: '3/4', bg: Colors.info.bg, color: Colors.accent.lightBlue },
            ].map((item, idx) => (
              <View key={idx} style={[styles.balanceCard, { borderColor: Colors.border.default }]}>
                <Text style={styles.balanceLabel}>{item.label}</Text>
                <Text style={[styles.balanceValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.requestsTitle}>My Requests</Text>
          {requests.map((req) => (
            <View key={req.id} style={styles.requestItem}>
              <Badge
                label={req.type === 'leave' ? 'Leave' : 'WFH'}
                variant={req.type === 'leave' ? 'warning' : 'info'}
                size="sm"
              />
              <View style={styles.requestMeta}>
                <Text style={styles.requestDuration}>{req.duration} - {req.dates}</Text>
                <Text style={styles.requestReason}>{req.reason}</Text>
              </View>
              <Badge
                label={
                  req.status === 'approved'
                    ? 'Approved'
                    : req.status === 'pending'
                    ? 'Pending'
                    : 'Rejected'
                }
                variant={
                  req.status === 'approved'
                    ? 'success'
                    : req.status === 'pending'
                    ? 'warning'
                    : 'error'
                }
                size="sm"
              />
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Leave & WFH</Text>
          <Text style={styles.subtitle}>Apply for leave or work from home</Text>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {(['new', 'requests', 'team'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === 'new'
                  ? 'New Request'
                  : tab === 'requests'
                  ? 'My Requests'
                  : 'Team'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.info.bg,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.muted,
  },
  tabTextActive: {
    color: Colors.accent.lightBlue,
  },
  formCard: {
    gap: Spacing.md,
  },
  formTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.hint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.info.bg,
    borderColor: Colors.info.border,
  },
  typeButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.muted,
  },
  typeButtonTextActive: {
    color: Colors.accent.lightBlue,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateField: {
    flex: 1,
    gap: Spacing.xs,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dateInputText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  reasonInput: {
    backgroundColor: Colors.background.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 100,
  },
  reasonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: Colors.background.surface,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
    marginBottom: Spacing.xs,
  },
  balanceValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  requestsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  requestMeta: {
    flex: 1,
    gap: Spacing.xs,
  },
  requestDuration: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  requestReason: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
});

export default LeaveScreen;
