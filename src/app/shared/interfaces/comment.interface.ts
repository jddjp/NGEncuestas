export interface Comment {
  id?: string;
  text: string;
  author: string;
  createdAt: Date | firebase.default.firestore.Timestamp;
  email?: string; 
  isEdited?: boolean;  
}