import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import type { Language } from "../../types";
import type { UIKey } from "../../i18n";

const FAQS: Record<Language, { q: string; a: string }[]> = {
  uz: [
    { q: "Darslar qachon boshlanadi?", a: "Yangi guruhlar har oy ochiladi. Aniq sanani bilish uchun ariza qoldiring — operatorlarimiz bog'lanadi." },
    { q: "Sinov darsi bormi?", a: "Ha, har bir yo'nalish bo'yicha bepul sinov darsida qatnashishingiz mumkin." },
    { q: "To'lov qanday amalga oshiriladi?", a: "To'lov oylik asosda, naqd yoki karta orqali amalga oshiriladi. Chegirmalar mavjud." },
    { q: "Daraja qanday aniqlanadi?", a: "Birinchi darsdan oldin bepul daraja aniqlash testi o'tkaziladi va sizga mos guruh tanlanadi." },
    { q: "Sertifikat beriladimi?", a: "Kursni muvaffaqiyatli tugatgan o'quvchilarga markaz sertifikati taqdim etiladi." },
  ],
  ru: [
    { q: "Когда начинаются занятия?", a: "Новые группы открываются каждый месяц. Оставьте заявку — мы сообщим точную дату." },
    { q: "Есть ли пробный урок?", a: "Да, вы можете посетить бесплатный пробный урок по любому направлению." },
    { q: "Как происходит оплата?", a: "Оплата ежемесячная, наличными или картой. Доступны скидки." },
    { q: "Как определяется уровень?", a: "Перед первым уроком проводится бесплатный тест на определение уровня." },
    { q: "Выдаётся ли сертификат?", a: "Студентам, успешно завершившим курс, выдаётся сертификат центра." },
  ],
  en: [
    { q: "When do classes start?", a: "New groups open every month. Leave a request and we'll share the exact date." },
    { q: "Is there a trial lesson?", a: "Yes, you can attend a free trial lesson for any track." },
    { q: "How is payment handled?", a: "Payment is monthly, by cash or card. Discounts are available." },
    { q: "How is my level assessed?", a: "A free placement test is held before your first lesson to match you to a group." },
    { q: "Do you provide a certificate?", a: "Students who complete the course receive an academy certificate." },
  ],
};

export default function FAQ({ lang, t }: { lang: Language; t: (key: UIKey) => string }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQS[lang] ?? FAQS.en;

  return (
    <section id="faq" className="mx-auto w-[92%] max-w-3xl py-24">
      <SectionHeading eyebrow={t("faqBadge")} title={t("faqTitle")} description={t("faqDesc")} />

      <div className="mt-12 space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 0.05}>
              <div className="card-soft overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display font-semibold text-charcoal">{item.q}</span>
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? "bg-caramel text-white" : "bg-caramel/12 text-caramel-deep"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-charcoal-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
