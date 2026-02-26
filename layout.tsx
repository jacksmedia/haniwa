import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";

import 'bootstrap/dist/css/bootstrap.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navLinks = [
  { href: '/', label: 'Home' },
  { href: 'guides', label: 'Guides' },
  { href: '/discord', label: 'Discord' }
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <html lang="en">
      <Head>
        <title>FFL2 AHC Patcher</title>
        <meta name="description" content="Get SaGa2 AHC" title="SaGa2 AHC Patcher" />
        <link rel="icon" href="https://ff6asc.vercel.app/img/favicon.png" sizes="any" />
      </Head>

      <body>
          <ul className="nav d-flex justify-content-center">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} passHref>
                <li
                  className={`nav-item  ${
                    router.pathname === href ? 'nav-l1nk active' : 'nav-l1nk'
                  }`}
                >
                  {label}
                </li>
              </Link>
            ))}
          </ul>
          <main>{children}</main>
        </body>
      </html>
  );
};

export default Layout;
