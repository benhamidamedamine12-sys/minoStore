import './globals.css';
import { Providers } from './providers';
import Navbar from"../components/navbar/Navbar";
import Footer from '@/components/footer/Footer';


export const metadata = {
  title: 'MinoStore',
  description: 'Votre boutique en ligne',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}