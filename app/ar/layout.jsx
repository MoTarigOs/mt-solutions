import '@styles/Main.css';

const baseUrl = 'https://www.motarig.com';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'MT SOLUTIONS - محمد طارق',
  description: 'استكشف معرض أعمال محمد طارق: تطوير مواقع، تطبيقات موبايل، هندسة أنظمة، تصميم ألعاب، واجهات مستخدم، وحلول التصميم الجرافيكي.',
  icons: {
    icon: '/mt-logo2.png',
    shortcut: '/mt-logo2.png',
    apple: '/mt-logo2.png',
  },
  openGraph: {
    title: 'MT SOLUTIONS - محمد طارق',
    description: 'استكشف معرض أعمال محمد طارق: تطوير مواقع، تطبيقات موبايل، هندسة أنظمة، تصميم ألعاب، واجهات مستخدم، وحلول التصميم الجرافيكي.',
    url: `${baseUrl}/ar`,
    siteName: 'MT SOLUTIONS',
    images: [
      {
        url: '/site_metaimage.png',
        width: 1200,
        height: 630,
        alt: 'MT SOLUTIONS - محمد طارق',
      },
    ],
    locale: 'ar_SD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MT SOLUTIONS - محمد طارق',
    description: 'استكشف معرض أعمال محمد طارق: تطوير مواقع، تطبيقات موبايل، هندسة أنظمة، تصميم ألعاب، واجهات مستخدم، وحلول التصميم الجرافيكي.',
    images: ['/site_metaimage.png'],
  },
  alternates: {
    canonical: `${baseUrl}/ar`,
    languages: {
      'ar': `${baseUrl}/ar`,
      'en': baseUrl,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="BigContainerDiv">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}