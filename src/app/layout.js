import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "./AuthContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog Axoria",
  description: "Blog créé avec Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${roboto.variable} ${inter.variable} flex min-h-full flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="grow">{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
