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
