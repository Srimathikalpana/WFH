import { useWindowDimensions } from 'react-native';

/**
 * Responsive Font Scaling
 * 
 * Scales font sizes based on screen width to ensure consistent
 * display across different device sizes (phones, tablets, etc.)
 * 
 * Base breakpoints:
 * - Small (< 380px): 0.85x scale
 * - Medium (380-600px): 1x scale (default)
 * - Large (600-800px): 1.1x scale
 * - Extra Large (> 800px): 1.2x scale
 */

const baseSize = 380; // Reference screen width (base/default)

export function useResponsiveFontSize() {
  const { width } = useWindowDimensions();
  
  // Calculate scaling factor based on screen width
  const scale = Math.min(width / baseSize, 1.5); // Cap at 1.5x
  
  return {
    /**
     * Get responsive font size
     * @param baseSize - Base font size (e.g., 14)
     * @returns Scaled font size for current screen
     */
    getFontSize: (baseSize: number) => Math.round(baseSize * scale),
    
    /**
     * Get responsive line height
     * @param baseFontSize - Base font size
     * @returns Scaled line height
     */
    getLineHeight: (baseFontSize: number) => Math.round(baseFontSize * 1.4 * scale),
    
    /**
     * Get all responsive typography sizes at once
     * @returns Object with all scaled sizes
     */
    getTypographySizes: () => ({
      xs: Math.round(9 * scale),
      sm: Math.round(12 * scale),
      base: Math.round(14 * scale),
      md: Math.round(16 * scale),
      lg: Math.round(18 * scale),
      xl: Math.round(20 * scale),
      '2xl': Math.round(24 * scale),
      '3xl': Math.round(28 * scale),
    }),
    
    /**
     * Get scale factor (useful for other responsive calculations)
     */
    scale,
  };
}

/**
 * Alternative: Static utility function for non-hook usage
 */
export function getResponsiveFontSize(baseFontSize: number, screenWidth: number) {
  const scale = Math.min(screenWidth / baseSize, 1.5);
  return Math.round(baseFontSize * scale);
}
