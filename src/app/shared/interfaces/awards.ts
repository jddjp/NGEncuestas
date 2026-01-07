export interface Award {
    order?:number;
    uid?: string;
    name?: string;
    description?: string;
    date?: string;
    icon?:string;
   // vision?: string; // Optional field for FCM token
}