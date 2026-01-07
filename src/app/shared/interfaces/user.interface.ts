export interface User {
    uid: string;
    email: string;
    name: string;
    rol: string;
    token_notification_fcm?: string; // Optional field for FCM token
}