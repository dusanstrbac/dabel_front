// layout.tsx
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {ParametriWatcher} from "@/components/ui/ParametriWatcher";
import {Providers} from "@/providers/provides";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";
import {isLocale, defaultLocale} from '../locales';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Umesto notFound(), koristite defaultLocale
  const currentLocale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages();

  return (
    <html lang={currentLocale}>
      <body>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
        <ParametriWatcher/>
        <Toaster
          toastOptions={{
            classNames: {
              error: "toast-error",
              success: "toast-info"
            }
          }}
        />
      </body>
    </html>
  );
}