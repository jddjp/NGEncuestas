import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getMessaging, onBackgroundMessage, isSupported } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

const app = initializeApp({
 
});

isSupported().then(isSupported => {

    if (isSupported) {
  
      const messaging = getMessaging(app);
  
      onBackgroundMessage(messaging, ({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
      });
  
    }
  
  });