drop type if exists public.module_key cascade;

create type public.module_key as enum (
  'appointments',
  'customers',
  'staff',
  'services',
  'whatsapp',
  'stock',
  'product_sales',
  'tickets',
  'finance',
  'receivables',
  'installments',
  'payments',
  'performance',
  'commissions',
  'surveys',
  'advanced_permissions',
  'multi_branch',
  'package_tracking'
);;
