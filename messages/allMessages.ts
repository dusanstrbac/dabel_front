import { Locale } from '@/config/locales';

type MessagesLoader = () => Promise<{ default: any }>;

const allMessages: Record<Locale, MessagesLoader> = {
  sr: () => import('./sr.json'),
  en: () => import('./en.json'),
  mk: () => import('./mk.json'),
  al: () => import('./al.json'),
};

export default allMessages;
