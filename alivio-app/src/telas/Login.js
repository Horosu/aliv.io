import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../servicos/api';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async () => {
    console.log('🔒 Botão de login pressionado');

    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha');
      return;
    }

    try {
      const resposta = await api.post(
        '/usuarios/entrar',
        new URLSearchParams({
          username: email,
          password: senha,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token = resposta.data.token;
      console.log('✅ Token recebido:', token);

      // salva o token para uso global
      await AsyncStorage.setItem('token', token);

      navigation.replace('Tabs');
    } catch (erro) {
      console.error('❌ Erro ao fazer login:', erro);
      Alert.alert('Erro ao entrar', 'Verifique seu e-mail e senha');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#E6F4EA', '#FFFFFF']} style={styles.container}>
        <View style={styles.topo}>
          <LottieView
            source={require('../../assets/animacoes/alivio_logo.json')}
            autoPlay
            loop={false}
            style={styles.animacao}
          />
          <Text style={styles.titulo}>Bem-vindo ao Aliv.io 💚</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexivel}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0) + 64}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="#2E7D32" />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#5F705E"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#2E7D32" />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  secureTextEntry
                  onChangeText={setSenha}
                  value={senha}
                  placeholderTextColor="#5F705E"
                />
              </View>

              <Pressable style={styles.botao} onPress={fazerLogin}>
                <Text style={styles.botaoTexto}>Entrar</Text>
              </Pressable>

              <Pressable style={{ marginTop: 16 }} onPress={() => navigation.navigate('Registrar')}>
                <Text style={{ textAlign: 'center', color: '#2E7D32' }}>
                  Não tem conta? Criar agora
                </Text>
              </Pressable>

              <Text style={styles.fraseRodape}>
                “Seu cuidado começa aqui.”
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topo: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 40,
  },
  animacao: {
    width: 200,
    height: 200,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E7D32',
  },
  flexivel: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#2E7D32',
    marginLeft: 8,
  },
  botao: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fraseRodape: {
    marginTop: 24,
    textAlign: 'center',
    color: '#5F705E',
    fontStyle: 'italic',
  },
});
