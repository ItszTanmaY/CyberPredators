import './globals.css';
import { Public_Sans, Literata, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import PortalHeader from '../components/PortalHeader';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-public-sans',
  display: 'swap',
});

const literata = Literata({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-literata',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600'],
  variable: '--font-noto-serif-devanagari',
  display: 'swap',
});

export const metadata = {
  title: 'NyayaLens - e-Courts Judicial Review & Document Organization Portal',
  description: 'National Court Judgment Intelligence & Document Organization Portal. Ministry of Law & Justice, Government of India.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${literata.variable} ${notoSansDevanagari.variable} ${notoSerifDevanagari.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-page text-text font-sans antialiased">
        <AuthProvider>
          {/* Official Government Portal Header */}
          <PortalHeader />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
