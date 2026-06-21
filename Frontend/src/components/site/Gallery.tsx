import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import type { UIKey } from "../../i18n";

export default function Gallery({ images, t }: { images: string[]; t: (key: UIKey) => string }) {
  if (!images.length) return null;

  return (
    <section id="gallery" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("galleryBadge")} title={t("galleryTitle")} />
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <Reveal key={i} delay={(i % 4) * 0.06}>
            <div className="group overflow-hidden rounded-2xl shadow-soft">
              <img
                src={src}
                alt=""
                loading="lazy"
                className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                  i % 5 === 0 ? "h-64" : "h-44"
                }`}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
