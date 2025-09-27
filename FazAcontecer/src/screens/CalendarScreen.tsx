// FazAcontecer/src/screens/CalendarScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export const CalendarScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Tela de Calendário (Sprint 2)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundDark },
  text: { color: colors.textLight, fontSize: 20 },
});