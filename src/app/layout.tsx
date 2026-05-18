import type { Metadata } from "next";
import { Inter, Outfit, Roboto, Poppins } from "next/font/google";
import "../styles/globals.scss";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { getBranding } from "@/app/actions/branding";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], variable: "--font-roboto", subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "700"], variable: "--font-poppins", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBranding();
  return {
    title: branding?.name ? `${branding.name} | Portal Resmi` : "SMA VisiSekolah | Unggul dalam Prestasi dan Karakter",
    description: "Portal resmi pendidikan terintegrasi untuk siswa, guru, dan orang tua.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBranding();

  // Determine font variable based on branding
  let fontVariable = inter.variable;
  if (branding?.fontFamily === 'Outfit') fontVariable = outfit.variable;
  else if (branding?.fontFamily === 'Roboto') fontVariable = roboto.variable;
  else if (branding?.fontFamily === 'Poppins') fontVariable = poppins.variable;

  const brandingStyles = {
    '--primary-color': branding?.primaryColor || '#6366f1',
    '--secondary-color': branding?.secondaryColor || '#a855f7',
    '--accent-color': branding?.accentColor || '#10b981',
    '--font-family': branding?.fontFamily === 'Outfit' ? 'var(--font-outfit)' : 
                     branding?.fontFamily === 'Roboto' ? 'var(--font-roboto)' :
                     branding?.fontFamily === 'Poppins' ? 'var(--font-poppins)' : 'var(--font-inter)',
  } as React.CSSProperties;

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {branding?.faviconUrl && <link rel="icon" href={branding.faviconUrl} />}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={branding?.primaryColor || '#6366f1'} />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${roboto.variable} ${poppins.variable}`} style={brandingStyles}>
        <LanguageProvider initialBranding={branding || {
          name: 'SMA VisiSekolah',
          primaryColor: '#6366f1',
          secondaryColor: '#a855f7',
          accentColor: '#10b981',
          fontFamily: 'Outfit',
        }}>
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
