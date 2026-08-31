import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Providers } from './providers';

export const metadata = {
  title: 'NovaMart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('novamart_theme')||'dark';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t==='light'?'light':'dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 dark:bg-[#0b0b0d] dark:text-zinc-100">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
