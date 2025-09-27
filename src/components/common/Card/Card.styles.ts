import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: spacing.md,
        margin: spacing.sm,
    },
    elevated: {
        backgroundColor: colors.textLight,
        shadowColor: colors.textDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    outlined: {
        backgroundColor: colors.textLight,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    filled: {
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.sm,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
    },
});