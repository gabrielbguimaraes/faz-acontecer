// FazAcontecer/src/components/common/Button/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { getButtonStyles } from './Button.styles';
import { spacing, colors } from '../../../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  icon,
}) => {
  const styles = getButtonStyles(variant, size, disabled || isLoading);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={styles.text.color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <View style={{ marginRight: spacing.sm }}>{icon}</View>}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};