import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
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
  icon: LucideIcon;
};

export const modules: ModuleDefinition[] = [
  {
    key: "appointments",
    name: "Randevu Yönetimi",
    description: "Personel ve admin takvimleri, durum takibi, çakışma engeli.",
    category: "core",
    icon: CalendarDays,
  },
  {
    key: "customers",
    name: "Müşteri Takibi",
    description: "İşletmeye özel müşteri kayıtları, KVKK ve WhatsApp izinleri.",
    category: "core",
    icon: Users,
  },
  {
    key: "staff",
    name: "Personel Yönetimi",
    description: "Profil, mesai, izin, geçici şifre ve yetki akışları.",
    category: "core",
    icon: UserCog,
  },
  {
    key: "services",
    name: "İşlem ve Hizmetler",
    description: "Süre, fiyat, kategori ve fiyat snapshot altyapısı.",
    category: "core",
    icon: ClipboardCheck,
  },
  {
    key: "whatsapp",
    name: "WhatsApp Hatırlatma",
    description: "Meta Cloud API template gönderimleri ve bildirim logları.",
    category: "core",
    icon: MessageCircle,
  },
  {
    key: "stock",
    name: "Stok Yönetimi",
    description: "Ürün kartları, stok giriş/çıkış/düzeltme ve düşük stok uyarısı.",
    category: "operations",
    icon: Boxes,
  },
  {
    key: "product_sales",
    name: "Ürün Satışı",
    description: "Adisyona ürün satırı ekleme ve stoktan otomatik düşüm.",
    category: "operations",
    icon: ShoppingBag,
  },
  {
    key: "tickets",
    name: "Adisyon Yönetimi",
    description: "Randevuya çoklu hizmet, ürün ve ödeme satırı bağlama.",
    category: "operations",
    icon: Receipt,
  },
  {
    key: "finance",
    name: "Gelir-Gider",
    description: "Tamamlanan randevudan gelir, manuel gider ve kasa özeti.",
    category: "finance",
    icon: WalletCards,
  },
  {
    key: "receivables",
    name: "Cari Alacak",
    description: "Müşteri bazlı borç, tahsilat ve açık bakiye takibi.",
    category: "finance",
    icon: HandCoins,
  },
  {
    key: "installments",
    name: "Taksit Takibi",
    description: "Vadeli ödeme planı ve geciken taksit görünümü.",
    category: "finance",
    icon: FileText,
  },
  {
    key: "payments",
    name: "Borç ve Ödeme",
    description: "Nakit, kart, havale ve ödeme işlem geçmişi.",
    category: "finance",
    icon: CreditCard,
  },
  {
    key: "performance",
    name: "Personel Performansı",
    description: "Doluluk, gelir, işlem adedi, iptal ve gelmedi oranları.",
    category: "premium",
    icon: BarChart3,
  },
  {
    key: "commissions",
    name: "Prim ve Hak Ediş",
    description: "Hizmet bazlı yüzde, sabit tutar ve personel kuralı.",
    category: "finance",
    icon: PackageCheck,
  },
  {
    key: "surveys",
    name: "Memnuniyet Anketleri",
    description: "Randevu sonrası puanlama, yorum ve şube/personel raporu.",
    category: "premium",
    icon: Smile,
  },
  {
    key: "advanced_permissions",
    name: "Gelişmiş Yetkilendirme",
    description: "Telefon, fiyat, tahsilat ve ekip görünümü izinleri.",
    category: "premium",
    icon: ShieldCheck,
  },
  {
    key: "multi_branch",
    name: "Çoklu Şube",
    description: "Şube bazlı mesai, personel, stok, gelir ve takvim ayrımı.",
    category: "premium",
    icon: Building2,
  },
  {
    key: "package_tracking",
    name: "Paket Satış ve Kullanım",
    description: "İyzico abonelikleri, plan limitleri ve modül kullanımı.",
    category: "premium",
    icon: Bell,
  },
];

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

export const navigation = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Takvim", href: "/app/calendar", icon: CalendarDays },
  { label: "Müşteriler", href: "/app/customers", icon: Users },
  { label: "Personel", href: "/app/staff", icon: UserCog },
  { label: "İşlemler", href: "/app/services", icon: ClipboardCheck },
  { label: "Stok", href: "/app/stock", icon: Boxes },
  { label: "Finans", href: "/app/finance", icon: WalletCards },
  { label: "Ayarlar", href: "/app/settings", icon: Store },
];

export const systemNavigation = [
  { label: "Sistem Paneli", href: "/app", icon: LayoutDashboard },
  { label: "İşletmeler", href: "/app/super-admin", icon: Building2 },
];
