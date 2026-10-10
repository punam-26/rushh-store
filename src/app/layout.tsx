import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/lib/store";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Rushh. Power your pace", template: "%s · Rushh." },
  description: "Smartphones, laptops, headphones and earbuds. Good tech, no second guesses.",
};

const themeScript = `try{var t=localStorage.getItem('rushh:theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <StoreProvider>
          <Header />
          <main className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-14">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
