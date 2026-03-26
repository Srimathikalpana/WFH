import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ScreenWrapper from '../components/ui/ScreenWrapper';
import TextField from '../components/ui/TextField';
import GradientButton from '../components/ui/GradientButton';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';

type Role = 'employee' | 'manager' | 'hr';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('riya@company.com');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await login(email, password, role);
      await signIn(response);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexContainer}
    >
      <ScreenWrapper noPadding>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.miniLogo}>
              <Feather name="shield" size={16} color="white" />
            </View>
            <Text style={styles.logoText}>Cube AI</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Sign in to your workspace</Text>

          {/* Error Message */}
          {error && <Text style={styles.error}>{error}</Text>}

          {/* Role Toggle */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>ROLE</Text>
            <View style={styles.roleToggle}>
              {(['employee', 'manager', 'hr'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleButton,
                    role === r && styles.roleButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === r && styles.roleButtonTextActive,
                    ]}
                  >
                    {r === 'employee'
                      ? 'Employee'
                      : r === 'manager'
                      ? 'Manager'
                      : 'HR Lead'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              icon={<Feather name="mail" size={13} color={Colors.accent.blue} />}
            />
          </View>

          {/* Password Field */}
          <View style={styles.formGroup}>
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
              icon={<Feather name="lock" size={13} color={Colors.text.hint} />}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={13}
                    color={Colors.text.hint}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent.blue} />
              </View>
            ) : (
              <GradientButton
                label="Sign In"
                onPress={handleLogin}
                size="lg"
                colors={Colors.gradients.primary}
              />
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Biometric Options */}
          <View style={styles.biometricRow}>
            <TouchableOpacity style={styles.biometricButton}>
              <Feather name="smartphone" size={12} color={Colors.text.muted} />
            </TouchableOpacity>
            <View style={styles.biometricSeparator} />
            <Text style={styles.biometricText}>Face ID</Text>
            <View style={styles.biometricSeparator} />
            <TouchableOpacity style={styles.biometricButton}>
              <Feather name="circle" size={12} color={Colors.text.muted} />
            </TouchableOpacity>
            <Text style={styles.biometricText}>Fingerprint</Text>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  miniLogo: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  error: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error.base,
    backgroundColor: Colors.error.bg,
    borderWidth: 1,
    borderColor: Colors.error.border,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.hint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  roleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#1E3A5F',
  },
  roleButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.muted,
  },
  roleButtonTextActive: {
    color: Colors.accent.lightBlue,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginVertical: Spacing.sm,
  },
  forgot: {
    fontSize: Typography.fontSize.sm,
    color: Colors.accent.blue,
  },
  buttonContainer: {
    marginVertical: Spacing.lg,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2233',
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    color: '#374151',
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  biometricButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricSeparator: {
    width: 1,
    height: 14,
    backgroundColor: '#1F2233',
  },
  biometricText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.muted,
  },
});

export default LoginScreen;
