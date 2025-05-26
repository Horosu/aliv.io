import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  PanResponder,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

export default function CuidarDoLume() {
  const [fome, setFome] = useState(80);
  const [sono, setSono] = useState(40);
  const [carinho, setCarinho] = useState(50);
  const [moedas, setMoedas] = useState(0);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [hamburguerAtivo, setHamburguerAtivo] = useState(false);
  const [emojiReacao, setEmojiReacao] = useState(null);
  const entradaAnim = useRef(new Animated.Value(300)).current;
  const escalaLume = useRef(new Animated.Value(1)).current;
  const hambPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lumeArea = useRef(null);

  const somCarinho = useRef(null);
  const somComida = useRef(null);
  const somClick = useRef(null);

  useEffect(() => {
    const carregarSons = async () => {
      try {
        const { sound: carinhoSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/carinho.mp3')
        );
        somCarinho.current = carinhoSound;

        const { sound: comidaSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/comida.mp3')
        );
        somComida.current = comidaSound;

        const { sound: clickSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/click.mp3')
        );
        somClick.current = clickSound;
      } catch (erro) {
        console.error('Erro ao carregar sons', erro);
      }
    };

    carregarSons();

    return () => {
      somCarinho.current?.unloadAsync();
      somComida.current?.unloadAsync();
      somClick.current?.unloadAsync();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => gestureState.numberActiveTouches === 1,
      onPanResponderGrant: () => {
        hambPos.setOffset({ x: hambPos.x._value, y: hambPos.y._value });
        hambPos.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: hambPos.x, dy: hambPos.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: async (_, gesture) => {
        hambPos.flattenOffset();
        lumeArea.current?.measure((fx, fy, width, height, px, py) => {
          if (
            gesture.moveY > py &&
            gesture.moveY < py + height &&
            gesture.moveX > px &&
            gesture.moveX < px + width
          ) {
            setFome((prev) => Math.min(prev + 20, 100));
            mostrarEmoji('✨');
            animarReacao();
            if (somComida.current) {
              somComida.current.stopAsync();
              somComida.current.setPositionAsync(0);
              somComida.current.playAsync();
            }
          }
          Animated.spring(hambPos, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
          setHamburguerAtivo(false);
        });
      },
    })
  ).current;

  const animarReacao = () => {
    Animated.sequence([
      Animated.timing(escalaLume, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(escalaLume, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mostrarEmoji = (emoji) => {
    setEmojiReacao(emoji);
    setTimeout(() => setEmojiReacao(null), 1200);
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(entradaAnim, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(entradaAnim, {
        toValue: 10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(entradaAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let intervalo;
    if (modoEscuro) {
      intervalo = setInterval(() => {
        setSono((prev) => Math.min(prev + 1, 100));
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [modoEscuro]);

  const darCarinho = async () => {
    setCarinho((prev) => Math.min(prev + 10, 100));
    mostrarEmoji('💖');
    animarReacao();
    if (somCarinho.current) {
      somCarinho.current.stopAsync();
      somCarinho.current.setPositionAsync(0);
      somCarinho.current.playAsync();
    }
  };

  const alternarLuz = async () => {
    setModoEscuro((prev) => !prev);
    if (somClick.current) {
      await somClick.current.setPositionAsync(0);
      await somClick.current.playAsync();
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/imagens/quarto_lume.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <Animated.View style={{ transform: [{ translateX: entradaAnim }] }}>
          <View style={styles.topo}>
            <View style={styles.moedasContainer}>
              <Text style={styles.moedaIcon}>🪙</Text>
              <Text style={styles.moedasTexto}>{moedas}</Text>
            </View>
            <Pressable>
              <MaterialIcons name="shopping-cart" size={22} color="#B0BEC5" />
            </Pressable>
          </View>

          <View style={styles.barrasContainerCompacto}>
            <Barra titulo="Fome" valor={fome} cor="#FF7043" />
            <Barra titulo="Sono" valor={sono} cor="#4FC3F7" />
            <Barra titulo="Carinho" valor={carinho} cor="#81C784" />
          </View>

          <View style={styles.acoesContainer}>
            <Pressable onPress={() => setHamburguerAtivo(true)}>
              <Text style={styles.emojiHamburguer}>🍔</Text>
            </Pressable>

            <Pressable onPress={alternarLuz}>
              <MaterialIcons
                name="lightbulb"
                size={34}
                color={modoEscuro ? '#B0BEC5' : '#FFC107'}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={darCarinho}
            ref={lumeArea}
            style={styles.lumeContainer}
          >
            <Animated.View style={{ transform: [{ scale: escalaLume }] }}>
              <LottieView
                source={require('../../assets/animacoes/lume.json')}
                autoPlay
                loop
                style={styles.lumeAnimacaoGrande}
              />
              {emojiReacao && (
                <Animated.Text style={styles.reacaoEmoji}>{emojiReacao}</Animated.Text>
              )}
            </Animated.View>
            <Text style={styles.toqueTexto}>Toque para dar carinho</Text>
          </Pressable>

          {hamburguerAtivo && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.dragItem, {
                transform: [{ translateX: hambPos.x }, { translateY: hambPos.y }]
              }]}
            >
              <Text style={styles.emojiHamburguer}>🍔</Text>
            </Animated.View>
          )}
        </Animated.View>
      </SafeAreaView>
      {modoEscuro && <Pressable style={styles.filtroEscuro} onPress={alternarLuz} />}
    </ImageBackground>
  );
}

function Barra({ titulo, valor, cor }) {
  return (
    <View style={styles.barraContainer}>
      <Text style={styles.barraTitulo}>{titulo}</Text>
      <View style={styles.barraBase}>
        <View style={[styles.barraInterna, { width: `${valor}%`, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 16,
  },
  filtroEscuro: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 99,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  moedasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moedaIcon: {
    fontSize: 20,
  },
  moedasTexto: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FFB300',
    fontWeight: 'bold',
  },
  lumeContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 60,
    zIndex: 2,
  },
  lumeAnimacaoGrande: {
    width: 280,
    height: 280,
  },
  toqueTexto: {
    fontSize: 14,
    color: '#37474F',
    marginTop: 8,
  },
  barrasContainerCompacto: {
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    zIndex: 2,
  },
  barraContainer: {
    marginBottom: 10,
  },
  barraTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#37474F',
  },
  barraBase: {
    width: '100%',
    height: 12,
    backgroundColor: '#CFD8DC',
    borderRadius: 9,
    overflow: 'hidden',
  },
  barraInterna: {
    height: '100%',
    borderRadius: 9,
  },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 60,
    zIndex: 2,
  },
  dragItem: {
    position: 'absolute',
    left: 100,
    bottom: 80,
    zIndex: 99,
  },
  emojiHamburguer: {
    fontSize: 36,
  },
  reacaoEmoji: {
    fontSize: 36,
    position: 'absolute',
    alignSelf: 'center',
    top: -20,
  },
});
