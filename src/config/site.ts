export const siteConfig = {
  name: "VisiSekolah",
  description: "Platform White Label Aplikasi Sekolah Terpadu",
  url: "https://visisekolah.id",
  ogImage: "https://visisekolah.id/og.jpg",
  links: {
    twitter: "https://twitter.com/visisekolah",
    github: "https://github.com/prozazba/VisiSekolah",
  },
  mainNav: [
    {
      title: "Fitur",
      href: "#features",
    },
    {
      title: "Harga",
      href: "#pricing",
    },
    {
      title: "Tentang",
      href: "#about",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
