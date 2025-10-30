// FazAcontecer/src/components/common/Button/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getButtonStyles } from './Button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  // CORREÇÃO: Adicionada a variante 'danger'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
}) => {
  const styles = getButtonStyles(variant, size, disabled || isLoading);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={styles.text.color as string} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};