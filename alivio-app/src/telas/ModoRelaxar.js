import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const musicas = [
  { nome: 'Piano Calmo', arquivo: require('../../assets/musicas/musica1.mp3') },
  { nome: 'Natureza Suave', arquivo: require('../../assets/musicas/musica2.mp3') },
  { nome: 'Lo-fi Tranquilo', arquivo: require('../../assets/musicas/musica3.mp3') },
];

const frases = [
  'Você está seguro aqui.',
  'Respire... está tudo bem.',
  'Um passo de cada vez.',
  'Seu bem-estar importa.',
  'Estou com você agora.',
];

export default function ModoRelaxar({ navigation }) {
  const [som, setSom] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [musicaAtual, setMusicaAtual] = useState(musicas[0]);
  const [fraseAtual, setFraseAtual] = useState(frases[0]);
  const [modoEscuro, setModoEscuro] = useState(false);
  const animacao = useRef(null);
  const clickSound = useRef(null);

  useEffect(() => {
    tocarMusica(musicaAtual.arquivo);
    animacao.current?.play();
    carregarClick();

    const trocaFrases = setInterval(() => {
      const proxima = frases[Math.floor(Math.random() * frases.length)];
      setFraseAtual(proxima);
    }, 5000);

    return () => {
      clearInterval(trocaFrases);
    };
  }, [musicaAtual]);

  async function tocarMusica(arquivo) {
    if (som) {
      const status = await som.getStatusAsync();
      if (status.isLoaded) {
        await som.unloadAsync();
      }
    }
    const { sound } = await Audio.Sound.createAsync(arquivo);
    setSom(sound);
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function carregarClick() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/click.mp3')
    );
    clickSound.current = sound;
  }

  const alternarModo = async () => {
    if (clickSound.current) await clickSound.current.replayAsync();
    setModoEscuro((prev) => !prev);
  };

  const pausarOuTocar = async () => {
    if (!som) return;
    const status = await som.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await som.pauseAsync();
      setIsPlaying(false);
    } else {
      await som.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, modoEscuro && styles.containerEscuro]}
    >
      <View style={styles.conteudo}>
        <LottieView
          ref={animacao}
          source={require('../../assets/animacoes/respirar.json')}
          loop
          style={styles.respiracao}
        />

        <Text style={[styles.frase, modoEscuro && styles.fraseEscura]}>
          {fraseAtual}
        </Text>

        <FlatList
          data={musicas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.botaoMusica,
                musicaAtual.nome === item.nome && styles.selecionado,
              ]}
              onPress={() => setMusicaAtual(musicas[index])}
            >
              <Text style={styles.textoMusica}>{item.nome}</Text>
            </Pressable>
          )}
        />

        <Pressable style={styles.pauseBtn} onPress={pausarOuTocar}>
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
            color="#ffffff"
          />
        </Pressable>

        {/* icone do abajur */}
        <Pressable onPress={alternarModo} style={styles.abajurContainer}>
          <MaterialCommunityIcons
            name="lamp"
            size={64}
            color={modoEscuro ? '#B0BEC5' : '#FFC107'}
          />
        </Pressable>
      </View>

      {/* filtro escuro */}
      {modoEscuro && <View style={styles.filtroEscuro} />}

      <Pressable style={styles.sair} onPress={() => navigation.goBack()}>
        <Text style={styles.sairTexto}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerEscuro: {
    backgroundColor: '#263238',
  },
  conteudo: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 1,
  },
  respiracao: {
    width: 200,
    height: 200,
  },
  frase: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2E7D32',
    textAlign: 'center',
    marginVertical: 20,
  },
  fraseEscura: {
    color: '#B0BEC5',
  },
  botaoMusica: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#C8E6C9',
    borderRadius: 12,
    width: 220,
    alignItems: 'center',
  },
  textoMusica: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '600',
  },
  selecionado: {
    backgroundColor: '#81C784',
  },
  pauseBtn: {
    marginTop: 20,
    backgroundColor: '#81C784',
    padding: 12,
    borderRadius: 24,
  },
  sair: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  sairTexto: {
    color: '#388E3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  abajurContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  filtroEscuro: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 0,
  },
});
