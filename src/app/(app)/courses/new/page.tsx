'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    schedule: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menambahkan mata pelajaran');
      }

      // Success - redirect to courses page
      router.push('/courses');
      router.refresh();
    } catch (error) {
      console.error('Error adding course:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambahkan mata pelajaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Tambah Mata Pelajaran Baru
      </h1>

      <div style={{ border: '1px solid #e5e5e5', borderRadius: '0.5rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          Form Mata Pelajaran
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nama Mata Pelajaran
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama mata pelajaran"
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
              Contoh: Matematika, Bahasa Indonesia, dll.
            </p>
          </div>

          <div>
            <label htmlFor="teacher" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nama Guru
            </label>
            <input
              id="teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              placeholder="Masukkan nama guru pengajar"
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
              Nama guru yang mengajar mata pelajaran ini.
            </p>
          </div>

          <div>
            <label htmlFor="schedule" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Jadwal (Opsional)
            </label>
            <input
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="Contoh: Senin-Rabu-Jumat 09:00-10:00"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
              Jadwal pelaksanaan mata pelajaran.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                borderRadius: '0.25rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Mata Pelajaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
