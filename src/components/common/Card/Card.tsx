import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '../../../theme';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';

    style?: StyleProp<ViewStyle>; 
}

export const Card: React.FC<CardProps> = ({
    title,
    children,
    variant = 'elevated',
    style,
}) => {
    return (
        // Aplique o estilo customizado junto aos estilos padrões
        <View style={[styles.card, styles[variant], style]}> 
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
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