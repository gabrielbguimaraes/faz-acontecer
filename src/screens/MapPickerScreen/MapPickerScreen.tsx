// FazAcontecer/src/screens/MapPickerScreen/MapPickerScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Text, PermissionsAndroid, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // <-- Importa o PROVIDER_GOOGLE
import Geolocation from 'react-native-geolocation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Button } from '../../components/common/Button';
import { colors, spacing } from '../../theme';
import { Localizacao } from '../../domain/entities/tarefa';
import Icon from 'react-native-vector-icons/MaterialIcons';

type MapPickerProps = NativeStackScreenProps<RootStackParamList, 'MapPicker'>;

export const MapPickerScreen: React.FC<MapPickerProps> = ({ navigation, route }) => {
  const [region, setRegion] = useState({
    latitude: -23.1791, // Padrão: São José dos Campos
    longitude: -45.8872,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isMapReady, setIsMapReady] = useState(false);

  // Pede permissão de GPS
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Pega a localização atual do usuário (usa o sensor GPS)
  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted) {
        Geolocation.getCurrentPosition(
          position => {
            const currentRegion = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01, // Zoom mais próximo
              longitudeDelta: 0.01,
            };
            setRegion(currentRegion);
            setIsMapReady(true);
          },
          error => {
            console.log(error.code, error.message);
            Alert.alert("Erro no GPS", "Não foi possível pegar sua localização atual. Usando localização padrão.");
            setIsMapReady(true);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        Alert.alert("Permissão Negada", "Usando localização padrão.");
        setIsMapReady(true);
      }
    });
  }, []);

  // Envia a localização selecionada de volta para a AddTaskScreen
  const handleConfirmLocation = () => {
    const local: Localizacao = {
      latitude: region.latitude,
      longitude: region.longitude,
      raio: 500, // Raio padrão de 500m
    };
    route.params.onLocationSelect(local);
    navigation.goBack();
  };

  if (!isMapReady) {
    // Tela de loading enquanto o GPS procura a localização inicial
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.instructions}>Procurando sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // <-- USA O GOOGLE MAPS
        style={styles.map}
        initialRegion={region} // Começa na localização do usuário
        onRegionChangeComplete={setRegion} // Atualiza a 'region' quando o usuário mexe o mapa
      >
        {/* O <UrlTile> do OpenStreetMap foi REMOVIDO */}
      </MapView>

      {/* Ícone de pino fixo no centro da tela */}
      <View style={styles.markerFixed}>
         <Icon name="location-pin" size={40} color={colors.danger} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.instructions}>Mova o mapa para definir o local</Text>
        <Button title="Confirmar Localização" onPress={handleConfirmLocation} variant="primary" />
        <View style={{ marginTop: spacing.sm }} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
  },
  buttonContainer: {
    padding: spacing.lg,
    width: '100%',
    backgroundColor: colors.backgroundDark,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  instructions: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: spacing.md,
  },
  markerFixed: {
    // Posiciona o pino no centro da tela, em cima do MapView
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12, // Metade do tamanho do ícone (aprox.)
    marginTop: -40, // Quase metade da altura do ícone
  },
});