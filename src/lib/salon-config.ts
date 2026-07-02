export const salonConfig = {
  name: process.env.SALON_NAME ?? "Salon",
  tagline: process.env.SALON_TAGLINE ?? "Vaš zanesljiv frizerski salon",
  description:
    process.env.SALON_DESCRIPTION ??
    "Profesionalno striženje, barvanje in nega las v prijetnem ambientu. Naša ekipa izkušenih frizerjev skrbi, da se boste počutili in izgledali najbolje.",
  yearsExperience: process.env.SALON_YEARS ?? "15+",
  teamSize: process.env.SALON_TEAM_SIZE ?? "5",
  address: process.env.SALON_ADDRESS ?? "Ulica 1",
  city: process.env.SALON_CITY ?? "1000 Ljubljana",
  phone: process.env.SALON_PHONE ?? "01 234 56 78",
  email: process.env.SALON_EMAIL ?? "info@salon.si",
  hours: {
    weekdays: { label: "Ponedeljek – petek", time: "8:00 – 18:00" },
    saturday: { label: "Sobota", time: "9:00 – 13:00" },
    sunday: { label: "Nedelja", time: "Zaprto" },
  },
  social: {
    facebook: process.env.SALON_FACEBOOK ?? "",
    instagram: process.env.SALON_INSTAGRAM ?? "",
  },
};

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    alt: "Interier frizerskega salona",
  },
  {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
    alt: "Striženje las",
  },
  {
    src: "https://images.unsplash.com/photo-1633681926022-84c23e8cb04d?w=800&q=80",
    alt: "Barvanje las",
  },
  {
    src: "https://images.unsplash.com/photo-1595476108010-b4c1e778a592?w=800&q=80",
    alt: "Frizura",
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    alt: "Nega las",
  },
  {
    src: "https://images.unsplash.com/photo-1605497788043-6a5f9c1d93f6?w=800&q=80",
    alt: "Salon ambient",
  },
];

export const heroImage =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=85";

export const aboutImage =
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb04d?w=900&q=80";
