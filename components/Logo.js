'use client';

import React from 'react';
import Link from 'next/link';

export default function Logo({ size = 'md', showText = true, href = '/' }) {
  const sizeMap = {
    sm: { img: 32, text: 'text-[16px]', subtext: 'text-[9px]' },
    md: { img: 40, text: 'text-[19px]', subtext: 'text-[10px]' },
    lg: { img: 56, text: 'text-[24px]', subtext: 'text-[12px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="rounded-full overflow-hidden border border-border/80 bg-surface flex-shrink-0 shadow-xs flex items-center justify-center"
        style={{ width: `${currentSize.img}px`, height: `${currentSize.img}px` }}
      >
        <img
          src="/logo.jpg"
          alt="NyayaLens Emblem - National Judicial Portal"
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-cover"
          style={{ width: `${currentSize.img}px`, height: `${currentSize.img}px`, objectFit: 'cover' }}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-semibold tracking-tight text-text leading-tight ${currentSize.text}`}>
            NyayaLens
          </span>
          <span className={`text-muted uppercase tracking-wider font-sans leading-none mt-0.5 ${currentSize.subtext}`}>
            न्याय समीक्षा पोर्टल &bull; e-Courts
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity min-h-[44px] flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
