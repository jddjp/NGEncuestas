export interface Multimedia {
  id?: string;
  url: string | null;
  category: MultimediaCategory;
  type?: MultimediaType;
  description?: string; 
}

export type MultimediaCategory = 'photo' | 'video' | 'event';
export type MultimediaType = 'image' | 'video' | 'other';

export interface Category {
  id: MultimediaCategory;
  name: string;
  icon?: string;
}

export interface Event {
  id?: string;
  created_at: Date;
  cover_image_url: string;
  date: Date;
  description: string;
  location_name: string;
  status: string;
  title: string;
  type?: MultimediaType;
}

export interface Gallery {
  id?: string;
  description: string;
  url: string;
  type: MultimediaType;
  //date: Date;
}

export const MEDIA_CATEGORIES: Category[] = [
  { id: 'photo', name: 'Fotografías', icon: 'pi pi-image' },
  { id: 'video', name: 'Videos', icon: 'pi pi-video' },
  { id: 'event', name: 'Eventos', icon: 'pi pi-calendar' }
];