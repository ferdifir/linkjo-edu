import { getAnnouncements, getStats } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Users, BarChart, Percent, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function DashboardPage() {
  const stats = await getStats();
  const announcements = await getAnnouncements();

  const statItems = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      description: 'The total number of enrolled students.',
    },
    {
      title: 'Average Attendance',
      value: `${stats.averageAttendance}%`,
      icon: Percent,
      description: 'The school-wide attendance rate.',
    },
    {
      title: 'Average Grade',
      value: `${stats.averageGrade}%`,
      icon: FileText,
      description: 'The school-wide average grade.',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        School Dashboard
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

      <Card>
        <CardHeader>
          <CardTitle>School-Wide Announcements</CardTitle>
          <CardDescription>
            Recent updates and news from the school administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={announcement.id}>
                <div className="space-y-1">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Posted by {announcement.author} on{' '}
                    {new Date(announcement.date).toLocaleDateString('en-US', {
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
