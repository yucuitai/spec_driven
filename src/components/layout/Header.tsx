'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAiSettings } from '@/lib/ai/store';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/wizard', label: '向导' },
  { href: '/preview/spec', label: 'Spec' },
  { href: '/preview/phases', label: 'Phase' },
  { href: '/preview/agents', label: 'AGENTS' },
  { href: '/export', label: '导出' },
];

export function Header() {
  const pathname = usePathname();
  const hasKey = useAiSettings((s) => Boolean(s.apiKey));

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">Spec-Driven</span>
        </Link>
        <nav className="flex items-center space-x-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-md transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'text-foreground font-medium bg-accent'
                  : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/settings"
            className={cn(
              'px-3 py-2 rounded-md transition-colors text-sm hover:text-foreground/80',
              pathname === '/settings'
                ? 'text-foreground font-medium bg-accent'
                : 'text-foreground/60'
            )}
          >
            {hasKey ? '🟢 AI 已配置' : '⚙️ 设置'}
          </Link>
        </div>
      </div>
    </header>
  );
}
