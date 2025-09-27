// FazAcontecer/src/screens/LoginScreen.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { RootStackParamList } from '../navigation/AppNavigator'; 
import { Button } from '../components/common/Button';
import { colors, spacing } from '../theme';
import { useForm } from '../hooks/useForm';
import { AutenticarUsuarioUseCase } from '../domain/usecases/AutenticarUsuarioUseCase';
import { MockUserDataSource } from '../data/datasources/MockUserDataSource'; 
import { enableScreens } from 'react-native-screens';

// Assumindo que a logo está em src/assets/images/
const Logo = require('../assets/images/logo_faz_acontecer_transparente2.png');

enableScreens();

// ----------------------------------------------------------------------
// 1. Tipagem (Interface)
// ----------------------------------------------------------------------
// A interface herda as props nativas. Não precisa incluir onLoginSuccess aqui.
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// ----------------------------------------------------------------------
// 2. Configuração da Arquitetura (Injeção de Dependências - MOCK)
// ----------------------------------------------------------------------
const mockUserDataSource = new MockUserDataSource();
const autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(mockUserDataSource);


export const LoginScreen = ({ navigation, route }: LoginScreenProps) => { 
    // CORREÇÃO AQUI: A função é extraída de route.params, como um parâmetro da rota.
    // Usamos o 'as () => void' para dizer ao TypeScript o tipo da função que esperamos.
    const onLoginSuccess = route.params?.onLoginSuccess as () => void; 
    
    // Usando o hook de formulário
    const { values, handleChange } = useForm({
        email: '',
        password: '',
    });

    const handleLogin = async () => {
        try {
            await autenticarUsuarioUseCase.execute(values.email, values.password);
            
            // 3. Ação: Se o login for bem-sucedido, chama a função que altera o estado no AppNavigator
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                // Se a navegação falhar, voltamos para o Home (como fallback)
                navigation.navigate('Home'); 
            }
        } catch (error) {
            Alert.alert('Erro', (error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
            
            <View style={styles.formContainer}>
                {/* Input E-mail e Senha */}
                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.textSecondary} value={values.email} onChangeText={text => handleChange('email', text)} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.textSecondary} value={values.password} onChangeText={text => handleChange('password', text)} secureTextEntry />
                
                <Button title="Login" onPress={handleLogin} variant="primary" size="large" />

                <TouchableOpacity onPress={() => Alert.alert('Funcionalidade futura', 'Ainda será implementada.')}>
                    <Text style={styles.forgotPasswordText}>
                        Esqueceu sua senha?
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
                Powered by FATEC
            </Text>
        </View>
    );
};

// ... (Restante dos estilos StyleSheet.create)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark, // Fundo Escuro do tema
        alignItems: 'center',
        paddingTop: spacing.xl * 2, // Espaçamento para o topo
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: spacing.sm,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textLight, // Texto Claro no topo
        marginBottom: spacing.xl * 2,
    },
    formContainer: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: colors.surface, // Cinza claro (D9D9D9) para o fundo dos inputs
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
        color: colors.textDark, // Texto Escuro para a digitação
    },
    forgotPasswordText: {
        marginTop: spacing.md,
        fontSize: 14,
        color: colors.textSecondary, // Texto Cinza/Claro suave
        fontStyle: 'italic', // Adiciona o Itálico
    },
    footerText: {
        position: 'absolute',
        bottom: spacing.sm,
        fontSize: 12,
        color: colors.textSecondary,
    }
});