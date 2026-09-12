import '@styles/Main.css';

export const metadata = {
  title: 'MT SOLUTIONS - محمد طارق',
  description: 'Explore the portfolio of Mohamed Tarig, offering expert web dev, mobile apps, systems engineering, game creation, UI/UX, and graphic design solutions.',
  icons: {
    icon: '/mt-logo2.png', // Path to your standard favicon (e.g., 32x32)
    shortcut: '/mt-logo2.png', // Fallback for older browsers
    apple: '/mt-logo2.png', // Icon for iOS home screen (e.g., 180x180)
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
