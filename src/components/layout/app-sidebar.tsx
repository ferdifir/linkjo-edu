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
  BookOpen,
  MapPin,
  LogOut,
} from 'lucide-react';
import {
  SidebarHeader,
 SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { logoutAction } from '@/app/login/actions';
import { useEffect, useState } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/students', label: 'Siswa', icon: Users },
  { href: '/schedule', label: 'Jadwal', icon: CalendarDays },
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone },
  { href: '/grades', label: 'Nilai', icon: FileText },
  { href: '/attendance', label: 'Kehadiran', icon: CheckSquare },
];

const adminMenuItems = [
  { href: '/courses', label: 'Mata Pelajaran', icon: BookOpen },
  { href: '/locations', label: 'Lokasi & Ruang', icon: MapPin },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    // Check if user is admin
    fetch('/api/user')
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          // If not authenticated, don't set admin status
          return { role: null };
        }
      })
      .then(data => {
        if (data.role === 'ADMIN') {
          setIsAdminUser(true);
        }
      })
      .catch(error => {
        console.error('Error checking admin status:', error);
        // On error, assume not an admin
        setIsAdminUser(false);
      });
  }, []);

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
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {/* Admin-only menu items */}
          {isAdminUser && (
            <>
              <SidebarMenuItem className="pt-4">
                <span className="px-2 text-xs font-semibold text-muted-foreground uppercase">Admin</span>
              </SidebarMenuItem>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <form action={logoutAction}>
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </form>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
