"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";

// Validation schema
const formSchema = z.object({
  email: z.string().min(1, "Email je obavezan").email("Unesite ispravan email"),
  lozinka: z.string().min(4, "Lozinka mora imati najmanje 4 karaktera"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      lozinka: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("/api/auth/login", {
        email: values.email,
        password: values.lozinka,
      });

      if (data.success) {
        setCookie("auth_token", data.token, {
          maxAge: 60 * 60 * 24 * 7, // Trajanje u periodu od 7 dana
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        setCookie("user_email", values.email, {
          maxAge: 60 * 60 * 24 * 7, // Kolacic traje 1 nedelju
          path: "/",
        });

        router.push("/");
        router.refresh();
      } else {
        setError(data.message || "Došlo je do greške prilikom prijave");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("Došlo je do greške prilikom prijavljivanja");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Prijava</h1>
        <p className="text-muted-foreground">Unesite svoje podatke za pristup nalogu</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email adresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ime@example.com"
                    {...field}
                    autoComplete="email"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lozinka"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Prijavljivanje...
              </>
            ) : (
              "Prijavi se"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
