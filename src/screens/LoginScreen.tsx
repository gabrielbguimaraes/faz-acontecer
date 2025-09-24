// FazAcontecer/src/screens/LoginScreen.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/common/Button';
import { colors, spacing } from '../theme';
import { useForm } from '../hooks/useForm';
import { AutenticarUsuarioUseCase } from '../domain/usecases/AutenticarUsuarioUseCase';
import { FirebaseUserDataSource } from '../data/datasources/FirebaseUserDataSource';

const firebaseUserDataSource = new FirebaseUserDataSource();
const autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(firebaseUserDataSource);

export const LoginScreen = () => {
    const { values, handleChange } = useForm({
        email: '',
        password: '',
    });

    const handleLogin = async () => {
        try {
            await autenticarUsuarioUseCase.execute(values.email, values.password);
            Alert.alert('Sucesso', 'Login realizado com sucesso!');
            // Navegar para a tela Home
        } catch (error) {
            Alert.alert('Erro', (error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>Faz Acontecer</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor={colors.gray}
                    value={values.email}
                    onChangeText={text => handleChange('email', text)}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={colors.gray}
                    value={values.password}
                    onChangeText={text => handleChange('password', text)}
                    secureTextEntry
                />
                <Button
                    title="Login"
                    onPress={handleLogin}
                    variant="primary"
                    size="medium"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: spacing.xl,
    },
    formContainer: {
        width: '100%',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: colors.light,
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
        marginBottom: spacing.md,
        color: colors.text,
    },
});