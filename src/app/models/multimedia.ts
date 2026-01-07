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
  description: string;
  url: string;
  type: MultimediaType;
}

export const MEDIA_CATEGORIES: Category[] = [
  { id: 'photo', name: 'Fotografías', icon: 'pi pi-image' },
  { id: 'video', name: 'Videos', icon: 'pi pi-video' },
  { id: 'event', name: 'Eventos', icon: 'pi pi-calendar' }
];