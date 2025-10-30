// FazAcontecer/src/components/common/Button/Button.styles.ts

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing } from '../../../theme';
import { ButtonProps } from './Button';

export const getButtonStyles = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  disabled: boolean
) => {
  // CORREÇÃO: Definimos os tipos explicitamente
  const baseButton: ViewStyle = {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  };

  // CORREÇÃO: Definimos os tipos explicitamente
  const baseText: TextStyle = {
    fontSize: 16,
    fontWeight: 'bold', // 'bold' é um valor válido para fontWeight
  };

  // Size styles
  if (size === 'small') {
    baseButton.paddingVertical = spacing.sm;
    baseText.fontSize = 14;
  } else if (size === 'large') {
    baseButton.paddingVertical = spacing.lg;
    baseText.fontSize = 18;
  }

  // Variant styles
  let variantButton: ViewStyle = {};
  let variantText: TextStyle = {};

  switch (variant) {
    case 'secondary':
      variantButton = { backgroundColor: colors.secondary };
      variantText = { color: colors.textLight };
      break;
    case 'outline':
      variantButton = { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent' };
      variantText = { color: colors.primary };
      break;
    case 'danger':
      variantButton = { backgroundColor: colors.danger };
      variantText = { color: colors.textLight };
      break;
    case 'primary':
    default:
      variantButton = { backgroundColor: colors.primary };
      variantText = { color: colors.textLight };
      break;
  }

  const disabledStyle: ViewStyle = disabled ? { opacity: 0.5 } : {};

  return StyleSheet.create({
    button: { ...baseButton, ...variantButton, ...disabledStyle },
    text: { ...baseText, ...variantText },
  });
};