import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                styles[size],
                disabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, styles[`${variant}Text`]]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
        color: colors.white,
    },
    secondaryText: {
        color: colors.white,
    },
    outlineText: {
        color: colors.primary,
    },
});