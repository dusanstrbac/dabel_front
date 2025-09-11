// i18n.ts
import { createInstance } from 'i18next';
import { i18nConfig } from './i18nConfig';

const initTranslations = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();

  // Inicijalizacija
  await i18nInstance.init({
    lng: locale,
    fallbackLng: i18nConfig.fallbackLng,
    ns: namespaces,
    defaultNS: 'common',
    preload: typeof window === 'undefined' ? i18nConfig.locales : [],
  });

  // Dinamičko učitavanje prevoda
  for (const namespace of namespaces) {
    const translation = await import(`../public/messages/${locale}/${namespace}.json`);
    i18nInstance.addResourceBundle(locale, namespace, translation.default);
  }

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
  };
};

export default initTranslations;