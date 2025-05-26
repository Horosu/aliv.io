import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaLogin from '../telas/Login';
import Tabs from './Tabs';
import RegistrarHumor from '../telas/RegistrarHumor';
import Registrar from '../telas/Registrar';
import Sessao from '../telas/sessao';
import ModoRelaxar from '../telas/ModoRelaxar';
import Lume from '../telas/Lume';

const Stack = createNativeStackNavigator();

export default function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Registrar" component={Registrar} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="RegistrarHumor" component={RegistrarHumor} />
        <Stack.Screen name="sessao" component={Sessao} />
        <Stack.Screen name="Lume" component={Lume} />
        <Stack.Screen name="ModoRelaxar" component={ModoRelaxar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
