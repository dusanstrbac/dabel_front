"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sema za validaciju
const formSchema = z.object({
  email: z.string().email("Unesite ispravan email"),
  lozinka: z.string().min(4, "Lozinka mora imati najmanje 4 karaktera"),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      lozinka: "",
    },
  });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Prijava podaci:", values);
        // MESTO ZA API POZIV
    }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Prijava</h1>
        <p className="text-gray-500">Popunite polja ispod da bi ste se prijavili</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email polje */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Email</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input 
                    placeholder="ime@gmail.com" 
                    {...field} 
                    className="mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Lozinka polje */}
          <FormField
            control={form.control}
            name="lozinka"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Lozinka</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            Prijava
          </Button>
        </form>
      </Form>
    </div>
  );
}