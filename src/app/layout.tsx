import './globals.css';
import { Providers } from '../components/Providers';
import NavBar from '../components/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Providers>
          <NavBar />
          <main className="p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
