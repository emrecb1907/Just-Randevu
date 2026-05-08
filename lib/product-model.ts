import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  MessageCircle,
  PackageCheck,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smile,
  Store,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ModuleKey =
  | "appointments"
  | "customers"
  | "staff"
  | "services"
  | "whatsapp"
  | "stock"
  | "product_sales"
  | "tickets"
  | "finance"
  | "receivables"
  | "installments"
  | "payments"
  | "performance"
  | "commissions"
  | "surveys"
  | "advanced_permissions"
  | "multi_branch"
  | "package_tracking";

export type PlanKey = "standard" | "premium";

export type RoleKey = "super_admin" | "business_owner" | "admin" | "staff";

export type ModuleDefinition = {
  key: ModuleKey;
  name: string;
  description: string;
  category: "core" | "premium" | "finance" | "operations";
  availability: "ready" | "planned";
  icon: LucideIcon;
};

export const modules: ModuleDefinition[] = [
  {
    key: "appointments",
    name: "Randevu Yönetimi",
    description: "Personel ve admin takvimleri, durum takibi, çakışma engeli.",
    category: "core",
    availability: "ready",
    icon: CalendarDays,
  },
  {
    key: "customers",
    name: "Müşteri Takibi",
    description: "İşletmeye özel müşteri kayıtları, KVKK ve WhatsApp izinleri.",
    category: "core",
    availability: "ready",
    icon: Users,
  },
  {
    key: "staff",
    name: "Personel",
    description: "Ekip profilleri, şube bağlantıları ve yetkiler.",
    category: "core",
    availability: "ready",
    icon: UserCog,
  },
  {
    key: "services",
    name: "Hizmetler",
    description: "Randevularda seçilecek hizmet, süre ve fiyat bilgileri.",
    category: "core",
    availability: "ready",
    icon: ClipboardCheck,
  },
  {
    key: "whatsapp",
    name: "WhatsApp Hatırlatma",
    description: "WhatsApp hatırlatma mesajları ve gönderim geçmişi.",
    category: "core",
    availability: "planned",
    icon: MessageCircle,
  },
  {
    key: "stock",
    name: "Stok Yönetimi",
    description: "Ürün kartları, stok giriş/çıkış/düzeltme ve düşük stok uyarısı.",
    category: "operations",
    availability: "ready",
    icon: Boxes,
  },
  {
    key: "product_sales",
    name: "Ürün Satışı",
    description: "Adisyona ürün satırı ekleme ve stoktan otomatik düşüm.",
    category: "operations",
    availability: "planned",
    icon: ShoppingBag,
  },
  {
    key: "tickets",
    name: "Adisyon Yönetimi",
    description: "Randevuya çoklu hizmet, ürün ve ödeme satırı bağlama.",
    category: "operations",
    availability: "planned",
    icon: Receipt,
  },
  {
    key: "finance",
    name: "Gelir-Gider",
    description: "Tamamlanan randevudan gelir, manuel gider ve kasa özeti.",
    category: "finance",
    availability: "ready",
    icon: WalletCards,
  },
  {
    key: "receivables",
    name: "Cari Alacak",
    description: "Müşteri bazlı borç, tahsilat ve açık bakiye takibi.",
    category: "finance",
    availability: "planned",
    icon: HandCoins,
  },
  {
    key: "installments",
    name: "Taksit Takibi",
    description: "Vadeli ödeme planı ve geciken taksit görünümü.",
    category: "finance",
    availability: "planned",
    icon: FileText,
  },
  {
    key: "payments",
    name: "Borç ve Ödeme",
    description: "Nakit, kart, havale ve ödeme işlem geçmişi.",
    category: "finance",
    availability: "planned",
    icon: CreditCard,
  },
  {
    key: "performance",
    name: "Personel Performansı",
    description: "Doluluk, gelir, işlem adedi, iptal ve gelmedi oranları.",
    category: "premium",
    availability: "planned",
    icon: BarChart3,
  },
  {
    key: "commissions",
    name: "Prim ve Hak Ediş",
    description: "Hizmet bazlı yüzde, sabit tutar ve personel kuralı.",
    category: "finance",
    availability: "planned",
    icon: PackageCheck,
  },
  {
    key: "surveys",
    name: "Memnuniyet Anketleri",
    description: "Randevu sonrası puanlama, yorum ve şube/personel raporu.",
    category: "premium",
    availability: "planned",
    icon: Smile,
  },
  {
    key: "advanced_permissions",
    name: "Gelişmiş Yetkilendirme",
    description: "Telefon, fiyat, tahsilat ve ekip görünümü izinleri.",
    category: "premium",
    availability: "planned",
    icon: ShieldCheck,
  },
  {
    key: "multi_branch",
    name: "Çoklu Şube",
    description: "Şube bazlı mesai, personel, stok, gelir ve takvim ayrımı.",
    category: "premium",
    availability: "ready",
    icon: Building2,
  },
  {
    key: "package_tracking",
    name: "Paket Satış ve Kullanım",
    description: "Paket aboneliği, plan limitleri ve modül kullanımı.",
    category: "premium",
    availability: "ready",
    icon: Bell,
  },
];

export const readyModules = modules.filter(
  (module) => module.availability === "ready",
);

export const plannedModules = modules.filter(
  (module) => module.availability === "planned",
);

export const readyModuleKeys = readyModules.map((module) => module.key);

export function isReadyModule(moduleKey: ModuleKey) {
  return readyModuleKeys.includes(moduleKey);
}

export const plans = {
  standard: {
    name: "Standart",
    monthlyPriceCents: 119900,
    branchLimit: 1,
    staffLimit: 8,
    staffLimitScope: "business",
    includedModules: ["appointments", "customers", "staff", "services", "whatsapp"],
  },
  premium: {
    name: "Premium",
    monthlyPriceCents: 249900,
    branchLimit: 3,
    staffLimit: 20,
    staffLimitScope: "branch",
    includedModules: modules.map((module) => module.key),
  },
} satisfies Record<
  PlanKey,
  {
    name: string;
    monthlyPriceCents: number;
    branchLimit: number;
    staffLimit: number;
    staffLimitScope: "business" | "branch";
    includedModules: ModuleKey[];
  }
>;

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  moduleKey?: ModuleKey;
};

export const navigation = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  {
    label: "Takvim",
    href: "/app/calendar",
    icon: CalendarDays,
    moduleKey: "appointments",
  },
  {
    label: "Vardiya Planı",
    href: "/app/schedule",
    icon: CalendarClock,
    moduleKey: "staff",
  },
  {
    label: "Müşteriler",
    href: "/app/customers",
    icon: Users,
    moduleKey: "customers",
  },
  { label: "Personel", href: "/app/staff", icon: UserCog, moduleKey: "staff" },
  {
    label: "Hizmetler",
    href: "/app/services",
    icon: ClipboardCheck,
    moduleKey: "services",
  },
  { label: "Şubeler", href: "/app/branches", icon: Building2, moduleKey: "multi_branch" },
  { label: "Stok", href: "/app/stock", icon: Boxes, moduleKey: "stock" },
  { label: "Finans", href: "/app/finance", icon: WalletCards, moduleKey: "finance" },
  { label: "Ayarlar", href: "/app/settings", icon: Store },
] satisfies NavigationItem[];

export const systemNavigation = [
  { label: "Sistem Paneli", href: "/app", icon: LayoutDashboard },
  { label: "İşletmeler", href: "/app/super-admin", icon: Building2 },
  { label: "Paketler", href: "/app/super-admin/plans", icon: PackageCheck },
] satisfies NavigationItem[];
