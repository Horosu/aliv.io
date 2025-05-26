import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

const EMOJIS = ['🙁', '😕', '😐', '🙂', '😄'];
const DESCRICOES = ['Muito Ruim', 'Ruim', 'Neutro', 'Bem', 'Muito Bem'];

export default function RegistrarHumor() {
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [media, setMedia] = useState(0);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const registrar = async () => {
    if (humorSelecionado === null) return;

    const novoRegistro = {
      data: new Date().toISOString().split('T')[0],
      valor: humorSelecionado + 1,
    };

    const historicoAtual = [...historico.filter(h => h.data !== novoRegistro.data), novoRegistro];
    setHistorico(historicoAtual);
    await AsyncStorage.setItem('@humor_historico', JSON.stringify(historicoAtual));
    calcularMedia(historicoAtual);

    Alert.alert('✅ Tudo certo!', 'Seu humor de hoje foi registrado.');
  };

  const carregarHistorico = async () => {
    const json = await AsyncStorage.getItem('@humor_historico');
    if (json) {
      const dados = JSON.parse(json);
      setHistorico(dados);
      calcularMedia(dados);
    }
  };

  const calcularMedia = (dados) => {
    const hoje = new Date();
    const ultimos7dias = dados.filter(item => {
      const data = new Date(item.data);
      const diff = (hoje - data) / (1000 * 60 * 60 * 24);
      return diff <= 6;
    });
    if (ultimos7dias.length > 0) {
      const soma = ultimos7dias.reduce((acc, item) => acc + item.valor, 0);
      setMedia(soma / ultimos7dias.length);
    } else {
      setMedia(0);
    }
  };

  const emojiMedia = media > 0 ? EMOJIS[Math.round(media) - 1] : '❓';
  const descricaoMedia = media > 0 ? DESCRICOES[Math.round(media) - 1] : 'Sem dados';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Como você está se sentindo hoje?</Text>

      <View style={styles.emojisContainer}>
        {EMOJIS.map((emoji, index) => (
          <Pressable
            key={index}
            style={[styles.emojiBtn, humorSelecionado === index && styles.emojiSelecionado]}
            onPress={() => setHumorSelecionado(index)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.botao} onPress={registrar}>
        <MaterialIcons name="check-circle" size={24} color="#fff" />
        <Text style={styles.botaoTexto}>Registrar Humor</Text>
      </Pressable>

      <View style={styles.semanaBox}>
        <Text style={styles.mediaTexto}>Humor da Semana</Text>
        <Progress.Bar
          progress={media / 5}
          width={null}
          height={12}
          color="#4CAF50"
          borderRadius={6}
          unfilledColor="#E0E0E0"
          borderWidth={0}
        />
        <Text style={styles.mediaValor}>Média: {media.toFixed(1)} / 5 — {emojiMedia} {descricaoMedia}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  emojisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  emojiBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  emojiSelecionado: {
    backgroundColor: '#E8F5E9',
  },
  emoji: {
    fontSize: 30,
  },
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 30,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  semanaBox: {
    marginTop: 'auto',
  },
  mediaTexto: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 8,
  },
  mediaValor: {
    fontSize: 14,
    marginTop: 6,
    color: '#4CAF50',
    textAlign: 'right',
  },
});
