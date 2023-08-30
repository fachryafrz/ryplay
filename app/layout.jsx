import "./globals.css";
import { Outfit } from "next/font/google";
import Navbar from "./sections/Navbar";
import Footer from "./sections/Footer";
import Copyright from "./sections/Copyright";
const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: process.env.APP_NAME,
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-outfit bg-primary-bg text-white`}>
        {/* Navbar */}
        <Navbar />

        <main className={`min-h-[100dvh] md:container mx-auto px-4 xl:px-36`}>
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Copyright */}
        <Copyright />
      </body>
    </html>
  );
}
