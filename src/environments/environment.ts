export const environment = {
  projectId: process.env['PROJECT_ID'] || 'default-project-id',
  appId: process.env['APP_ID'] || 'default-app-id',
  storageBucket: process.env['STORAGE_BUCKET'] || 'default-storage-bucket',
  apiKey: process.env['API_KEY'] || 'default-api-key',
  authDomain: process.env['AUTH_DOMAIN'] || 'default-auth-domain',
  messagingSenderId: process.env['MESSAGING_SENDER_ID'] || 'default-messaging-sender-id',
};
