import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Sessao() {
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([
    {
      id: '1',
      autor: 'ia',
      texto: 'Olá! Eu sou o Lume, estou aqui para te ouvir. Como está se sentindo hoje?'
    },
  ]);
  const [carregando, setCarregando] = useState(false);
  const flatListRef = useRef(null);

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const novaMensagem = { id: Date.now().toString(), autor: 'usuario', texto: mensagem };
    const novaConversa = [...conversa, novaMensagem];
    setConversa(novaConversa);
    setMensagem('');
    setCarregando(true);

    const historicoTexto = novaConversa
      .map(msg => `${msg.autor === 'usuario' ? 'Usuário' : 'IA'}: ${msg.texto}`)
      .join('\n');

    try {
      const resposta = await fetch('http://192.168.1.64:8000/conversar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: novaMensagem.texto,
          historico: historicoTexto,
        }),
      });

      const dados = await resposta.json();
      const respostaIA = {
        id: Date.now().toString() + '_ia',
        autor: 'ia',
        texto: dados.resposta || '...'
      };
      setConversa(prev => [...prev, respostaIA]);
    } catch (erro) {
      setConversa(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_erro',
          autor: 'ia',
          texto: 'Desculpe, algo deu errado ao tentar responder. 😔'
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.bolhaContainer, item.autor === 'usuario' ? styles.usuarioContainer : styles.iaContainer]}>
      {item.autor === 'ia' && (
        <Image
          source={require('../../assets/lume_icone.png')}
          style={styles.iaIcone}
        />
      )}
      <View style={[styles.bolha, item.autor === 'usuario' ? styles.bolhaUsuario : styles.bolhaIA]}>
        <Text style={styles.textoBolha}>{item.texto}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : StatusBar.currentHeight || 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flexContainer}>
            <FlatList
              ref={flatListRef}
              data={conversa}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.lista}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />

            {carregando && <ActivityIndicator size="small" color="#2E7D32" style={{ marginBottom: 8 }} />}

            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChangeText={setMensagem}
                placeholderTextColor="#888"
              />
              <Pressable style={styles.botao} onPress={enviarMensagem} disabled={carregando}>
                <MaterialIcons name="send" size={24} color="#fff" />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexContainer: {
    flex: 1,
  },
  lista: {
    padding: 16,
    paddingBottom: 80,
  },
  bolhaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  iaContainer: {
    justifyContent: 'flex-start',
  },
  usuarioContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  bolha: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bolhaUsuario: {
    backgroundColor: '#C8E6C9',
    alignSelf: 'flex-end',
  },
  bolhaIA: {
    backgroundColor: '#F1F8E9',
    alignSelf: 'flex-start',
  },
  textoBolha: {
    fontSize: 16,
    color: '#2E7D32',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 10,
    color: '#2E7D32',
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
  },
  iaIcone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 8,
    resizeMode: 'cover',
  },
});
