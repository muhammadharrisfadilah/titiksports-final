import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-100 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-center py-4 px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="TITIK SPORTS"
            width={98}
            height={58}
            priority
          />
        </Link>
      </div>
    </header>
  );
}