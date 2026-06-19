export type Language = "uz" | "ru" | "en";

const dictionary: Record<string, Record<Language, string>> = {
  // Course levels
  "Advanced (C1)": {
    uz: "Mukammal (C1)",
    ru: "Продвинутый (C1)",
    en: "Advanced (C1)"
  },
  "Upper-Intermediate (B2)": {
    uz: "O'rtadan yuqori (B2)",
    ru: "Выше среднего (B2)",
    en: "Upper-Intermediate (B2)"
  },
  "Intermediate (B1)": {
    uz: "O'rta (B1)",
    ru: "Средний (B1)",
    en: "Intermediate (B1)"
  },
  "Elementary / Pre-Int (A2)": {
    uz: "Boshlang'ich (A2)",
    ru: "Элементарный (A2)",
    en: "Elementary / Pre-Int (A2)"
  },

  // Interface terms
  "Tajriba": {
    uz: "yil tajriba",
    ru: "лет опыта",
    en: "years exp"
  },
  "Verified Academic Mentor": {
    uz: "Tasdiqlangan Akademik Mentor",
    ru: "Проверенный академический наставник",
    en: "Verified Academic Mentor"
  },
  "Senior Mentor": {
    uz: "Katta O'qituvchi",
    ru: "Старший ментор",
    en: "Senior Mentor"
  },
  "O'quv kursi to'lovi": {
    uz: "Kurs to'lovi",
    ru: "Стоимость курса",
    en: "Tuition fee"
  },
  "Ro'yxatdan o'tish": {
    uz: "Ro'yxatdan o'tish",
    ru: "Записаться на курс",
    en: "Enroll Now"
  },

  // Categories
  "IELTS Preparation": {
    uz: "IELTSga tayyorgarlik",
    ru: "Подготовка к IELTS",
    en: "IELTS Preparation"
  },
  "General English": {
    uz: "General English",
    ru: "Общий английский",
    en: "General English"
  },
  "Web Development": {
    uz: "Web dasturlash",
    ru: "Веб-разработка",
    en: "Web Development"
  },
  "IT & Coding": {
    uz: "IT va dasturlash",
    ru: "IT и программирование",
    en: "IT & Coding"
  },
  "Kids English": {
    uz: "Bolalar uchun ingliz tili",
    ru: "Английский для детей",
    en: "Kids English"
  },

  // Common specialties
  "IELTS Expert / Head Teacher": {
    uz: "IELTS Eksperti / Bosh O'qituvchi",
    ru: "Эксперт IELTS / Старший преподаватель",
    en: "IELTS Expert / Head Teacher"
  },
  "Senior IELTS Instructor": {
    uz: "Katta IELTS O'qituvchisi",
    ru: "Старший инструктор IELTS",
    en: "Senior IELTS Instructor"
  },
  "Fullstack Web Developer": {
    uz: "Fullstack dasturlash o'qituvchisi",
    ru: "Fullstack веб-разработчик",
    en: "Fullstack Web Developer"
  },
  "English for Kids Specialist": {
    uz: "Bolalar ingliz tili mutaxassisi",
    ru: "Специалист по детскому английскому",
    en: "English for Kids Specialist"
  }
};

export function dTrans(text: string | null | undefined, lang: Language): string {
  if (!text) return "";
  const clean = text.trim();
  if (dictionary[clean] && dictionary[clean][lang]) {
    return dictionary[clean][lang];
  }
  // Fallbacks or simple translations
  return clean;
}
