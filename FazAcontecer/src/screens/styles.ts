// FazAcontecer/src/screens/Home/styles.ts

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.xl * 2,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.backgroundDark,
    },
    dateText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    timeText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.md,
    },
    tasksContainer: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    tasksContentContainer: {
        paddingBottom: spacing.xl * 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: spacing.md,
    },
    // Estilo de cada item na lista (o "card" da tarefa)
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 10,
        marginBottom: spacing.sm,
        shadowColor: colors.textDark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    // ESTILO CORRIGIDO QUE FALTAVA
    taskContent: {
        flex: 1,
        marginRight: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    // ESTILO CORRIGIDO QUE FALTAVA
    priorityBar: {
        width: 4,
        height: '100%',
        marginRight: spacing.sm,
        borderRadius: 2,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },
    taskActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
    },
    taskTitleCompleted: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    taskTime: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    }
});