import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const { setSplashDone } = useAuth();
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      setSplashDone();
    });

    // Cleanup
    return () => {
      animation.reset();
    };
  }, []);

  const dotAnimations = [
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0.3)).current,
    React.useRef(new Animated.Value(0.6)).current,
  ];

  useEffect(() => {
    dotAnimations.forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <LinearGradient
      colors={['#0F1117', '#141822', '#0A0D12']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Ring */}
        <View style={styles.logoRing}>
          <LinearGradient
            colors={[Colors.accent.blue, '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradientRing}
          >
            <View style={styles.logoInner}>
              <LinearGradient
                colors={[Colors.accent.blue, Colors.accent.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Feather name="shield" size={24} color="white" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* Brand Name */}
        <Text style={styles.brandName}>Cube AI</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>WORKFORCE MANAGER</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Smart attendance. Real-time visibility. Anywhere.
        </Text>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {dotAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                index === 0 ? styles.dotActive : styles.dot,
                { opacity: anim },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Version */}
      <Text style={styles.version}>v2.4.1</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: '#1E2231',
    borderColor: '#2E3448',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  logoGradientRing: {
    position: 'absolute',
    inset: -3,
    borderRadius: 23,
    opacity: 0.6,
  },
  logoInner: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.hint,
    textAlign: 'center',
    lineHeight: 1.5,
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing['2xl'],
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2A2D3E',
  },
  dotActive: {
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.accent.blue,
  },
  version: {
    position: 'absolute',
    bottom: Spacing.xl,
    fontSize: Typography.fontSize.xs,
    color: '#374151',
  },
});
