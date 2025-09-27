// FazAcontecer/src/screens/AddTaskScreen/AddTaskScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  // ... (estilos existentes: container, title, input, descriptionInput, buttonContainer)
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.textDark, // Alterado para texto escuro para contraste no fundo claro
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    height: 50,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  buttonContainer: {
    marginTop: 'auto', // Empurra o botão para o final da tela
    paddingTop: spacing.md,
  },
  // NOVOS ESTILOS
  pickerButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Faz com que os botões dividam o espaço
    marginHorizontal: spacing.sm,
  },
  pickerButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '500',
  }
});