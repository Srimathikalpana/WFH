import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import Card from '../components/ui/Card';
import PillSelect from '../components/ui/PillSelect';
import Badge from '../components/ui/Badge';
import GradientButton from '../components/ui/GradientButton';
import { useAttendance } from '../hooks/useAttendance';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

export default function AttendanceScreen() {
  const { attendance, isLoading, checkIn, checkOut } = useAttendance();
  const [availability, setAvailability] = useState<
    'available' | 'idle' | 'offline'
  >('available');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<string>('Office HQ, San Francisco');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statusCheckIn = attendance?.checkInTime && !attendance?.checkOutTime;
    setIsCheckedIn(Boolean(statusCheckIn));
  }, [attendance]);

  const handleCheckIn = async () => {
    try {
      let coords = null;
      const locPermission = await Location.requestForegroundPermissionsAsync();
      if (locPermission.granted) {
        const loc = await Location.getCurrentPositionAsync({});
        coords = loc.coords;
      }

      await checkIn({
        location: location,
        coordinates: coords,
        mode: availability === 'available' ? 'office' : 'wfh',
      });

      Alert.alert('Success', 'Checked in successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      Alert.alert('Success', 'Checked out successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to check out');
    }
  };

  const availabilityOptions = [
    {
      id: 'available',
      label: 'Available',
      variant: 'success' as const,
      icon: (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success.base }} />
      ),
    },
    {
      id: 'idle',
      label: 'Idle',
      variant: 'warning' as const,
      icon: (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.warning.base }} />
      ),
    },
    {
      id: 'offline',
      label: 'Offline',
      variant: 'error' as const,
      icon: (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error.base }} />
      ),
    },
  ];

  const clockDisplay = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dateDisplay = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScreenWrapper noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Attendance</Text>
            <Text style={styles.subtitle}>Manage status & check-in</Text>
          </View>
        </View>

        {/* Availability Status */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Set availability status</Text>
          <PillSelect
            options={availabilityOptions}
            selectedId={availability}
            onSelect={(id) => setAvailability(id as any)}
          />
        </View>

        {/* Session Card */}
        <Card style={styles.sessionCard}>
          <Text style={styles.cardLabel}>Today's Session</Text>

          <Text style={styles.clockDisplay}>{clockDisplay}</Text>
          <Text style={styles.clockDate}>{dateDisplay}</Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.accent.blue}
              style={styles.loader}
            />
          ) : (
            <>
              <LinearGradient
                colors={isCheckedIn ? Colors.gradients.ctaGreen : Colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkInButtonGradient}
              >
                <TouchableOpacity
                  style={styles.checkInButton}
                  onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
                >
                  <Feather
                    name={isCheckedIn ? 'log-out' : 'log-in'}
                    size={16}
                    color="white"
                  />
                  <Text style={styles.checkInButtonText}>
                    {isCheckedIn ? 'Check Out' : 'Check In Now'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Location Verification */}
              <View style={styles.geoRow}>
                <View style={styles.geoBadge}>
                  <Feather name="map-pin" size={10} color={Colors.text.muted} />
                  <Text style={styles.geoBadgeText}>{location}</Text>
                </View>
                <View style={styles.verificationBadge}>
                  <Feather name="shield" size={10} color={Colors.success.base} />
                  <Text style={styles.verificationText}>Verified</Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Face Recognition */}
        <Card style={styles.faceCard}>
          <View style={styles.faceContent}>
            <View style={styles.facePreview}>
              <Feather name="user-check" size={20} color={Colors.text.secondary} />
            </View>
            <View style={styles.faceInfo}>
              <Text style={styles.faceTitle}>Face Recognition</Text>
              <Text style={styles.faceSub}>
                {isCheckedIn ? 'Enabled' : 'Optional verification'}
              </Text>
            </View>
            <TouchableOpacity style={styles.faceButton}>
              <Text style={styles.faceButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Session Summary */}
        <View style={styles.sessionRow}>
          <Card style={styles.sessBox}>
            <Text style={styles.sessLabel}>Login Time</Text>
            <Text style={styles.sessValue}>
              {attendance?.checkInTime
                ? new Date(attendance.checkInTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '--:--'}
            </Text>
          </Card>
          <Card style={styles.sessBox}>
            <Text style={styles.sessLabel}>Active Hours</Text>
            <Text style={styles.sessValue}>
              {attendance?.activeTime || '0h 0m'}
            </Text>
          </Card>
          <Card style={styles.sessBox}>
            <Text style={styles.sessLabel}>Idle Hours</Text>
            <Text style={styles.sessValue}>
              {attendance?.idleTime || '0h 0m'}
            </Text>
          </Card>
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
    gap: Spacing.lg,
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
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  sessionCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  cardLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
  },
  clockDisplay: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: -1,
  },
  clockDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  checkInButtonGradient: {
    borderRadius: BorderRadius.xl,
    width: '100%',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  checkInButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: '#fff',
  },
  geoRow: {
    width: '100%',
    gap: Spacing.sm,
  },
  geoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.elevated,
    borderColor: Colors.border.light,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  geoBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success.bg,
    borderColor: Colors.success.border,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  verificationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success.base,
    fontWeight: Typography.fontWeight.medium,
  },
  faceCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  faceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  facePreview: {
    width: 44,
    height: 44,
    backgroundColor: Colors.background.base,
    borderColor: Colors.border.lighter,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  faceInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  faceTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  faceSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  faceButton: {
    backgroundColor: Colors.info.bg,
    borderColor: Colors.info.border,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  faceButtonText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent.lightBlue,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sessBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  sessLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
  },
  sessValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
});
