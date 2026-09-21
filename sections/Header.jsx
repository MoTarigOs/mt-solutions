'use client';

import React from 'react';
import Link from 'next/link';
import { Languages } from 'lucide-react';
import Image from 'next/image';
import mtLogo from '@assets/images/mt-logo-asset.png';

export default function Header({ isArabic = false }) {
  const homeHref = isArabic ? '/ar' : '/';
  const langHref = isArabic ? '/academic/en' : '/academic/ar';
  const langLabel = isArabic ? 'English / EN' : 'العربية / AR';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Logo → home */}
        <Link
          href={homeHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
            <Image src={mtLogo} alt='MT Solutions | Mohamed Tarig website logo'
                width={36} height={36}/>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0F172A',
              }}
            >
              MT Solutions
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#64748B',
                fontWeight: 500,
              }}
            >
              {isArabic ? 'محمد طارق' : 'Mohamed Tarig'}
            </span>
          </div>
        </Link>

        {/* Language switch */}
        {/* <Link
          href={langHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: '#EFF6FF',
            color: '#1E3A8A',
            border: '1px solid #BFDBFE',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.15s ease',
          }}
        >
          <Languages size={14} />
          {langLabel}
        </Link> */}
      </div>

      {/* Responsive tweaks */}
      <style jsx>{`
        @media (max-width: 640px) {
          .header-inner {
            padding: 0.7rem 1rem !important;
          }
        }

        @media (max-width: 400px) {
          .header-inner {
            padding: 0.6rem 0.75rem !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </header>
  );
}