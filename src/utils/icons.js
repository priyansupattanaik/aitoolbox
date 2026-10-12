import {
  Share2, Cloud, FileText, Zap, SearchCheck, Brain, Mic,
  LayoutDashboard, Download, Shield, Music, Volume2, Mic2,
  Music4, ImageUp, Image, Video, PenLine, PenTool, Code,
  GitCommitHorizontal, Smartphone, Component, Sparkles,
  BookOpen, Palette, FlaskConical, ShoppingCart, ToggleLeft,
  Bot, Cpu, Layers, Globe, Terminal, Wrench, Search, File,
  Database, Key, Lock, Server, Eye, Settings, Compass,
  Flame, Lightbulb, Play, Users, Workflow, Binary, Radio,
  Tv, Boxes, FileCode, Code2, Package, Sliders
} from "lucide-react";

/**
 * Normalized dictionary of icons used across the catalog and directory.
 * Keys are lowercased and stripped of hyphens, underscores, and spaces.
 */
const ICON_MAP = {
  share2: Share2,
  cloud: Cloud,
  filetext: FileText,
  zap: Zap,
  searchcheck: SearchCheck,
  brain: Brain,
  mic: Mic,
  layoutdashboard: LayoutDashboard,
  download: Download,
  shield: Shield,
  music: Music,
  volume2: Volume2,
  mic2: Mic2,
  music4: Music4,
  imageup: ImageUp,
  image: Image,
  video: Video,
  penline: PenLine,
  pentool: PenTool,
  code: Code,
  gitcommithorizontal: GitCommitHorizontal,
  smartphone: Smartphone,
  component: Component,
  sparkles: Sparkles,
  sparkle: Sparkles,
  bookopen: BookOpen,
  palette: Palette,
  flaskconical: FlaskConical,
  shoppingcart: ShoppingCart,
  toggleleft: ToggleLeft,
  bot: Bot,
  cpu: Cpu,
  layers: Layers,
  globe: Globe,
  terminal: Terminal,
  wrench: Wrench,
  search: Search,
  file: File,
  database: Database,
  key: Key,
  lock: Lock,
  server: Server,
  eye: Eye,
  settings: Settings,
  compass: Compass,
  flame: Flame,
  lightbulb: Lightbulb,
  play: Play,
  users: Users,
  workflow: Workflow,
  binary: Binary,
  radio: Radio,
  tv: Tv,
  boxes: Boxes,
  filecode: FileCode,
  code2: Code2,
  package: Package,
  sliders: Sliders,
};

/**
 * Resolves an icon name from the spreadsheet to a static Lucide icon component.
 *
 * @param {string} [name]
 * @returns {import('react').ComponentType<{ size?: number, className?: string }>}
 */
export function resolveIcon(name) {
  if (!name || typeof name !== "string") return Sparkles;
  const key = name.toLowerCase().replace(/[-_\s]/g, "");
  return ICON_MAP[key] || Sparkles;
}
