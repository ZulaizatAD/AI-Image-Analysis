import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  BoltIcon 
} from "@heroicons/react/24/outline";

export const APP_CONFIG = {
  name: "AI Nutrition Analyser",
  description: "AI-powered food analysis",
  version: "2.0.0",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
  dailyLimit: 3,
};

export const API_ENDPOINTS = {
  health: "/health",
  profile: "/user/profile",
  history: "/user/history",
  analyze: "/analyze-image",
  adminStats: "/admin/stats",
};

export const SAMPLE_FOODS = [
  { emoji: "🥗", label: "Salads" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍎", label: "Fruits" },
  { emoji: "🥘", label: "Meals" },
  { emoji: "🍰", label: "Desserts" },
  { emoji: "🥪", label: "Sandwiches" },
];

export const FEATURES = [
  {
    icon: "🔍",
    iconComponent: MagnifyingGlassIcon,
    title: "Smart Recognition",
    desc: "AI identifies ingredients and portions",
  },
  {
    icon: "📊",
    iconComponent: ChartBarIcon,
    title: "Detailed Analysis",
    desc: "Complete nutritional breakdown",
  },
  {
    icon: "💡",
    iconComponent: LightBulbIcon,
    title: "Health Insights",
    desc: "Personalized recommendations",
  },
  {
    icon: "⚡",
    iconComponent: BoltIcon,
    title: "Instant Analysis",
    desc: "Results in seconds",
  },
];

export const LOADING_STEPS = [
  "Identifying ingredients...",
  "Calculating nutrition facts...",
  "Generating health insights...",
  "Preparing recommendations...",
];