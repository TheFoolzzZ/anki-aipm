import type { Metadata } from 'next';
import { Suspense } from 'react';
import Studio from '@/components/studio';
import { ThemeInitializer } from '@/components/theme-picker';
import { THEME_BOOT_SCRIPT } from '@/lib/theme';
import './globals.css';
import './lesson-images.css';
import './themes.css';
export const metadata: Metadata={title:'Recall · AI PM 的长期记忆',description:'每天三十分钟，让知识成为直觉。'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN" data-theme="paper" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:THEME_BOOT_SCRIPT}} /></head><body><ThemeInitializer/>{children}<Suspense fallback={<div className="loading-screen">正在打开学习空间…</div>}><Studio/></Suspense></body></html>}
