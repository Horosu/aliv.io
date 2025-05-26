import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animarEIrParaLume = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Lume');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* espaço fantasmas*/}
      <View style={{ height: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 40 }} />

      {/* Botão SOS Modo Relaxar */}
      <Pressable
        style={styles.sosBotao}
        onPress={() => navigation.navigate('ModoRelaxar')}
      >
        <MaterialIcons name="spa" size={26} color="#ffffff" />
      </Pressable>

      {/* Conteúdo central */}
      <View style={styles.centro}>
        <Pressable onPress={animarEIrParaLume}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LottieView
              source={require('../../assets/animacoes/lume.json')}
              autoPlay
              loop
              style={styles.animacao}
            />
          </Animated.View>
        </Pressable>

        <Text style={styles.boasVindas}>
          Olá! Eu sou o Lume. Bem-vindo ao Aliv.io 💚
        </Text>

        <Pressable style={styles.card} onPress={() => navigation.navigate('sessao')}>
          <MaterialIcons name="self-improvement" size={28} color="#2E7D32" />
          <Text style={styles.cardTexto}>Começar Sessão</Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => navigation.navigate('RegistrarHumor')}>
          <MaterialIcons name="mood" size={28} color="#2E7D32" />
          <Text style={styles.cardTexto}>Registrar Humor</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animacao: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  boasVindas: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTexto: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#2E7D32',
  },
  sosBotao: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
    right: 24,
    backgroundColor: '#66BB6A',
    borderRadius: 30,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
