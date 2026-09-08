import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComposerModal from "@/components/ComposerModal";
import SignInModal from "@/components/SignInModal";
import Toast from "@/components/Toast";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const title = "Indiabulls Securities Community";
const description =
  "Community forum for Indiabulls Securities investors and traders — markets discussion, IPOs, mutual funds, derivatives, and investor education.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s — ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem("ib-community-theme");
    if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ComposerModal />
          <SignInModal />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
