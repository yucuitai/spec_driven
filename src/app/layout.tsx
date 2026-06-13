import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Spec-Driven - 交互式开发文档生成工具',
  description: '从想法到 Phase 拆解到 AGENTS.md 生成，一站式搞定 Spec-Driven 全流程',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
