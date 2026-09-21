import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Human-Sensing Electric Shock Prevention System | SUST',
  description:
    'A verified laboratory prototype that detects human approach or contact with a live conductor and isolates the circuit before harmful current can flow. Developed at Sudan University of Science and Technology, College of Engineering.',
  keywords: [
    'electric shock prevention',
    'capacitive sensing',
    'human proximity detection',
    'solid state relay',
    'ATmega328P',
    'SUST',
    'electronic engineering',
    'graduation project',
  ],
  authors: [{ name: 'Mohammed Tariq' }],
  creator: 'Mohammed Tariq',
  publisher: 'Sudan University of Science and Technology',
  openGraph: {
    title: 'Human-Sensing Electric Shock Prevention System',
    description:
      'Laboratory-verified system that senses human proximity/contact and cuts power before shock can occur. 5–21 ms response time.',
    url: 'https://www.motarig.com/academic/en',
    siteName: 'MT Solutions – Academic Projects',
    images: [
      {
        url: '/images/circuit_design.jpg',
        width: 1400,
        height: 1080,
        alt: 'Final circuit design of the human-sensing electric shock prevention system',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Human-Sensing Electric Shock Prevention System',
    description:
      'Capacitive human sensing + fast SSR isolation. Verified lab prototype from SUST Electronic Engineering.',
    images: ['/images/circuit_design.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.motarig.com/academic/en',
    languages: {
      'en': 'https://www.motarig.com/academic/en',
      'ar': 'https://www.motarig.com/academic/ar',
    },
  },
};

export default function AcademicEnLayout({ children }) {
  return (
    <div className={inter.className} lang="en" dir="ltr">
      {children}
    </div>
  );
}