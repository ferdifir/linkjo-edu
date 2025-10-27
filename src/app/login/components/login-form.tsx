'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { loginAction } from '../actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
  password: z.string().min(1, { message: 'Password harus diisi.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: 'admin@sekolah.edu',
      password: 'admin123',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    // Convert data to FormData to match the server action
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await loginAction({}, formData);

    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: result.error,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle>Login Guru</CardTitle>
            <CardDescription>Masukkan kredensial Anda untuk mengakses dasbor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="anda@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
