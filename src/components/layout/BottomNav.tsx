'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  {
    label: 'Matches',
    icon: '⚽',
    href: '/',
  },
  {
    label: 'Leagues',
    icon: '🏆',
    href: '/leagues',
  },
  {
    label: 'Standings',
    icon: '📊',
    href: '/standings',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[480px] w-full bg-surface/98 backdrop-blur-sm border-t border-border z-[99]">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center flex-1 py-2 rounded-lg transition-all',
                'hover:bg-background',
                isActive && 'text-primary'
              )}
            >
              <span 
                className={cn(
                  'text-[22px] mb-1 transition-transform',
                  isActive && '-translate-y-0.5'
                )}
              >
                {item.icon}
              </span>
              <span className="text-[11px]">{item.label}</span>
              
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-t" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}