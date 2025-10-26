import { getAnnouncements, getStats, getSchedule } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Users, Percent, FileText, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const stats = await getStats();
  const announcements = await getAnnouncements();
  const schedule = await getSchedule();

  const statItems = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents,
      icon: Users,
      description: 'Jumlah total siswa yang terdaftar.',
    },
    {
      title: 'Rata-rata Kehadiran',
      value: `${stats.averageAttendance}%`,
      icon: Percent,
      description: 'Tingkat kehadiran seluruh sekolah.',
    },
    {
      title: 'Rata-rata Nilai',
      value: `${stats.averageGrade}%`,
      icon: FileText,
      description: 'Nilai rata-rata seluruh sekolah.',
    },
  ];

  // Logic for Today's Schedule
  const now = new Date();
  const today = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() as keyof (typeof schedule)[0];
  const currentTime = now.getHours() * 60 + now.getMinutes(); 
  
  const todaySchedule = schedule.filter(event => event[today] && (event[today] as any).course !== 'Makan Siang');

  const upcomingClasses: any[] = [];
  const currentClasses: any[] = [];
  const finishedClasses: any[] = [];

  todaySchedule.forEach(event => {
    const [startTime, endTime] = event.time.split(' - ').map(t => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    });

    const classInfo = {
      ...event,
      classDetails: event[today]
    };

    if (currentTime < startTime) {
      upcomingClasses.push(classInfo);
    } else if (currentTime >= startTime && currentTime <= endTime) {
      currentClasses.push(classInfo);
    } else {
      finishedClasses.push(classInfo);
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Dasbor Sekolah
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {todaySchedule.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada kelas yang dijadwalkan untuk hari ini.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                
                <div className="space-y-4">
                   <h3 className="font-semibold flex items-center"><Clock className="mr-2 h-5 w-5 text-blue-500" /> Kelas yang Akan Datang</h3>
                   <div className="space-y-3">
                    {upcomingClasses.length > 0 ? upcomingClasses.map(c => (
                        <div key={c.time} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                           <p className="font-bold">{(c.classDetails as any).course}</p>
                           <p className="text-sm">{(c.classDetails as any).teacher}</p>
                           <p className="text-sm text-muted-foreground">{c.time}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">Tidak ada kelas yang akan datang.</p>}
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-semibold flex items-center"><BookOpen className="mr-2 h-5 w-5 text-orange-500" /> Kelas Saat Ini</h3>
                     <div className="space-y-3">
                    {currentClasses.length > 0 ? currentClasses.map(c => (
                        <div key={c.time} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                           <p className="font-bold">{(c.classDetails as any).course}</p>
                           <p className="text-sm">{(c.classDetails as any).teacher}</p>
                           <p className="text-sm text-muted-foreground">{c.time}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">Tidak ada kelas yang sedang berlangsung.</p>}
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-semibold flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Kelas Selesai</h3>
                   <div className="space-y-3">
                    {finishedClasses.length > 0 ? finishedClasses.map(c => (
                        <div key={c.time} className="p-3 bg-green-50 rounded-lg border border-green-200">
                           <p className="font-bold">{(c.classDetails as any).course}</p>
                           <p className="text-sm">{(c.classDetails as any).teacher}</p>
                           <p className="text-sm text-muted-foreground">{c.time}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">Belum ada kelas yang selesai.</p>}
                   </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengumuman Sekolah</CardTitle>
          <CardDescription>
            Pembaruan dan berita terkini dari administrasi sekolah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={announcement.id}>
                <div className="space-y-1">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Diterbitkan oleh {announcement.author} pada{' '}
                    {new Date(announcement.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm">{announcement.content}</p>
                </div>
                {index < announcements.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
