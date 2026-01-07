import { Award } from "./awards";

export interface Profile {
    uid: string;
    career: string;
    position: Award[];
    awards?: Award[];
    vision?: string; // Optional field for FCM token
}