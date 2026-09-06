import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Recall · AI PM 的长期记忆',description:'每天三十分钟，让知识成为直觉。'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
