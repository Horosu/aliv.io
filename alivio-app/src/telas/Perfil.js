import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../servicos/api';

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState({ nome: '', email: '', foto: null });
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await api.get('/usuarios/me');
        setUsuario(resposta.data);

        if (resposta.data.foto_perfil || resposta.data.fotoPerfil) {
          setImagem(resposta.data.foto_perfil || resposta.data.fotoPerfil);
        }
      } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
      }
    }

    carregarUsuario();
  }, []);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      const formData = new FormData();

      formData.append('arquivo', {
        uri: asset.uri,
        name: 'foto.jpg',
        type: 'image/jpeg',
      });

      try {
        const token = await AsyncStorage.getItem('token');

        const resposta = await fetch('http://192.168.1.67:8000/usuarios/foto', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const dados = await resposta.json();

        if (resposta.ok) {
          setImagem(dados.fotoPerfil);
        } else {
          console.error('Erro ao salvar imagem:', dados);
          Alert.alert('Erro', dados.detail || 'Não foi possível enviar a foto.');
        }
      } catch (erro) {
        console.error('Erro ao enviar imagem:', erro);
        Alert.alert('Erro', 'Falha na comunicação com o servidor.');
      }
    }
  };

  const sair = () => {
    Alert.alert('Logout', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topo}>
          <Pressable onPress={escolherFoto}>
            <Image
              source={
                imagem
                  ? { uri: imagem }
                  : require('../../assets/avatar_padrao.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.trocarFoto}>Trocar Foto</Text>
          </Pressable>
          <Text style={styles.nome}>
            {(usuario.nome?.split(' ')[0]) || 'Usuário'}
          </Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Seu Progresso</Text>
          <View style={styles.linha}>
            <MaterialIcons name="mood" size={24} color="#2E7D32" />
            <Text style={styles.info}>Humores registrados: 14</Text>
          </View>
          <View style={styles.linha}>
            <MaterialIcons name="calendar-today" size={24} color="#2E7D32" />
            <Text style={styles.info}>Dias consecutivos ativos: 5</Text>
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Configurações</Text>
          <Pressable style={styles.linha} onPress={sair}>
            <MaterialIcons name="logout" size={24} color="#C62828" />
            <Text style={[styles.info, { color: '#C62828' }]}>Sair da conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#E6F4EA',
  },
  scroll: {
    padding: 24,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#A5D6A7',
  },
  trocarFoto: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    color: '#5F705E',
  },
  secao: {
    marginBottom: 32,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginLeft: 12,
    color: '#2E7D32',
  },
});
