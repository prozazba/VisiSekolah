export const siteConfig = {
  name: "SMA VisiSekolah",
  description: "Portal Resmi SMA VisiSekolah - Unggul dalam Prestasi dan Karakter",
  url: "https://sma-visisekolah.sch.id",
  ogImage: "https://sma-visisekolah.sch.id/og.jpg",
  links: {
    twitter: "https://twitter.com/smavisisekolah",
    github: "https://github.com/prozazba/VisiSekolah",
  },
  mainNav: [
    {
      title: "Keunggulan",
      href: "/features",
    },
    {
      title: "Profil",
      href: "/about",
    },
    {
      title: "Kontak",
      href: "/contact",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
