import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/components/UIProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComposerModal from "@/components/ComposerModal";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indiabulls Securities Community",
  description: "Community forum for Indiabulls Securities investors and traders.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem("ib-community-theme");
    if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${poppins.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <UIProvider>
          <Header />
          {children}
          <Footer />
          <ComposerModal />
        </UIProvider>
      </body>
    </html>
  );
}
