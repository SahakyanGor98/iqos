import {
  Home,
  type LucideIcon,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-react';

/**
 * Single source of truth for the admin navigation. Shared by AdminSidebar (links
 * + active state) and AdminHeader (page title), so the two never drift.
 */
export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match the pathname exactly (used for the dashboard root so it isn't active
   *  on every /admin/* sub-route). */
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Панель управления', href: '/admin', icon: Home, exact: true },
  { label: 'Товары', href: '/admin/products', icon: Package },
  { label: 'Заказы', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Сообщения', href: '/admin/messages', icon: MessageSquare },
  { label: 'Настройки', href: '/admin/settings', icon: Settings },
];

export function isNavItemActive(item: AdminNavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getActiveNavTitle(pathname: string): string {
  const match = ADMIN_NAV.find((item) => isNavItemActive(item, pathname));
  return match?.label ?? 'Админ-панель';
}
