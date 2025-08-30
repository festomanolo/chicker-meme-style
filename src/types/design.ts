export interface DesignElement {
  id: string;
  type: "text" | "template" | "image" | "sticker";
  content?: string;
  template?: {
    id: string;
    name: string;
    preview: string;
    category: string;
  };
  imageUrl?: string;
  font?: string;
  size?: number;
  color?: string;
  x: number;
  y: number;
  rotation: number;
  width?: number;
  height?: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface HistoryState {
  elements: DesignElement[];
  selectedElement: string | null;
  timestamp: number;
}

export interface TshirtColor {
  name: string;
  value: string;
  hex: string;
}

export interface TshirtType {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  shape: string;
}

export interface Template {
  id: string;
  name: string;
  preview: string;
  category: string;
}

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
}

export interface StickerPack {
  id: string;
  name: string;
  icon: string;
  stickers: Sticker[];
}