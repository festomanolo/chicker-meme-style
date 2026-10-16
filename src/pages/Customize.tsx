import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Undo2,
  Redo2,
  Download,
  ShoppingCart,
  Type,
  Sticker,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Save,
  FolderOpen,
  MessageCircle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { products } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { createPrintReadyBlob } from "@/lib/offscreenExport";

export interface CustomCanvasLayer {
  id: string;
  view: "front" | "back";
  type: "text" | "sticker" | "image";
  name: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  strokeColor?: string;
  uppercase?: boolean;
  visible: boolean;
  locked: boolean;
}

interface GarmentStyle {
  id: "regular" | "heavyweight" | "hoodie" | "tank";
  name: string;
  price: number;
  badge: string;
}

const GARMENT_STYLES: GarmentStyle[] = [
  { id: "regular", name: "Classic Crew Tee", price: 25000, badge: "200 GSM" },
  { id: "heavyweight", name: "Heavyweight Boxy Tee", price: 30000, badge: "240 GSM" },
  { id: "hoodie", name: "Pullover Street Hoodie", price: 45000, badge: "350 GSM" },
  { id: "tank", name: "Summer Beach Tank", price: 20000, badge: "160 GSM" },
];

const GARMENT_COLORS = [
  { name: "White", hex: "#FFFFFF", textDefault: "#111827" },
  { name: "Black", hex: "#18181B", textDefault: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A8A", textDefault: "#FFFFFF" },
  { name: "Heather Gray", hex: "#9CA3AF", textDefault: "#111827" },
  { name: "Charcoal", hex: "#374151", textDefault: "#FFFFFF" },
  { name: "Crimson Red", hex: "#DC2626", textDefault: "#FFFFFF" },
  { name: "Royal Blue", hex: "#2563EB", textDefault: "#FFFFFF" },
  { name: "Forest Green", hex: "#059669", textDefault: "#FFFFFF" },
  { name: "Cyber Yellow", hex: "#FACC15", textDefault: "#111827" },
  { name: "Violet", hex: "#7C3AED", textDefault: "#FFFFFF" },
  { name: "Sunset Orange", hex: "#EA580C", textDefault: "#FFFFFF" },
  { name: "Teal", hex: "#0D9488", textDefault: "#FFFFFF" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const FONTS = [
  "Impact",
  "Arial Black",
  "Helvetica",
  "Comic Sans MS",
  "Georgia",
  "Courier New",
  "Trebuchet MS",
];

const MEME_TEMPLATES = [
  {
    id: "t1",
    title: "Deploy on Friday",
    topText: "DEPLOYING ON FRIDAY",
    bottomText: "WHAT COULD GO WRONG?",
    emoji: "🔥",
  },
  {
    id: "t2",
    title: "When WiFi Drops",
    topText: "WIFI DROPPED FOR 5 SECONDS",
    bottomText: "TIME TO TOUCH GRASS",
    emoji: "🐱",
  },
  {
    id: "t3",
    title: "Hakuna Stress",
    topText: "HAKUNA MATATA",
    bottomText: "POA SANA VIBES ONLY",
    emoji: "🌴",
  },
  {
    id: "t4",
    title: "Deadline Panic",
    topText: "DEADLINE IN 10 MINUTES",
    bottomText: "STILL CHOOSING THE FONT",
    emoji: "💀",
  },
  {
    id: "t5",
    title: "Stonks Rising",
    topText: "BOUGHT MEME TEE",
    bottomText: "DRIP LEVEL +1000%",
    emoji: "📈",
  },
  {
    id: "t6",
    title: "Code Works",
    topText: "MY CODE WORKS",
    bottomText: "AND I HAVE NO IDEA WHY",
    emoji: "🧠",
  },
];

const STICKERS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "💀", label: "Skull" },
  { emoji: "🗿", label: "Moai" },
  { emoji: "🐸", label: "Frog" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "👑", label: "Crown" },
  { emoji: "💯", label: "100" },
  { emoji: "🦁", label: "Simba" },
  { emoji: "🌴", label: "Dar Vibes" },
  { emoji: "☕", label: "Kahawa" },
  { emoji: "⚡", label: "Umeme" },
  { emoji: "😎", label: "Cool" },
  { emoji: "🤡", label: "Clown" },
  { emoji: "📈", label: "Stonks" },
  { emoji: "🤯", label: "Mind Blown" },
];

const Customize: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  const [garmentStyle, setGarmentStyle] = useState<GarmentStyle>(GARMENT_STYLES[0]);
  const [garmentColor, setGarmentColor] = useState(GARMENT_COLORS[1]); // Black default
  const [selectedSize, setSelectedSize] = useState("L");
  const [currentView, setCurrentView] = useState<"front" | "back">("front");
  const [zoom, setZoom] = useState(1);

  const [layers, setLayers] = useState<CustomCanvasLayer[]>([
    {
      id: "initial-text",
      view: "front",
      type: "text",
      name: "Top Meme Text",
      content: "HAKUNA STRESS",
      x: 150,
      y: 120,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      fontSize: 28,
      fontFamily: "Impact",
      color: "#FFFFFF",
      strokeColor: "#000000",
      uppercase: true,
      visible: true,
      locked: false,
    },
    {
      id: "initial-sticker",
      view: "front",
      type: "sticker",
      name: "Fire Sticker",
      content: "🔥",
      x: 215,
      y: 185,
      width: 70,
      height: 70,
      rotation: 0,
      opacity: 1,
      fontSize: 56,
      visible: true,
      locked: false,
    },
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>("initial-text");
  const [history, setHistory] = useState<CustomCanvasLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // New text input state
  const [newText, setNewText] = useState("BOTTOM TEXT");
  const [newFont, setNewFont] = useState("Impact");
  const [newColor, setNewColor] = useState("#FACC15");

  // Dragging state & snap guides
  const printAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapGuide, setSnapGuide] = useState<{ vertical: boolean; horizontal: boolean }>({
    vertical: false,
    horizontal: false,
  });

  // Push to undo/redo history
  const pushHistory = useCallback(
    (nextLayers: CustomCanvasLayer[]) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced.slice(-30), nextLayers];
      });
      setHistoryIndex((idx) => Math.min(30, idx + 1));
    },
    [historyIndex]
  );

  // Initialize history or preload product from ?product=<id>
  useEffect(() => {
    const prodId = searchParams.get("product");
    if (prodId) {
      const found = products.find((p) => p.id === prodId);
      if (found) {
        if (found.category === "hoodies") setGarmentStyle(GARMENT_STYLES[2]);
        else if (found.category === "tanks") setGarmentStyle(GARMENT_STYLES[3]);
        else setGarmentStyle(GARMENT_STYLES[0]);

        const preloadLayers: CustomCanvasLayer[] = [
          {
            id: `prod-img-${found.id}`,
            view: "front",
            type: "image",
            name: found.name,
            content: found.image,
            x: 140,
            y: 110,
            width: 220,
            height: 220,
            rotation: 0,
            opacity: 1,
            visible: true,
            locked: false,
          },
          {
            id: `prod-caption-${found.id}`,
            view: "front",
            type: "text",
            name: "Custom Caption",
            content: found.name.toUpperCase().slice(0, 22),
            x: 130,
            y: 345,
            width: 240,
            height: 45,
            rotation: 0,
            opacity: 1,
            fontSize: 22,
            fontFamily: "Impact",
            color: "#FFFFFF",
            strokeColor: "#000000",
            uppercase: true,
            visible: true,
            locked: false,
          },
        ];
        setLayers(preloadLayers);
        setSelectedLayerId(preloadLayers[1].id);
        setHistory([preloadLayers]);
        setHistoryIndex(0);
        return;
      }
    }
    setHistory([layers]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateLayers = useCallback(
    (updater: (prev: CustomCanvasLayer[]) => CustomCanvasLayer[], recordHistory = true) => {
      setLayers((prev) => {
        const next = updater(prev);
        if (recordHistory) {
          pushHistory(next);
        }
        return next;
      });
    },
    [pushHistory]
  );

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;
  const viewLayers = layers.filter((l) => l.view === currentView);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setLayers(history[nextIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setLayers(history[nextIdx]);
    }
  };

  const updateSelectedLayer = (updates: Partial<CustomCanvasLayer>, recordHistory = true) => {
    if (!selectedLayerId) return;
    updateLayers(
      (prev) => prev.map((l) => (l.id === selectedLayerId ? { ...l, ...updates } : l)),
      recordHistory
    );
  };

  const handleAddText = () => {
    if (!newText.trim()) return;
    const id = `text_${Date.now()}`;
    const layer: CustomCanvasLayer = {
      id,
      view: currentView,
      type: "text",
      name: `Text: ${newText.slice(0, 14)}`,
      content: newText,
      x: 140,
      y: 160 + (viewLayers.length % 4) * 35,
      width: 220,
      height: 50,
      rotation: 0,
      opacity: 1,
      fontSize: 26,
      fontFamily: newFont,
      color: newColor,
      strokeColor: "#000000",
      uppercase: true,
      visible: true,
      locked: false,
    };
    updateLayers((prev) => [...prev, layer]);
    setSelectedLayerId(id);
  };

  const handleAddSticker = (emoji: string, label: string) => {
    const id = `sticker_${Date.now()}`;
    const layer: CustomCanvasLayer = {
      id,
      view: currentView,
      type: "sticker",
      name: `${label} Sticker`,
      content: emoji,
      x: 205 + ((viewLayers.length * 15) % 45),
      y: 175 + ((viewLayers.length * 15) % 45),
      width: 72,
      height: 72,
      rotation: 0,
      opacity: 1,
      fontSize: 56,
      visible: true,
      locked: false,
    };
    updateLayers((prev) => [...prev, layer]);
    setSelectedLayerId(id);
  };

  const handleApplyTemplate = (tpl: (typeof MEME_TEMPLATES)[0]) => {
    const t1: CustomCanvasLayer = {
      id: `tpl_top_${Date.now()}`,
      view: currentView,
      type: "text",
      name: `${tpl.title} (Top)`,
      content: tpl.topText,
      x: 130,
      y: 110,
      width: 240,
      height: 50,
      rotation: 0,
      opacity: 1,
      fontSize: 24,
      fontFamily: "Impact",
      color: garmentColor.textDefault,
      strokeColor: garmentColor.name === "White" ? "#FFFFFF" : "#000000",
      uppercase: true,
      visible: true,
      locked: false,
    };
    const st: CustomCanvasLayer = {
      id: `tpl_emoji_${Date.now() + 1}`,
      view: currentView,
      type: "sticker",
      name: `${tpl.title} Icon`,
      content: tpl.emoji,
      x: 210,
      y: 185,
      width: 80,
      height: 80,
      rotation: 0,
      opacity: 1,
      fontSize: 64,
      visible: true,
      locked: false,
    };
    const t2: CustomCanvasLayer = {
      id: `tpl_bot_${Date.now() + 2}`,
      view: currentView,
      type: "text",
      name: `${tpl.title} (Bottom)`,
      content: tpl.bottomText,
      x: 130,
      y: 290,
      width: 240,
      height: 50,
      rotation: 0,
      opacity: 1,
      fontSize: 22,
      fontFamily: "Impact",
      color: "#FACC15",
      strokeColor: "#000000",
      uppercase: true,
      visible: true,
      locked: false,
    };
    updateLayers((prev) => [
      ...prev.filter((l) => l.view !== currentView),
      t1,
      st,
      t2,
    ]);
    setSelectedLayerId(t2.id);
    toast({
      title: "Meme Template Applied",
      description: `Loaded "${tpl.title}" onto ${currentView} view.`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const id = `img_${Date.now()}`;
      const layer: CustomCanvasLayer = {
        id,
        view: currentView,
        type: "image",
        name: file.name.slice(0, 20),
        content: dataUrl,
        x: 155,
        y: 135,
        width: 190,
        height: 190,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
      };
      updateLayers((prev) => [...prev, layer]);
      setSelectedLayerId(id);
      toast({
        title: "Artwork Uploaded",
        description: `${file.name} added to ${currentView} canvas.`,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDuplicateLayer = useCallback(
    (id: string) => {
      const target = layers.find((l) => l.id === id);
      if (!target) return;
      const copy: CustomCanvasLayer = {
        ...target,
        id: `${target.type}_${Date.now()}`,
        name: `${target.name} Copy`,
        x: Math.min(320, target.x + 20),
        y: Math.min(360, target.y + 20),
      };
      updateLayers((prev) => [...prev, copy]);
      setSelectedLayerId(copy.id);
    },
    [layers, updateLayers]
  );

  const handleDeleteLayer = useCallback(
    (id: string) => {
      updateLayers((prev) => prev.filter((l) => l.id !== id));
      if (selectedLayerId === id) setSelectedLayerId(null);
    },
    [selectedLayerId, updateLayers]
  );

  const handleMoveLayerOrder = (id: string, direction: "up" | "down") => {
    updateLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const swapIdx = direction === "up" ? idx + 1 : idx - 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(swapIdx, 0, item);
      return copy;
    });
  };

  // Keyboard shortcuts (Delete, Ctrl+D duplicate, Ctrl+Z undo)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d" && selectedLayerId) {
        e.preventDefault();
        handleDuplicateLayer(selectedLayerId);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedLayerId) {
        e.preventDefault();
        handleDeleteLayer(selectedLayerId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedLayerId, handleDuplicateLayer, handleDeleteLayer]);

  // Pointer drag handlers with smart center snap guides
  const handleLayerPointerDown = (e: React.MouseEvent, layer: CustomCanvasLayer) => {
    e.stopPropagation();
    setSelectedLayerId(layer.id);
    if (layer.locked) return;
    const rect = printAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDraggingId(layer.id);
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - layer.x,
      y: (e.clientY - rect.top) / zoom - layer.y,
    });
  };

  useEffect(() => {
    if (!draggingId) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = printAreaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const target = layers.find((l) => l.id === draggingId);
      if (!target) return;

      let nextX = (e.clientX - rect.left) / zoom - dragOffset.x;
      let nextY = (e.clientY - rect.top) / zoom - dragOffset.y;

      // Clamp inside 500x520 canvas
      nextX = Math.max(40, Math.min(460 - target.width, nextX));
      nextY = Math.max(50, Math.min(460 - target.height, nextY));

      // Center snap check (canvas center is x=250, y=240)
      const centerX = nextX + target.width / 2;
      const centerY = nextY + target.height / 2;
      const snapV = Math.abs(centerX - 250) < 10;
      const snapH = Math.abs(centerY - 240) < 10;

      if (snapV) nextX = 250 - target.width / 2;
      if (snapH) nextY = 240 - target.height / 2;

      setSnapGuide({ vertical: snapV, horizontal: snapH });
      setLayers((prev) =>
        prev.map((l) => (l.id === draggingId ? { ...l, x: nextX, y: nextY } : l))
      );
    };

    const onMouseUp = () => {
      setDraggingId(null);
      setSnapGuide({ vertical: false, horizontal: false });
      pushHistory(layers);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggingId, dragOffset, zoom, layers, pushHistory]);

  // Render composite design to HTML5 Canvas for PNG download & Cart Thumbnail
  const renderCompositeCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 520;
    const ctx = canvas.getContext("2d")!;

    // Background studio card
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, 500, 520);

    // Draw garment silhouette
    ctx.save();
    ctx.fillStyle = garmentColor.hex;
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (garmentStyle.id === "tank") {
      ctx.moveTo(165, 55);
      ctx.lineTo(205, 55);
      ctx.quadraticCurveTo(250, 95, 295, 55);
      ctx.lineTo(335, 55);
      ctx.lineTo(355, 165);
      ctx.lineTo(360, 470);
      ctx.lineTo(140, 470);
      ctx.lineTo(145, 165);
      ctx.closePath();
    } else {
      // Tee / Hoodie silhouette
      ctx.moveTo(150, 55);
      ctx.lineTo(205, 55);
      ctx.quadraticCurveTo(250, 85, 295, 55);
      ctx.lineTo(350, 55);
      ctx.lineTo(445, 135);
      ctx.lineTo(405, 195);
      ctx.lineTo(355, 155);
      ctx.lineTo(355, 470);
      ctx.lineTo(145, 470);
      ctx.lineTo(145, 155);
      ctx.lineTo(95, 195);
      ctx.lineTo(55, 135);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw active view layers
    for (const layer of viewLayers) {
      if (!layer.visible) continue;
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      const cx = layer.x + layer.width / 2;
      const cy = layer.y + layer.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((layer.rotation * Math.PI) / 180);

      if (layer.type === "text") {
        const text = layer.uppercase ? layer.content.toUpperCase() : layer.content;
        ctx.font = `bold ${layer.fontSize || 26}px ${layer.fontFamily || "Impact"}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (layer.strokeColor) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = 4;
          ctx.strokeText(text, 0, 0);
        }
        ctx.fillStyle = layer.color || "#FFFFFF";
        ctx.fillText(text, 0, 0);
      } else if (layer.type === "sticker") {
        ctx.font = `${layer.fontSize || 56}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(layer.content, 0, 0);
      } else if (layer.type === "image") {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(
              img,
              -layer.width / 2,
              -layer.height / 2,
              layer.width,
              layer.height
            );
            resolve();
          };
          img.onerror = () => resolve();
          img.src = layer.content;
        });
      }
      ctx.restore();
    }

    return canvas;
  };

  const handleExportPng = async () => {
    try {
      const sourceCanvas = await renderCompositeCanvas();
      const blob = await createPrintReadyBlob(sourceCanvas, {
        width: 500,
        height: 520,
        dpiScale: 2,
        format: "image/png",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chicker-custom-${garmentStyle.id}-${currentView}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "High-DPI PNG Exported",
        description: `Downloaded 1000x1040 print-ready ${currentView} mockup.`,
      });
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleSaveDraft = () => {
    try {
      const payload = {
        garmentStyleId: garmentStyle.id,
        garmentColorName: garmentColor.name,
        selectedSize,
        layers,
        savedAt: Date.now(),
      };
      localStorage.setItem("chicker_custom_draft", JSON.stringify(payload));
      toast({
        title: "Design Draft Saved",
        description: "You can reload this custom design anytime.",
      });
    } catch {
      // noop
    }
  };

  const handleLoadDraft = () => {
    try {
      const raw = localStorage.getItem("chicker_custom_draft");
      if (!raw) {
        toast({
          title: "No Saved Draft Found",
          description: "Save a design first to reload it later.",
        });
        return;
      }
      const data = JSON.parse(raw);
      const foundStyle = GARMENT_STYLES.find((s) => s.id === data.garmentStyleId);
      const foundColor = GARMENT_COLORS.find((c) => c.name === data.garmentColorName);
      if (foundStyle) setGarmentStyle(foundStyle);
      if (foundColor) setGarmentColor(foundColor);
      if (data.selectedSize) setSelectedSize(data.selectedSize);
      if (Array.isArray(data.layers)) {
        setLayers(data.layers);
        pushHistory(data.layers);
      }
      toast({
        title: "Draft Loaded",
        description: "Restored your saved custom design.",
      });
    } catch {
      // noop
    }
  };

  const customTotalPrice =
    garmentStyle.price + Math.max(0, layers.filter((l) => l.visible).length - 1) * 2000;

  const handleAddCustomToCart = async () => {
    const canvas = await renderCompositeCanvas();
    const previewDataUrl = canvas.toDataURL("image/png");
    await addItem(
      `custom-${garmentStyle.id}-${Date.now()}`,
      1,
      customTotalPrice,
      `Custom ${garmentStyle.name} (${layers.filter((l) => l.visible).length} layers)`,
      selectedSize,
      garmentColor.name,
      previewDataUrl,
      {
        view: currentView,
        garmentType: garmentStyle.name,
        elementsCount: layers.filter((l) => l.visible).length,
      }
    );
    toast({
      title: "Custom Apparel Added to Cart!",
      description: `${garmentStyle.name} (${selectedSize}, ${garmentColor.name}) — TZS ${customTotalPrice.toLocaleString()}`,
    });
    navigate("/cart");
  };

  const handleWhatsAppShare = () => {
    const textElements = layers
      .filter((l) => l.visible && l.type === "text")
      .map((l) => `"${l.content}"`)
      .join(", ");
    const message = encodeURIComponent(
      `Hi Chicker! I designed a custom ${garmentStyle.name} (${garmentColor.name}, Size ${selectedSize}) with ${
        layers.filter((l) => l.visible).length
      } layers ${textElements ? `[${textElements}]` : ""} — Total TZS ${customTotalPrice.toLocaleString()}.`
    );
    window.open(`https://wa.me/255123456789?text=${message}`, "_blank");
  };

  // Render realistic SVG silhouette for the chosen garment style
  const renderGarmentSvg = () => {
    const isHoodie = garmentStyle.id === "hoodie";
    const isTank = garmentStyle.id === "tank";

    return (
      <svg
        viewBox="0 0 500 520"
        className="w-full h-full select-none pointer-events-none drop-shadow-xl"
      >
        <defs>
          <linearGradient id="fabricShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {isTank ? (
          <path
            d="M165,55 L205,55 Q250,105 295,55 L335,55 L350,165 L360,470 L140,470 L150,165 Z"
            fill={garmentColor.hex}
            stroke="#94A3B8"
            strokeWidth="2"
          />
        ) : (
          <path
            d="M150,55 L205,55 Q250,90 295,55 L350,55 L445,135 L405,195 L355,155 L355,470 L145,470 L145,155 L95,195 L55,135 Z"
            fill={garmentColor.hex}
            stroke="#94A3B8"
            strokeWidth="2"
          />
        )}

        {/* Fabric shading overlay */}
        {isTank ? (
          <path
            d="M165,55 L205,55 Q250,105 295,55 L335,55 L350,165 L360,470 L140,470 L150,165 Z"
            fill="url(#fabricShade)"
          />
        ) : (
          <path
            d="M150,55 L205,55 Q250,90 295,55 L350,55 L445,135 L405,195 L355,155 L355,470 L145,470 L145,155 L95,195 L55,135 Z"
            fill="url(#fabricShade)"
          />
        )}

        {/* Hoodie hood & kangaroo pocket details */}
        {isHoodie && (
          <>
            <path
              d="M195,55 Q250,15 305,55"
              fill="none"
              stroke="#64748B"
              strokeWidth="4"
            />
            {currentView === "front" && (
              <>
                <line x1="232" y1="72" x2="232" y2="125" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="268" y1="72" x2="268" y2="125" stroke="#94A3B8" strokeWidth="2.5" />
                <path
                  d="M175,365 L325,365 L340,445 L160,445 Z"
                  fill="none"
                  stroke="#94A3B8"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
              </>
            )}
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Studio Top Toolbar */}
      <div className="glass-card border-b border-border px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Meme Studio
            </Badge>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Custom Apparel Designer
            </h1>
          </div>

          {/* Center View + Undo/Redo + Zoom */}
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                type="button"
                onClick={() => setCurrentView("front")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentView === "front"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Front View
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("back")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentView === "back"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Back View
              </button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.1).toFixed(2)))}
              title="Zoom Out"
              className="h-8 w-8 hidden sm:inline-flex"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
              title="Zoom In"
              className="h-8 w-8 hidden sm:inline-flex"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="h-8 text-xs">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadDraft} className="h-8 text-xs">
              <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPng} className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export PNG
            </Button>
            <Button
              size="sm"
              onClick={handleAddCustomToCart}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              Add to Cart (TZS {customTotalPrice.toLocaleString()})
            </Button>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* Left Panel: Creation Tools (Garment, Text, Templates, Stickers, Upload) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <Tabs defaultValue="garment" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-4">
                  <TabsTrigger value="garment" className="text-xs">
                    Garment
                  </TabsTrigger>
                  <TabsTrigger value="text" className="text-xs">
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">
                    Memes
                  </TabsTrigger>
                  <TabsTrigger value="stickers" className="text-xs">
                    Stickers
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Garment Type, Color & Size */}
                <TabsContent value="garment" className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">
                      Apparel Style
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {GARMENT_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setGarmentStyle(style)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            garmentStyle.id === style.id
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border bg-card hover:bg-hover"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{style.name}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {style.badge}
                            </Badge>
                          </div>
                          <div className="text-xs text-primary font-bold mt-1">
                            TZS {style.price.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">
                      Fabric Color: {garmentColor.name}
                    </Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {GARMENT_COLORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          title={c.name}
                          onClick={() => setGarmentColor(c)}
                          className={`h-8 w-8 rounded-full border-2 transition-transform ${
                            garmentColor.name === c.name
                              ? "scale-110 border-primary ring-2 ring-primary/40"
                              : "border-border hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">
                      Size: {selectedSize}
                    </Label>
                    <div className="grid grid-cols-6 gap-1.5 mt-2">
                      {SIZES.map((sz) => (
                        <Button
                          key={sz}
                          type="button"
                          size="sm"
                          variant={selectedSize === sz ? "default" : "outline"}
                          onClick={() => setSelectedSize(sz)}
                          className="text-xs h-8 px-0"
                        >
                          {sz}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Add Text & Upload Image */}
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Meme Caption Text</Label>
                    <Input
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder="Enter funny meme caption..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-semibold">Font</Label>
                      <select
                        value={newFont}
                        onChange={(e) => setNewFont(e.target.value)}
                        className="w-full mt-1 h-9 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {FONTS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Text Color</Label>
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-full mt-1 h-9 rounded-md border border-input bg-background p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddText} className="w-full">
                    <Type className="h-4 w-4 mr-2" />
                    Add Text Layer
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Upload Custom Meme / Photo</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Image from Device
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 3: Meme Templates */}
                <TabsContent value="templates" className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    One-click meme layouts with editable top & bottom captions:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {MEME_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyTemplate(tpl)}
                        className="p-3 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 text-left transition-all"
                      >
                        <div className="text-2xl mb-1">{tpl.emoji}</div>
                        <div className="text-xs font-semibold">{tpl.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {tpl.topText}
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab 4: Stickers */}
                <TabsContent value="stickers">
                  <p className="text-xs text-muted-foreground mb-2">
                    Click any sticker to place it on your {currentView} design:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {STICKERS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleAddSticker(s.emoji, s.label)}
                        className="p-2.5 rounded-xl border border-border bg-card hover:border-primary hover:scale-105 transition-all flex flex-col items-center gap-1"
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-[10px] text-muted-foreground">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* WhatsApp Direct Design Help */}
          <Card className="glass-card border-green-500/30">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-semibold">Order or Preview via WhatsApp</h4>
                <p className="text-[11px] text-muted-foreground">
                  Send your custom specs directly to our Dar print studio
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleWhatsAppShare}
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel: Interactive Garment Mockup Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center bg-muted/30 border border-border rounded-2xl p-4 overflow-hidden min-h-[540px]">
            <div
              ref={printAreaRef}
              onClick={() => setSelectedLayerId(null)}
              className="relative w-[500px] h-[520px] select-none transition-transform"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            >
              {/* Garment Base SVG */}
              {renderGarmentSvg()}

              {/* Printable Zone Guide */}
              <div className="absolute left-[130px] top-[100px] w-[240px] h-[310px] border border-dashed border-primary/30 rounded-md pointer-events-none" />

              {/* Smart Center Snap Guides */}
              {snapGuide.vertical && (
                <div className="absolute left-[250px] top-[80px] bottom-[80px] w-[1.5px] bg-cyan-400 pointer-events-none z-30" />
              )}
              {snapGuide.horizontal && (
                <div className="absolute top-[240px] left-[120px] right-[120px] h-[1.5px] bg-cyan-400 pointer-events-none z-30" />
              )}

              {/* Render Active View Layers */}
              {viewLayers.map((layer) => {
                if (!layer.visible) return null;
                const isSelected = layer.id === selectedLayerId;

                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerPointerDown(e, layer)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      left: layer.x,
                      top: layer.y,
                      width: layer.width,
                      height: layer.height,
                      transform: `rotate(${layer.rotation}deg)`,
                      opacity: layer.opacity,
                      cursor: layer.locked ? "not-allowed" : "move",
                    }}
                    className={`flex items-center justify-center rounded transition-shadow ${
                      isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:ring-1 hover:ring-primary/40"
                    }`}
                  >
                    {layer.type === "text" && (
                      <div
                        style={{
                          fontFamily: layer.fontFamily || "Impact",
                          fontSize: `${layer.fontSize || 26}px`,
                          color: layer.color || "#FFFFFF",
                          textTransform: layer.uppercase ? "uppercase" : "none",
                          WebkitTextStroke: layer.strokeColor
                            ? `1.2px ${layer.strokeColor}`
                            : undefined,
                          lineHeight: 1.15,
                        }}
                        className="font-bold text-center break-words w-full pointer-events-none px-1"
                      >
                        {layer.content}
                      </div>
                    )}

                    {layer.type === "sticker" && (
                      <div
                        style={{ fontSize: `${layer.fontSize || 56}px` }}
                        className="leading-none pointer-events-none"
                      >
                        {layer.content}
                      </div>
                    )}

                    {layer.type === "image" && (
                      <img
                        src={layer.content}
                        alt={layer.name}
                        className="w-full h-full object-contain pointer-events-none rounded"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Drag any element on the shirt to position it. Use Delete to remove or Ctrl/Cmd+D to duplicate.
          </p>
        </div>

        {/* Right Panel: Layers Stack & Selected Layer Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {/* Selected Layer Properties */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Layer Inspector
                </h3>
                {selectedLayer && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateLayer(selectedLayer.id)}
                      title="Duplicate Layer"
                      className="h-7 w-7"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLayer(selectedLayer.id)}
                      title="Delete Layer"
                      className="h-7 w-7 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {selectedLayer ? (
                <div className="space-y-3">
                  {selectedLayer.type === "text" && (
                    <>
                      <div>
                        <Label className="text-xs">Caption</Label>
                        <Input
                          value={selectedLayer.content}
                          onChange={(e) =>
                            updateSelectedLayer({ content: e.target.value }, false)
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Text Color</Label>
                          <input
                            type="color"
                            value={selectedLayer.color || "#FFFFFF"}
                            onChange={(e) => updateSelectedLayer({ color: e.target.value })}
                            className="w-full h-8 rounded border border-input mt-1 cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Outline</Label>
                          <input
                            type="color"
                            value={selectedLayer.strokeColor || "#000000"}
                            onChange={(e) =>
                              updateSelectedLayer({ strokeColor: e.target.value })
                            }
                            className="w-full h-8 rounded border border-input mt-1 cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(selectedLayer.type === "text" || selectedLayer.type === "sticker") && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Size</span>
                        <span>{selectedLayer.fontSize || 32}px</span>
                      </div>
                      <Slider
                        min={14}
                        max={96}
                        step={1}
                        value={[selectedLayer.fontSize || 32]}
                        onValueChange={([v]) =>
                          updateSelectedLayer(
                            {
                              fontSize: v,
                              height: Math.max(45, v + 20),
                            },
                            false
                          )
                        }
                      />
                    </div>
                  )}

                  {selectedLayer.type === "image" && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Image Scale</span>
                        <span>{Math.round(selectedLayer.width)}px</span>
                      </div>
                      <Slider
                        min={60}
                        max={260}
                        step={4}
                        value={[selectedLayer.width]}
                        onValueChange={([v]) =>
                          updateSelectedLayer({ width: v, height: v }, false)
                        }
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Rotation</span>
                      <span>{selectedLayer.rotation}°</span>
                    </div>
                    <Slider
                      min={-180}
                      max={180}
                      step={1}
                      value={[selectedLayer.rotation]}
                      onValueChange={([v]) => updateSelectedLayer({ rotation: v }, false)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Opacity</span>
                      <span>{Math.round(selectedLayer.opacity * 100)}%</span>
                    </div>
                    <Slider
                      min={0.2}
                      max={1}
                      step={0.05}
                      value={[selectedLayer.opacity]}
                      onValueChange={([v]) => updateSelectedLayer({ opacity: v }, false)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSelectedLayer({ rotation: 0, x: 140 })}
                    className="w-full text-xs h-8"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Center & Reset Rotation
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Click any layer on the canvas or in the list below to edit its properties.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Layers List */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  Layers ({viewLayers.length})
                </h3>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {currentView}
                </Badge>
              </div>

              {viewLayers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No layers on {currentView} side yet. Add text, stickers, or templates!
                </p>
              ) : (
                <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                  {viewLayers.map((layer) => {
                    const active = layer.id === selectedLayerId;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          active
                            ? "border-primary bg-primary/10 font-medium"
                            : "border-border bg-card hover:bg-hover"
                        }`}
                      >
                        <span className="truncate max-w-[110px]">{layer.name}</span>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLayerOrder(layer.id, "up");
                            }}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLayerOrder(layer.id, "down");
                            }}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLayers((prev) =>
                                prev.map((l) =>
                                  l.id === layer.id ? { ...l, visible: !l.visible } : l
                                )
                              );
                            }}
                          >
                            {layer.visible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLayers((prev) =>
                                prev.map((l) =>
                                  l.id === layer.id ? { ...l, locked: !l.locked } : l
                                )
                              );
                            }}
                          >
                            {layer.locked ? (
                              <Lock className="h-3 w-3 text-warning" />
                            ) : (
                              <Unlock className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customize;