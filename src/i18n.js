// src/i18n.js

import { init, getLocaleFromNavigator, register, locale } from 'svelte-i18n';
import { onMount } from 'svelte';
// 注册多语言文件
register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));
register('ar', () => import('./locales/ar.json'));
register('da', () => import('./locales/da.json'));
register('de', () => import('./locales/de.json'));
register('es', () => import('./locales/es.json'));
register('fi', () => import('./locales/fi.json'));
register('fr', () => import('./locales/fr.json'));
register('hi', () => import('./locales/hi.json'));
register('it', () => import('./locales/it.json'));
register('ja', () => import('./locales/ja.json'));
register('ko', () => import('./locales/ko.json'));
register('nl', () => import('./locales/nl.json'));
register('no', () => import('./locales/no.json'));
register('pl', () => import('./locales/pl.json'));
register('pt', () => import('./locales/pt.json'));
register('ru', () => import('./locales/ru.json'));
register('sv', () => import('./locales/sv.json'));
register('th', () => import('./locales/th.json'));
register('tr', () => import('./locales/tr.json'));
register('vi', () => import('./locales/vi.json'));

init({
  fallbackLocale: 'en',
  initialLocale:'en'
});
locale.set('en');