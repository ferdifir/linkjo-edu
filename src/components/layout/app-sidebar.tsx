'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CalendarDays,
  Megaphone,
  FileText,
  CheckSquare,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/students', label: 'Siswa', icon: Users },
  { href: '/schedule', label: 'Jadwal', icon: CalendarDays },
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone },
  { href: '/grades', label: 'Nilai', icon: FileText, disabled: true },
  { href: '/attendance', label: 'Kehadiran', icon: CheckSquare, disabled: false },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <GraduationCap className="size-8 text-primary" />
          <span className="text-lg font-semibold">Linkjo</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                disabled={item.disabled}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
