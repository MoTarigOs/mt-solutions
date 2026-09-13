import '@styles/Main.css';

const baseUrl = 'https://www.motarig.com';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'MT SOLUTIONS - محمد طارق',
  description: 'Explore the portfolio of Mohamed Tarig, offering expert web dev, mobile apps, systems engineering, game creation, UI/UX, and graphic design solutions.',
  icons: {
    icon: '/mt-logo2.png', // Path to your standard favicon (e.g., 32x32)
    shortcut: '/mt-logo2.png', // Fallback for older browsers
    apple: '/mt-logo2.png', // Icon for iOS home screen (e.g., 180x180)
  },
  openGraph: {
    title: 'MT SOLUTIONS - محمد طارق',
    description: 'Explore the portfolio of Mohamed Tarig, offering expert web dev, mobile apps, systems engineering, game creation, UI/UX, and graphic design solutions.',
    url: baseUrl,
    siteName: 'MT SOLUTIONS',
    images: [
      {
        url: '/site_metaimage.png',
        width: 1200,
        height: 630,
        alt: 'MT SOLUTIONS - Mohamed Tarig',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MT SOLUTIONS - محمد طارق',
    description: 'Explore the portfolio of Mohamed Tarig, offering expert web dev, mobile apps, systems engineering, game creation, UI/UX, and graphic design solutions.',
    images: ['/site_metaimage.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="BigContainerDiv">
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}