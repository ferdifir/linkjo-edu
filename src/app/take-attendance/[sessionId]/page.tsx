'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSessionDetails, markPresentAction, endSessionAction } from './actions';
import { AttendanceSession, StudentAttendance } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, CheckCircle, XCircle, Nfc, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function TakeAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { toast } = useToast();

  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSession = useCallback(async () => {
    const sessionDetails = await getSessionDetails(sessionId);
    if (sessionDetails) {
      setSession(sessionDetails);
    } else {
      setError('Sesi kehadiran tidak ditemukan.');
    }
    setIsLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsNfcSupported(true);
    }
    fetchSession();
    const interval = setInterval(fetchSession, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [fetchSession]);

  const handleScan = useCallback(async () => {
    if (!isNfcSupported || !session?.isActive) return;

    try {
      const ndef = new (window as any).NDEFReader();
      abortControllerRef.current = new AbortController();
      setIsScanning(true);
      toast({ title: 'Mendengarkan...', description: 'Tempelkan kartu NFC siswa ke perangkat.' });

      await ndef.scan({ signal: abortControllerRef.current.signal });

      ndef.onreading = async (event: any) => {
        const serialNumber = event.serialNumber;
        const result = await markPresentAction(sessionId, serialNumber);

        if (result.success) {
          toast({
            title: 'Berhasil!',
            description: `${result.studentName} ditandai hadir.`,
          });
          fetchSession(); // Re-fetch data immediately
        } else {
          toast({
            variant: 'destructive',
            title: 'Gagal',
            description: result.error,
          });
        }
      };

    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error NFC', description: 'Gagal memulai pemindaian NFC.' });
      setIsScanning(false);
    }
  }, [isNfcSupported, sessionId, toast, fetchSession, session]);

  useEffect(() => {
    if (isNfcSupported && session?.isActive) {
      handleScan();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setIsScanning(false);
      }
    };
  }, [isNfcSupported, session?.isActive, handleScan]);
  
  const handleEndSession = async () => {
    const result = await endSessionAction(sessionId);
    if(result.success) {
      toast({ title: "Sesi Selesai", description: "Sesi kehadiran telah berhasil ditutup."});
      router.push('/dashboard');
    } else {
      toast({ variant: 'destructive', title: 'Gagal', description: result.error });
    }
  }


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  }

  if (!session) {
    return <div className="flex h-screen items-center justify-center">Sesi tidak ditemukan.</div>;
  }

  const presentCount = session.students.filter(s => s.status === 'present').length;
  const totalCount = session.students.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{session.courseName}</h1>
                <p className="text-muted-foreground">{session.class} - {session.teacherName}</p>
            </div>
            {session.isActive && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><LogOut className="mr-2 h-4 w-4"/> Akhiri Sesi</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan mengakhiri sesi kehadiran. Anda tidak dapat membatalkan tindakan ini dan siswa tidak dapat lagi melakukan presensi.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleEndSession}>Ya, Akhiri Sesi</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {!session.isActive && (
                <Button variant="outline" onClick={() => router.push('/dashboard')}>Kembali ke Dasbor</Button>
            )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Status Kehadiran</h2>
              <div className="flex justify-between items-center">
                <span className="text-5xl font-bold">{presentCount}/{totalCount}</span>
                <div className="text-right">
                  <p className="font-semibold">Hadir</p>
                  <p className="text-sm text-muted-foreground">Total Siswa</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Status Sesi</h2>
                {session.isActive ? (
                    <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2"/> Aktif
                    </div>
                ): (
                     <div className="flex items-center text-red-600">
                        <XCircle className="mr-2"/> Selesai
                    </div>
                )}
                 {session.isActive && isNfcSupported && (
                    <div className="mt-4 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                        <Nfc className={`h-16 w-16 text-gray-400 ${isScanning ? 'animate-pulse text-primary' : ''}`}/>
                        <p className="mt-2 text-sm text-muted-foreground text-center">
                            {isScanning ? 'Mendengarkan pemindaian kartu NFC...' : 'Pemindai NFC siap.'}
                        </p>
                    </div>
                )}
                 {session.isActive && !isNfcSupported && (
                    <div className="mt-4 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-yellow-50 text-yellow-800">
                        <Nfc className="h-16 w-16"/>
                        <p className="mt-2 text-sm font-semibold text-center">
                           Web NFC tidak didukung di browser ini. Gunakan Chrome di Android untuk mengaktifkan pemindaian.
                        </p>
                    </div>
                )}

            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Daftar Siswa</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {session.students.map(student => {
                 const avatarData = PlaceHolderImages.find(img => img.id === student.avatar);
                 const initials = student.name.split(' ').map((n) => n[0]).join('');
                 return (
                    <div key={student.studentId} className={`border rounded-lg p-2 text-center transition-all ${student.status === 'present' ? 'bg-green-100 border-green-300' : 'bg-gray-50'}`}>
                      <Avatar className="mx-auto h-16 w-16 mb-2">
                        <AvatarImage src={avatarData?.imageUrl} alt={student.name} data-ai-hint={avatarData?.imageHint}/>
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      {student.status === 'present' ? (
                        <div className="text-xs text-green-600 flex items-center justify-center"><CheckCircle className="h-3 w-3 mr-1"/> Hadir</div>
                      ) : (
                         <div className="text-xs text-gray-500 flex items-center justify-center"><XCircle className="h-3 w-3 mr-1"/> Belum Hadir</div>
                      )}
                    </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
