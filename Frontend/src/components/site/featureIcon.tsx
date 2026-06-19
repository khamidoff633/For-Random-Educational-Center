import {
  GraduationCap,
  Laptop,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Laptop,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Globe,
  Sparkles,
};

/** Resolves a feature icon name to a Lucide component, with a sensible default. */
export function FeatureIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon size={size} strokeWidth={2} />;
}
