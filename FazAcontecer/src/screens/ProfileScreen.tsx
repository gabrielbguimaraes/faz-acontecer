// FazAcontecer/src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Button } from '../components/common/Button';
import auth from '@react-native-firebase/auth';

export const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Tela de Perfil (Sprint 2)</Text>
    <View style={{ marginTop: 20 }}>
      <Button title="Sair (Logout)" onPress={() => auth().signOut()} variant="danger" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundDark },
  text: { color: colors.textLight, fontSize: 20 },
});