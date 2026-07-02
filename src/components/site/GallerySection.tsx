import Image from "next/image";
import { galleryImages } from "@/lib/salon-config";

export function GallerySection() {
  return (
    <section id="galerija" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">Galerija</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Naš salon</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Poglejte si naš prostor in prepričajte se o kakovosti našega dela.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryImages.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl ${
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto lg:min-h-[320px]" : "aspect-square"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 33vw"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
