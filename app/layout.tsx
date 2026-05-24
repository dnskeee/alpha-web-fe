import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { AppFrame } from '@/components/frame/AppFrame';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeakerProvider } from '@/contexts/SpeakerContext';
import './globals.css';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'alpha',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

const noFoucScript = `
(function() {
  try {
    var p = localStorage.getItem('theme') || 'system';
    var d = p === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : p;
    document.documentElement.setAttribute('data-theme', d);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <SpeakerProvider>
              <AppFrame>{children}</AppFrame>
            </SpeakerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
