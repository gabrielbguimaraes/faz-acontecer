import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    small: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    medium: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    large: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: colors.textLight,
    },
    secondaryText: {
        color: colors.textLight,
    },
    outlineText: {
        color: colors.primary,
    },
});