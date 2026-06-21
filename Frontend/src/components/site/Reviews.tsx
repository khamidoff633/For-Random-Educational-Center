import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Avatar from "../ui/Avatar";
import type { ReviewItem } from "../../types";
import type { UIKey } from "../../i18n";

export default function Reviews({ reviews, t }: { reviews: ReviewItem[]; t: (key: UIKey) => string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (!reviews.length) return null;
  const review = reviews[Math.min(index, reviews.length - 1)];
  const rating = Math.max(1, Math.min(5, review.rating || 5));

  return (
    <section className="bg-cream-soft py-24">
      <div className="mx-auto w-[92%] max-w-4xl">
        <SectionHeading eyebrow={t("reviewsSubtitle")} title={t("reviewsTitle")} />

        <div className="relative mt-12">
          <div className="card-soft rounded-3xl p-8 text-center sm:p-12">
            <Quote size={40} className="mx-auto text-caramel/40" />
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-charcoal">"{review.text}"</p>
            <div className="mt-6 flex items-center justify-center gap-1 text-caramel">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Avatar
                name={review.name}
                src={review.avatar}
                className="h-12 w-12 rounded-full border-2 border-caramel/30"
                fontClass="text-sm"
              />
              <div className="text-left">
                <p className="font-display font-bold text-charcoal">{review.name}</p>
                <p className="text-xs font-semibold text-caramel-deep">{review.role}</p>
              </div>
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal-soft transition hover:text-caramel-deep"
                aria-label="Oldingi"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-caramel" : "w-2 bg-black/15"}`}
                    aria-label={`${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIndex((i) => (i + 1) % reviews.length)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal-soft transition hover:text-caramel-deep"
                aria-label="Keyingi"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
