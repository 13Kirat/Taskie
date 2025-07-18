import React, { useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import {
    TextInput,
    Button,
    Title,
    Paragraph,
    Snackbar
} from 'react-native-paper';
import { AuthContext } from './context/AuthContext';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);

    const router = useRouter();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            setVisible(true);
            return;
        }

        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.message);
                setVisible(true);
            }
            if (!!result.success) {
                router.replace("/HomeScreen")
            }
        } catch (error) {
            setError('An error occurred during login');
            setVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/images/login.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Title style={styles.title}>Task Manager</Title>
                <Paragraph style={styles.subtitle}>Login to manage your tasks</Paragraph>

                <View style={styles.formContainer}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        contentStyle={{ color: "#000" }}
                        keyboardType="email-address"
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        style={styles.input}
                        contentStyle={{ color: "#000" }}
                        secureTextEntry
                    />

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        loading={loading}
                        disabled={loading}
                        customButtonColor="#fff"
                        customTextColor="#000"
                        dark='true'
                    >
                        Login
                    </Button>
                </View>

                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    duration={3000}
                >
                    {error}
                </Snackbar>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#000"
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: "#000"
    },
    formContainer: {
        width: '100%',
    },
    input: {
        marginBottom: 15,
        backgroundColor: "#fff",
        color: "#000"
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
        backgroundColor:"#aaaaaa",
    },
});

export default LoginScreen;
