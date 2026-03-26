import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import Card from '../components/ui/Card';
import GradientButton from '../components/ui/GradientButton';
import TextField from '../components/ui/TextField';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Implement profile update in service
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel' },
      {
        text: 'Sign Out',
        onPress: () => signOut(),
        style: 'destructive',
      },
    ]);
  };

  const menuItems = [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'privacy', label: 'Privacy', icon: 'shield' },
    { id: 'help', label: 'Help & Support', icon: 'help-circle' },
  ];

  return (
    <ScreenWrapper noPadding>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            <Text style={styles.editButton}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'U'}
            </Text>
          </View>
        </View>

        {/* Profile Info Card */}
        {isEditing ? (
          <Card style={styles.editCard}>
            <Text style={styles.cardTitle}>Edit Profile</Text>

            <View style={styles.formGroup}>
              <TextField
                label="Full Name"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <TextField
                label="Role"
                value={user?.role || 'Employee'}
                editable={false}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={Colors.accent.blue} />
            ) : (
              <GradientButton
                label="Save Changes"
                onPress={handleSaveProfile}
                size="lg"
              />
            )}
          </Card>
        ) : (
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>
                  {user?.role === 'EMPLOYEE'
                    ? 'Employee'
                    : user?.role === 'MANAGER'
                    ? 'Manager'
                    : 'HR Lead'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>
                  {user?.department || 'Engineering'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>March 2024</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Menu Items */}
        {!isEditing && (
          <>
            <Text style={styles.sectionTitle}>Resources</Text>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <Feather
                    name={item.icon as any}
                    size={16}
                    color={Colors.text.secondary}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={Colors.text.hint}
                />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Sign Out */}
        {!isEditing && (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Feather
              name="log-out"
              size={16}
              color={Colors.error.base}
              style={styles.menuIcon}
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        {/* Version */}
        <Text style={styles.version}>Cube AI v2.4.1</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  editButton: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.blue,
    fontWeight: Typography.fontWeight.medium,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  editCard: {
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  infoCard: {
    gap: Spacing.md,
  },
  infoRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuLabel: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lighter,
    marginTop: Spacing.lg,
  },
  signOutText: {
    fontSize: Typography.fontSize.md,
    color: Colors.error.base,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.md,
  },
  version: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.hint,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default ProfileScreen;
