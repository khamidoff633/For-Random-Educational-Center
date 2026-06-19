import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import type { UIKey } from "../../i18n";

const REVIEWS = [
  {
    name: "Nigora Tosheva",
    role: "IELTS 7.5",
    text: "Ustozlar juda professional. 4 oyda IELTS ballimni 5.5 dan 7.5 ga ko'tardim. Muhit va yondashuv a'lo darajada!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Jasur Komilov",
    role: "Web Frontend",
    text: "Noldan boshlab haqiqiy loyihalar ustida ishladik. Kursdan keyin birinchi ishimga joylashdim. Rahmat!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Dilnoza Karimova",
    role: "General English",
    text: "Kichik guruhlar va individual yondashuv menga juda yoqdi. Endi ingliz tilida erkin gaplasha olaman.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Reviews({ t }: { t: (key: UIKey) => string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const review = REVIEWS[index];

  return (
    <section className="bg-cream-soft py-24">
      <div className="mx-auto w-[92%] max-w-4xl">
        <SectionHeading eyebrow={t("reviewsSubtitle")} title={t("reviewsTitle")} />

        <div className="relative mt-12">
          <div className="card-soft rounded-3xl p-8 text-center sm:p-12">
            <Quote size={40} className="mx-auto text-caramel/40" />
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-charcoal">
              "{review.text}"
            </p>
            <div className="mt-6 flex items-center justify-center gap-1 text-caramel">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-3">
              <img
                src={review.avatar}
                alt={review.name}
                className="h-12 w-12 rounded-full border-2 border-caramel/30 object-cover"
              />
              <div className="text-left">
                <p className="font-display font-bold text-charcoal">{review.name}</p>
                <p className="text-xs font-semibold text-caramel-deep">{review.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal-soft transition hover:text-caramel-deep"
              aria-label="Oldingi"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-caramel" : "w-2 bg-black/15"
                  }`}
                  aria-label={`${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => (i + 1) % REVIEWS.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal-soft transition hover:text-caramel-deep"
              aria-label="Keyingi"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
