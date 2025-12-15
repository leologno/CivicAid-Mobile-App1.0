export const COLORS = {
    // Pure Sky Blue Theme (No Green)
    primary: '#0EA5E9', // Sky Blue
    primaryDark: '#0284C7', // Darker Sky Blue
    primaryLight: '#38BDF8', // Lighter Sky Blue

    secondary: '#38BDF8', // Light Sky Blue (Accent)
    accent: '#7DD3FC', // Pale Sky Blue

    // Semantic Colors
    success: '#22C55E', // Green 500 (Kept for Status/Success only)
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500
    info: '#3B82F6', // Blue 500

    // Neutrals (Clean & Airy)
    background: '#F0F9FF', // Sky 50
    surface: '#FFFFFF',
    text: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textLight: '#94A3B8', // Slate 400
    border: '#E2E8F0', // Slate 200
    inputBg: '#F1F5F9', // Slate 100

    // Gradients
    gradients: {
        primary: ['#0EA5E9', '#0284C7'], // Sky Blue to Darker Sky
        secondary: ['#38BDF8', '#0EA5E9'], // Light to Medium Sky
        accent: ['#7DD3FC', '#38BDF8'], // Very Light to Light Sky
        blue: ['#3B82F6', '#2563EB'],
        orange: ['#F97316', '#EA580C'],
        success: ['#10B981', '#059669'], // Status gradient
        danger: ['#EF4444', '#DC2626'],
        dark: ['#1F2937', '#111827'],
        background: ['#F0F9FF', '#E0F2FE', '#BAE6FD'], // Pure Blue Fade: Cloud to Sky
        exclusive: ['#0284C7', '#38BDF8'], // Exclusive: Deep Sky to Light Sky
    }
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const TYPOGRAPHY = {
    h1: { fontSize: 32, fontWeight: '800', lineHeight: 40, letterSpacing: -0.5, color: COLORS.text },
    h2: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.5, color: COLORS.text },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 28, color: COLORS.text },
    body: { fontSize: 16, lineHeight: 24, color: COLORS.textSecondary },
    bodySmall: { fontSize: 14, lineHeight: 20, color: COLORS.textSecondary },
    button: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
    caption: { fontSize: 12, lineHeight: 16, color: COLORS.textLight },
};

export const SHADOWS = {
    small: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    modern: {
        shadowColor: '#0D9488',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    }
};

export const BORDER_RADIUS = {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    full: 9999,
};

export default {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    BORDER_RADIUS,
};
