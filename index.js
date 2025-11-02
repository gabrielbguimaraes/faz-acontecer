// FazAcontecer/index.js

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


async function setupNotificationChannel() {
  try {
    console.log('[Notifee] Tentando criar o canal "implacable_alarm" com som...');
    

    await notifee.createChannel({
      id: 'implacable_alarm',
      name: 'Alarmes Implacáveis',
      sound: 'alarm',
      vibration: true,
      vibrationPattern: [300, 500],
      importance: AndroidImportance.HIGH,
      loopSound: true,
    });

    console.log('[Notifee] Canal "implacable_alarm" com som criado com SUCESSO!');

  } catch (error) {
    console.error('[Notifee] FALHA ao criar canal com som:', error);
    console.warn('[Notifee] Criando canal de fallback sem som. Verifique seu arquivo "alarm.mp3" em "android/app/src/main/res/raw"');

    // Se falhar (ex: som não encontrado), cria um canal de fallback SEM SOM
    // para que o app não quebre (como aconteceu na sua imagem).
    await notifee.createChannel({
      id: 'implacable_alarm',
      name: 'Alarmes Implacáveis (Sem Som)',
      vibration: true,
      importance: AndroidImportance.HIGH,
      loopSound: false,
    });
  }
}

// Cria o canal assim que o app é carregado
setupNotificationChannel();

// Listener para eventos em background (quando o app está fechado)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Usuário pressionou a ação "Confirmar"
  if (type === EventType.ACTION_PRESS && pressAction.id === 'confirm') {
    if (notification.id) {
      // Para o alarme
      await notifee.cancelNotification(notification.id);
    }
  }
});

// --- FIM DA CONFIGURAÇÃO ---

AppRegistry.registerComponent(appName, () => App);