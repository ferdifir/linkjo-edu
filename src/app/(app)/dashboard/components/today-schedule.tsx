'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import { ScheduleEvent } from '@/lib/types';
import { startSessionAction } from '../actions';
import { useToast } from '@/hooks/use-toast';

interface TodayScheduleProps {
  schedule: ScheduleEvent[];
}

interface EnrichedScheduleEvent extends ScheduleEvent {
  classDetails?: { course: string; teacher: string };
}

export function TodaySchedule({ schedule }: TodayScheduleProps) {
  const [todaySchedule, setTodaySchedule] = useState<EnrichedScheduleEvent[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<EnrichedScheduleEvent[]>([]);
  const [currentClasses, setCurrentClasses] = useState<EnrichedScheduleEvent[]>([]);
  const [finishedClasses, setFinishedClasses] = useState<EnrichedScheduleEvent[]>([]);
  const [todayString, setTodayString] = useState('');
  const [isStartingSession, setIsStartingSession] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() as keyof ScheduleEvent;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    setTodayString(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const filteredSchedule = schedule.filter(event => event[today] && (event[today] as any).course !== 'Makan Siang');

    const upcoming: EnrichedScheduleEvent[] = [];
    const current: EnrichedScheduleEvent[] = [];
    const finished: EnrichedScheduleEvent[] = [];

    filteredSchedule.forEach(event => {
      const [startTime, endTime] = event.time.split(' - ').map(t => {
        const [hours, minutes] = t.split(':').map(Number);
        return hours * 60 + minutes;
      });

      const classInfo: EnrichedScheduleEvent = {
        ...event,
        classDetails: event[today] as { course: string; teacher: string },
      };

      if (currentTime < startTime) {
        upcoming.push(classInfo);
      } else if (currentTime >= startTime && currentTime <= endTime) {
        current.push(classInfo);
      } else {
        finished.push(classInfo);
      }
    });

    setTodaySchedule(filteredSchedule);
    setUpcomingClasses(upcoming);
    setCurrentClasses(current);
    setFinishedClasses(finished);
  }, [schedule]);
  
  const handleStartSession = async (courseName: string, teacherName: string) => {
      setIsStartingSession(courseName);
      const result = await startSessionAction(courseName, teacherName);
      if (result?.error) {
          toast({
              variant: 'destructive',
              title: 'Gagal Memulai Sesi',
              description: result.error,
          });
      }
      // Redirect is handled by the server action, so no need to do anything on success
      setIsStartingSession(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Hari Ini</CardTitle>
        <CardDescription>{todayString}</CardDescription>
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
                    <p className="font-bold">{c.classDetails!.course}</p>
                    <p className="text-sm">{c.classDetails!.teacher}</p>
                    <p className="text-sm text-muted-foreground">{c.time}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Tidak ada kelas yang akan datang.</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center"><BookOpen className="mr-2 h-5 w-5 text-orange-500" /> Kelas Saat Ini</h3>
              <div className="space-y-3">
                {currentClasses.length > 0 ? currentClasses.map(c => (
                  <div key={c.time} className="relative p-3 bg-orange-50 rounded-lg border border-orange-200 overflow-hidden group">
                    <p className="font-bold">{c.classDetails!.course}</p>
                    <p className="text-sm">{c.classDetails!.teacher}</p>
                    <p className="text-sm text-muted-foreground">{c.time}</p>
                     <Button 
                        size="sm" 
                        className="absolute inset-0 w-full h-full bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => handleStartSession(c.classDetails!.course, c.classDetails!.teacher)}
                        disabled={isStartingSession === c.classDetails!.course}
                    >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        {isStartingSession === c.classDetails!.course ? 'Memulai...' : 'Mulai Sesi Presensi'}
                    </Button>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Tidak ada kelas yang sedang berlangsung.</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Kelas Selesai</h3>
              <div className="space-y-3">
                {finishedClasses.length > 0 ? finishedClasses.map(c => (
                  <div key={c.time} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-bold">{c.classDetails!.course}</p>
                    <p className="text-sm">{c.classDetails!.teacher}</p>
                    <p className="text-sm text-muted-foreground">{c.time}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Belum ada kelas yang selesai.</p>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
