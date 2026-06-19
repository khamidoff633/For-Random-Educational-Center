import React, { useState, useEffect } from "react";
import { 
  SchoolSettings, Course, Teacher, Lead, DashboardStats, StudentResultItem 
} from "./types";
import { 
  Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube, 
  ChevronRight, Laptop, Award, Send, Sliders, GraduationCap, Users, 
  TrendingUp, BookOpen, Clock, Activity, CheckCircle, ShieldAlert, Languages, ExternalLink, RefreshCw,
  Sparkles, Star, HelpCircle, BookOpenCheck, Calculator, ArrowRight, Compass, Navigation
} from "lucide-react";
import CourseCard from "./components/CourseCard";
import TeacherCard from "./components/TeacherCard";
import AdmissionForm from "./components/AdmissionForm";
import AdminPanel from "./components/AdminPanel";
import { motion } from "motion/react";
import { dTrans } from "./lib/translate";

// Helper for parsing simple markdown for the AI Planner output nicely
function parseSimpleMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (cleanLine.startsWith("###")) {
      return <h4 key={idx} className="text-sm font-bold text-zinc-350 uppercase tracking-wider mt-4 mb-2">{cleanLine.replace("###", "")}</h4>;
    }
    if (cleanLine.startsWith("##")) {
      return <h3 key={idx} className="text-base font-extrabold text-white mt-5 mb-3 border-b border-zinc-800 pb-1">{cleanLine.replace("##", "")}</h3>;
    }
    if (cleanLine.startsWith("#")) {
      return <h2 key={idx} className="text-lg font-black text-white mt-6 mb-4">{cleanLine.replace("#", "")}</h2>;
    }
    if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
      const boldText = cleanLine.substring(1).trim();
      return (
        <li key={idx} className="text-xs sm:text-sm text-zinc-300 list-disc ml-5 my-1 font-sans">
          {parseBoldText(boldText)}
        </li>
      );
    }
    return <p key={idx} className="text-xs sm:text-sm text-zinc-400 my-1.5 leading-relaxed font-sans">{parseBoldText(cleanLine)}</p>;
  });
}

function parseBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="text-white font-extrabold">{part}</strong>;
    }
    return part;
  });
}

// Dynamic Lucide Picker Helper
const getFeatureIcon = (iconName: string) => {
  switch (iconName) {
    case "GraduationCap":
      return <GraduationCap size={28} className="text-zinc-300" />;
    case "Laptop":
      return <Laptop size={28} className="text-zinc-300" />;
    case "Users":
      return <Users size={28} className="text-zinc-300" />;
    case "TrendingUp":
      return <TrendingUp size={28} className="text-zinc-300" />;
    default:
      return <BookOpen size={28} className="text-zinc-300" />;
  }
};

const translations = {
  uz: {
    navCourses: "Kurslarimiz",
    navTeachers: "Ustozlarimiz",
    navAbout: "Biz Haqimizda",
    navContact: "Aloqa",
    freeEnroll: "Bepul darsga yoziling",
    activeAdmission: "Qabul jarayoni faol",
    directionBtn: "Yo'nalishlarni Tanlash",
    classLessonBtn: "Sinfga kirish darslari",
    whyUs: "Nega Aynan Biz?",
    advantagesTitle: "Kreativ o'quv markazimizning afzalliklari",
    advantagesDesc: "Kelayotgan yosh avlodni bilim-ko’nikmalariga moslashtirish va ularni eng so’nggi IT hamda IELTS yo’nalishlarida parvozga tayyorlaymiz.",
    coursesTitle: "Bizning o'quv kurslarimiz",
    coursesSubtitle: "Kelajak kasblari",
    coursesDesc: "O’zingiz uchun mos yo’nalishni tanlang va professional ustozlar hamrohligida amaliy darslar vositasida yuksalishni boshlang.",
    allCategories: "Barchasi",
    teachersTitle: "Tajribali Ustozlarimiz",
    teachersSubtitle: "Oliy toifali jamoa",
    teachersDesc: "Sizga yo'nalishlar bo’yicha xalqaro darajali o’qituvchi tahlili va dunyo standarti darslari beriladi.",
    resultsTitle: "Talabalarimizning Oliy Natijalari",
    resultsSubtitle: "Yulduzli bitiruvchilarimiz",
    resultsDesc: "Xalqaro imtihonlarda (IELTS, CEFR, SAT) raqobatchilardan ustun kelgan fidoiy yoshlarimizning haqiqiy muvaffaqiyat hisoboti.",
    resultsBadge: "Muvaffaqiyat tarixi",
    aboutTitle: "Bizning o'quv markazimiz haqida batafsil",
    aboutSubtitle: "Biz Haqimizda",
    certificateBtn: "Sertifikatni Ko'rish",
    closeBtn: "Yopish",
    viewAllBtn: "Barcha Natijalar",
    contactTitle: "Sizda savollar bormi? Biz bilan bog'laning!",
    contactSubtitle: "Bog'lanish",
    telegramTitle: "Telegram Sahifa",
    telegramDesc: "Kanalimizda foydali ma'lumotlar",
    instagramTitle: "Instagram Sahifa",
    instagramDesc: "Bizning hayotimiz rasmlarda",
    formTitle: "Konsultatsiya yoki Sinov darsiga Ro'yxat",
    formDesc: "Barcha savollaringizga to'g'ri maslahat olish uchun hoziroq ariza qoldiring. 10 daqiqada siz bilan bog'lanamiz.",
    formName: "To'liq ismingiz",
    formPhone: "Telefon raqamingiz",
    formSubmit: "Tezkor Ro'yxatdan o'tish",
    buildingTitle: "O'quv binosi",
    successMsg: "Arizangiz Muvaffaqiyatli Qo'shildi! Tez orada operatorlarimiz bog'lanadi."
  },
  ru: {
    navCourses: "Наши Курсы",
    navTeachers: "Наши Учителя",
    navAbout: "О Нас",
    navContact: "Контакты",
    freeEnroll: "Записаться бесплатно",
    activeAdmission: "Прием Открыт",
    directionBtn: "Выбрать направление",
    classLessonBtn: "Пробные Уроки",
    whyUs: "Почему именно мы?",
    advantagesTitle: "Преимущества нашего Учебного Центра",
    advantagesDesc: "Адаптация подрастающего поколения к практическим навыкам и подготовка к полетам в новейших направлениях IT и IELTS.",
    coursesTitle: "Наши Учебные Курсы",
    coursesSubtitle: "Профессии будущего",
    coursesDesc: "Выберите подходящее направление и начните прогрессировать под руководством профессионалов с помощью практических уроков.",
    allCategories: "Все курсы",
    teachersTitle: "Наши Опытные Преподаватели",
    teachersSubtitle: "Команда высшей категории",
    teachersDesc: "Вам будет предоставлен международный анализ преподавателей и занятия мирового уровня по различным направлениям.",
    resultsTitle: "Высокие Результаты Наших Студентов",
    resultsSubtitle: "Наши звездные выпускники",
    resultsDesc: "Реальный отчет об успехах наших преданных делу молодых людей, превзошедших конкурентов на международных экзаменах.",
    resultsBadge: "История успеха",
    aboutTitle: "Подробнее о нашем Учебном Центре",
    aboutSubtitle: "О Нас",
    certificateBtn: "Посмотреть Сертификат",
    closeBtn: "Закрыть",
    viewAllBtn: "Все результаты",
    contactTitle: "Есть вопросы? Свяжитесь с нами!",
    contactSubtitle: "Контакты",
    telegramTitle: "Telegram Канал",
    telegramDesc: "Полезная информация на канале",
    instagramTitle: "Instagram Профиль",
    instagramDesc: "Наша жизнь в фотографиях",
    formTitle: "Запись на консультацию или открытый урок",
    formDesc: "Оставьте заявку прямо сейчас, чтобы получить профессиональную поддержку по всем вопросам. Свяжемся с вами за 10 минут.",
    formName: "Ваше полное имя",
    formPhone: "Номер телефона",
    formSubmit: "Быстрая регистрация",
    buildingTitle: "Учебный корпус",
    successMsg: "Ваша заявка успешно отправлена! Скоро операторы свяжутся с вами."
  },
  en: {
    navCourses: "Our Courses",
    navTeachers: "Our Instructors",
    navAbout: "About Us",
    navContact: "Contact",
    freeEnroll: "Enroll Free",
    activeAdmission: "Admissions Open",
    directionBtn: "Choose Courses",
    classLessonBtn: "Class Sessions",
    whyUs: "Why Choose Us?",
    advantagesTitle: "Advantages of Our Academy",
    advantagesDesc: "Adapting the next generation to modern skill sets and training them for liftoff in the latest IT and IELTS tracks.",
    coursesTitle: "Our Training Courses",
    coursesSubtitle: "Careers of the Future",
    coursesDesc: "Choose the direction that fits you best and begin your ascension guided by premium mentors through practical code and speech.",
    allCategories: "All",
    teachersTitle: "Our Experienced Mentors",
    teachersSubtitle: "Top-Tier Faculty",
    teachersDesc: "You will receive world-class education and personalized mentor feedback mapped to modern global test standards.",
    resultsTitle: "Our Students' Outstanding Scorecards",
    resultsSubtitle: "Star Alumni Achievements",
    resultsDesc: "The actual score breakdown and performance metrics of our brilliant students who achieved peak scores in global exams (IELTS, SAT, CEFR).",
    resultsBadge: "Success story",
    aboutTitle: "Learn More About Our Academy",
    aboutSubtitle: "About Us",
    certificateBtn: "View Certificate",
    closeBtn: "Close",
    viewAllBtn: "All Outcomes",
    contactTitle: "Have Questions? Get in touch!",
    contactSubtitle: "Contact Us",
    telegramTitle: "Telegram Channel",
    telegramDesc: "Useful tips on our channels",
    instagramTitle: "Instagram Handle",
    instagramDesc: "Our campus life in frames",
    formTitle: "Registration for Consultation or Trial Lesson",
    formDesc: "Submit your request now to get professional academic counseling. We will reach back within 10 minutes.",
    formName: "Your Full Name",
    formPhone: "Your Phone Number",
    formSubmit: "Instant Registration",
    buildingTitle: "Learning Center Main Office",
    successMsg: "Your enrollment application was successfully submitted! Our representative will call you shortly."
  }
};

interface PlacementQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function App() {
  // Main Data States
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [studentResults, setStudentResults] = useState<StudentResultItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<StudentResultItem | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lang, setLang ] = useState<"uz" | "ru" | "en">("en");

  // Nav, Filter & UI States
  const [activeCategory, setActiveCategory] = useState<string>("Barchasi");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Contact quick form
  const [quickForm, setQuickForm] = useState({ name: "", phone: "" });
  const [quickSuccess, setQuickSuccess] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  // Hero Image State with high quality backup
  const defaultHeroBg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";
  const [heroImageSrc, setHeroImageSrc] = useState("");
  const [heroImgError, setHeroImgError] = useState(false);

  // interactive Sub-Suite states
  const [activeSuiteTab, setActiveSuiteTab] = useState<"placement" | "ielts" | "aiPlanner">("placement");
  const [activeVideoUrl, setActiveVideoUrl ] = useState("https://player.vimeo.com/video/371433846?autoplay=1");

  // 1. Placement Test States
  const [placementQuestions, setPlacementQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [placementLeadsForm, setPlacementLeadsForm] = useState({ name: "", phone: "" });
  const [placementLeadsSuccess, setPlacementLeadsSuccess] = useState(false);
  const [placementLeadsLoading, setPlacementLeadsLoading] = useState(false);

  // 2. IELTS Calculator State
  const [ieltsListening, setIeltsListening] = useState(6.5);
  const [ieltsReading, setIeltsReading] = useState(6.5);
  const [ieltsWriting, setIeltsWriting] = useState(6.0);
  const [ieltsSpeaking, setIeltsSpeaking] = useState(6.0);
  const [ieltsLeadSuccess, setIeltsLeadSuccess] = useState(false);

  // 3. AI planner states
  const [aiName, setAiName] = useState("");
  const [aiCurrentLevel, setAiCurrentLevel] = useState("Intermediate (B1)");
  const [aiTargetGoal, setAiTargetGoal] = useState("IELTS 7.5 Band");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [aiPlannerLoading, setAiPlannerLoading] = useState(false);
  const [aiPlannerError, setAiPlannerError] = useState("");

  // Fetch all API data
  const loadAllData = async () => {
    try {
      const [settingsRes, coursesRes, teachersRes, leadsRes, statsRes, resultsRes, questionsRes] = await Promise.all([
        fetch("/api/settings").then(r => r.json()),
        fetch("/api/courses").then(r => r.json()),
        fetch("/api/teachers").then(r => r.json()),
        fetch("/api/leads").then(r => r.json()),
        fetch("/api/stats").then(r => r.json()),
        fetch("/api/results").then(r => r.json()).catch(() => []),
        fetch("/api/placement-questions").then(r => r.json()).catch(() => [])
      ]);

      setSettings(settingsRes);
      setCourses(coursesRes);
      setTeachers(teachersRes);
      setLeads(leadsRes);
      setStats(statsRes);
      setStudentResults(resultsRes || []);
      setPlacementQuestions(questionsRes || []);
      setHeroImageSrc(settingsRes.heroBgImage || defaultHeroBg);
      setHeroImgError(false);
    } catch (error) {
      console.error("Xonadosh/API ulanish xatoligi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (settings) {
      setHeroImageSrc(settings.heroBgImage || defaultHeroBg);
      setHeroImgError(false);
    }
  }, [settings]);

  // Filter Categories
  const categories = ["Barchasi", ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = activeCategory === "Barchasi" 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  const handleEnrollClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowEnrollModal(true);
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = quickForm.phone?.trim() || "";
    const digitCount = rawPhone.replace(/\D/g, "").length;

    if (!quickForm.name?.trim()) {
      alert("Ismingizni kiritish majburiy!");
      return;
    }

    if (!rawPhone || digitCount < 9) {
      alert("Telefon raqamingizni to'liq kiritish majburiy! (Kamida 9 ta raqam bo'lishi kerak)");
      return;
    }

    setQuickLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: quickForm.name,
          phone: quickForm.phone,
          courseId: "boshqa",
          notes: "Tezkor aloqa sahifasidan qoldirilgan raqam."
        })
      });
      if (response.ok) {
        setQuickSuccess(true);
        setQuickForm({ name: "", phone: "" });
        loadAllData();
        setTimeout(() => setQuickSuccess(false), 4000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Ariza qoldirishda xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      alert("Server ulanishda xatolik yuz berdi");
    } finally {
      setQuickLoading(false);
    }
  };

  // 1. Placement Test Logic handles
  const handlePlacementAnswer = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswerIdx(idx);
  };

  const handlePlacementSubmitQuestion = () => {
    if (selectedAnswerIdx === null) return;
    const currentQ = placementQuestions[currentQuizIndex];
    if (selectedAnswerIdx === currentQ.correct) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const handlePlacementNext = () => {
    setSelectedAnswerIdx(null);
    setQuizSubmitted(false);
    if (currentQuizIndex < placementQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswerIdx(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setQuizFinished(false);
    setPlacementLeadsSuccess(false);
  };

  const getDiagnosticsLevel = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 85) {
      return { 
        grade: dTrans("Advanced (C1)", lang), 
        desc: lang === "en" 
          ? "Excellent! You command English fluidly and process complex syntax easily. In our academy, your IELTS 8.0+ is guaranteed!"
          : lang === "ru"
          ? "Превосходно! Вы свободно владеете английским языком. С нашей академией ваши IELTS 8.0+ гарантированы!"
          : "Ajoyib! Siz ingliz tilida juda mukammal muloqot qila olasiz. Bizning akademiyada IELTS 8.0+ kafolatlanadi!"
      };
    }
    if (pct >= 60) {
      return { 
        grade: dTrans("Upper-Intermediate (B2)", lang), 
        desc: lang === "en"
          ? "Great job! You articulate ideas clearly, but need refinements on high-level idioms and mixed conditionals. Ideal start for IELTS 6.5-7.5."
          : lang === "ru"
          ? "Отличная работа! Вы можете свободно выражаться, но нужна практика со сложной грамматикой. Идеальный старт для IELTS 6.5-7.5."
          : "Yaxshi! Siz erkin fikrlay olasiz, ammo murakkab grammatika va idiomalar ustida ishlash zarur. IELTS 6.5-7.5 uchun ideal tayyorgarlik."
      };
    }
    if (pct >= 40) {
      return { 
        grade: dTrans("Intermediate (B1)", lang), 
        desc: lang === "en"
          ? "In the intermediate lane. Daily conversations are simple, but academic lexical range and styling require boost. Intensive classes suit you best."
          : lang === "ru"
          ? "Средний уровень. Повседневное общение дается легко, но академический вокабуляр требует внимания. Рекомендуем интенсивные группы."
          : "Siz o'rta darajadasiz. Kundalik muloqot muammo emas, lekin akademik so'zlar ustida ishlash lozim. Sizga intensiv guruhlarimiz mos."
      };
    }
    return { 
      grade: dTrans("Elementary / Pre-Int (A2)", lang), 
      desc: lang === "en"
        ? "Foundational grasp. Strengthening core grammar and vocabulary loops will quickly launch your score to higher bands."
        : lang === "ru"
        ? "Базовый уровень. Укрепление грамматической базы и расширение словаря быстро поднимет вас к заветным баллам."
        : "Siz tilda boshlang'ich tushunchalarga egasiz. Grammatika poydevorini mustahkamlash orqali tezda yuqori natijalarga erishasiz."
    };
  };

  const handlePlacementLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementLeadsForm.name || !placementLeadsForm.phone) {
      alert(lang === "en" ? "Please fill in your name and phone number." : lang === "ru" ? "Пожалуйста, введите ваше имя и телефон." : "Iltimos, ismingiz va telefoningizni kiriting.");
      return;
    }
    setPlacementLeadsLoading(true);
    const diag = getDiagnosticsLevel(quizScore, placementQuestions.length);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: placementLeadsForm.name,
          phone: placementLeadsForm.phone,
          courseId: "boshqa",
          notes: `Placement Diagnostic Test topshirdi: Score ${quizScore}/${placementQuestions.length}. Taxminiy darajasi: ${diag.grade}.`
        })
      });
      if (res.ok) {
        setPlacementLeadsSuccess(true);
        loadAllData();
      } else {
        alert(lang === "en" ? "Error submitting." : "Arizani saqlashda muammo yuz berdi.");
      }
    } catch {
      alert(lang === "en" ? "Error submitting." : "Arizani yuborishda xatolik.");
    } finally {
      setPlacementLeadsLoading(false);
    }
  };

  // 2. IELTS Calculator Logic
  const calcIeltsOverall = () => {
    const rawAvg = (ieltsListening + ieltsReading + ieltsWriting + ieltsSpeaking) / 4;
    const decimal = rawAvg - Math.floor(rawAvg);
    if (decimal < 0.25) return Math.floor(rawAvg);
    if (decimal < 0.75) return Math.floor(rawAvg) + 0.5;
    return Math.ceil(rawAvg);
  };

  const getIELTSAdvice = (score: number) => {
    if (score >= 8.0) {
      return lang === "en"
        ? "Astonishing world-class band! APEX Academy suggests premium Oxford debating clubs to maintain fluency metrics."
        : lang === "ru"
        ? "Потрясающий результат мирового уровня! APEX Academy предлагает премиум-дебаты для поддержания беглости речи."
        : "Aqlbovar qilmas natija! APEX Academy sizga nutqingizni saqlab qolish uchun maxsus debat klublarini tavsiya etadi.";
    }
    if (score >= 7.0) {
      return lang === "en"
        ? "Respected IELTS score! Mapped to highest academic standings. To edge into 8.0+, focus on Task 2 writing and speaking fluency."
        : lang === "ru"
        ? "Отличный балл IELTS! Чтобы достичь 8.0+, уделите внимание академическому письму и беглости устной речи."
        : "Ajoyib IELTS natijasi! IELTS 7.5 yoki 8.0 ballga ko'tarilish uchun Task 2 yozma darslariga e'tibor qarating.";
    }
    if (score >= 6.0) {
      return lang === "en"
        ? "Solid performance. Safe for top global universities. Join our intensive weekly mock evaluations to secure 7.0+ bands."
        : lang === "ru"
        ? "Хороший показатель. Безопасно для поступления за рубеж. Проходите еженедельные пробные тесты, чтобы закрепить 7.0+."
        : "Yaxshi ko'rsatkich. Ballingizni 7.0 yoki undan yuqoriga chiqarish uchun haftalik intensiv maket testlarda qatnashing.";
    }
    return lang === "en"
      ? "Don't fret! Join our expert-led classes to boost your score by 1.5 - 2.0 bands in 3 months with total comfort."
      : lang === "ru"
      ? "Не переживайте! Присоединяйтесь к нашим группам, чтобы поднять ваш результат на 1.5-2.0 балла всего за 3 месяца."
      : "Xavotirlanmang! Bizning malakali IELTS guruhlarimizda 3 oylik amaliy darslar orqali ko'rsatkichni 1.5-2 ballga ko'tarasiz.";
  };

  const handleIeltsLeadSubmit = async () => {
    const score = calcIeltsOverall();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: "IELTS Calculator Foydalanuvchisi",
          phone: settings?.phone || "+998",
          courseId: "boshqa",
          notes: `IELTS Calculator hisobladi: OverAll ${score} (L:${ieltsListening}, R:${ieltsReading}, W:${ieltsWriting}, S:${ieltsSpeaking}). Konsultatsiya kutmoqda.`
        })
      });
      setIeltsLeadSuccess(true);
      setTimeout(() => setIeltsLeadSuccess(false), 4500);
      loadAllData();
    } catch {
      alert("Arizani bog'lashda xatolik.");
    }
  };

  // 3. AI Planner Generator Logic
  const generateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiName.trim()) {
      alert(lang === "en" ? "Please enter your name." : lang === "ru" ? "Пожалуйста, введите ваше имя." : "Iltimos, ismingizni yozing.");
      return;
    }
    setAiPlannerLoading(true);
    setAiPlannerError("");
    setGeneratedPlan("");

    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: aiName,
          currentLevel: aiCurrentLevel,
          targetGoal: aiTargetGoal
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "AI dars rejasi generatsiya qilishda xatolik yuz berdi");
      }

      const data = await res.json();
      setGeneratedPlan(data.text);
      
      // Also register this student as a high-intent Lead in database!
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: aiName + " (AI Planner)",
          phone: settings?.phone || "+998 (90) 000-0000",
          courseId: "boshqa",
          notes: `AI 30 kunlik reja so'radi. Joriy Level: ${aiCurrentLevel}, Target: ${aiTargetGoal}.`
        })
      }).then(() => loadAllData()).catch(() => {});

    } catch (err: any) {
      setAiPlannerError(err.message || "Tizim ulanishida vaqtinchalik muammo");
    } finally {
      setAiPlannerLoading(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans">
        <div className="h-10 w-10 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Loading Academy Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-105 antialiased font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* 🏛️ DEMO ALERT BAR FOR SAAS CLIENTS */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-white text-center py-3 px-6 text-xs font-semibold flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-xl relative z-40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>
          <span className="bg-zinc-800 text-white border border-zinc-750 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">Apex Workspace</span>
          <span className="text-zinc-300 text-left">
            {lang === "en" ? "Academy Hub is active. Manage registration from Admin Panel & AI Copilot." : lang === "ru" ? "Панель активна. Управляйте курсами из панели администратора & AI Copilot." : "Interaktiv sayt faol. Boshqaruv paneli orqali ma'lumotlarni tahrirlang!"}
          </span>
        </div>
        <button
          onClick={() => setShowAdminPanel(true)}
          className="rounded-full bg-white hover:bg-zinc-200 px-5 py-2 font-bold text-xs text-zinc-950 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sliders size={13} />
          <span>Admin Panel & AI Copilot</span>
        </button>
      </div>

      {/* 🏛️ FLOATING GLASS TRANSPARENT CAPSULE NAVBAR */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl transition-all duration-500 ${
          scrolled 
            ? "top-3 scale-[0.99] drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]" 
            : "top-18 scale-100"
        }`}
      >
        <header 
          className={`relative rounded-2xl border transition-all duration-500 w-full flex items-center justify-between px-6 ${
            scrolled
              ? "bg-zinc-950/45 backdrop-blur-2xl h-18 border-amber-500/25 shadow-[0_0_25px_rgba(245,158,11,0.18)]"
              : "bg-zinc-900/55 backdrop-blur-xl h-22 border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.35)]"
          }`}
        >
          
          {/* Brand Logo name in modern style */}
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-amber-500/20 text-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
              <GraduationCap size={16} strokeWidth={2.5} />
            </span>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
                Academy
              </span>
              <span className="text-[7px] text-amber-400/80 font-mono tracking-widest uppercase font-bold leading-none pt-0.5">
                BRITISH COUNCIL
              </span>
              <span className="text-[7px] text-zinc-400 font-mono tracking-widest uppercase font-bold leading-none">
                PARTNER
              </span>
            </div>
          </a>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6.5 text-[11px] font-black uppercase tracking-wider text-zinc-300">
            <a href="#kurslar" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "KURSLARIMIZ" : lang === "ru" ? "НАШИ КУРСЫ" : "OUR COURSES"}</span>
            </a>
            <a href="#ustozlar" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "USTOZLAR" : lang === "ru" ? "ПРЕПОДАВАТЕЛИ" : "INSTRUCTORS"}</span>
            </a>
            <a href="#filiallar" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "FILIALLAR" : lang === "ru" ? "ФИЛИАЛЫ" : "BRANCHES"}</span>
            </a>
            <a href="#interactive-suite" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group flex items-center gap-1.5">
              <span>{lang === "uz" ? "AI REJA & TEST" : lang === "ru" ? "ИИ-ПЛАН И ТЕСТ" : "AI PLAN & TEST"}</span>
              <Sparkles size={11} className="text-amber-400 animate-pulse" />
            </a>
            <a href="#natijalar" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "NATIJALARI" : lang === "ru" ? "РЕЗУЛЬТАТЫ" : "RESULTS"}</span>
            </a>
            <a href="#biz-haqimizda" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "BIZ HAQIMIZDA" : lang === "ru" ? "О НАС" : "ABOUT US"}</span>
            </a>
            <a href="#kontakt" className="nav-gold-link hover:text-amber-200 transition-colors py-2 relative group">
              <span>{lang === "uz" ? "KONTAKT" : lang === "ru" ? "КОНТАКТЫ" : "CONTACT"}</span>
            </a>
          </nav>

          {/* Language Selector */}
          <div className="flex items-center">
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 gap-1">
              {(["uz", "en", "ru"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    lang === l 
                      ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-amber-200/25" 
                      : "text-zinc-400 hover:text-amber-200 hover:bg-zinc-900/40"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>
      </div>

      {/* MASTER CONTENT AREA */}
      <main className="flex-1">

        {/* HERO SECTION - REBUILT TO WORLD-CLASS CENTERED PREMIUM STANDARDS */}
        <section className="relative overflow-hidden bg-zinc-950 text-zinc-100 py-28 lg:py-44 flex items-center justify-center min-h-[95vh] border-b border-zinc-900">
          {/* Subtle Tech Grid & Media Backdrop */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {settings?.heroMediaType === "video" && settings?.heroVideoUrl ? (
              <>
                <video
                  src={settings.heroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-65 contrast-[1.10] saturate-[1.12] brightness-[1.04] scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/75 to-zinc-950 z-5" />
              </>
            ) : (
              <>
                <img
                  src={heroImageSrc}
                  alt="App backdrop"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-[0.8] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/75 to-zinc-950 z-5" />
              </>
            )}

            {/* Subtle light grid */}
            <div 
              className="absolute inset-0 opacity-20 z-10" 
              style={{
                backgroundImage: `
                  linear-gradient(rgba(245, 158, 11, 0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245, 158, 11, 0.04) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px'
              }}
            />

            {/* Elegant glowing yellow/gold light blobs floating behind */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[130px] animate-slow-blob pointer-events-none z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-yellow-500/10 blur-[150px] animate-slow-blob [animation-delay:4s] pointer-events-none z-10" />
            
            {/* Elegant gold glowing blob centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-amber-500/5 via-yellow-500/5 to-transparent blur-3xl opacity-80 z-20" />
          </div>

          <div className="mx-auto max-w-5xl px-6 flex flex-col items-center text-center relative z-20 w-full space-y-10">
            {/* ADMISSIONS OPEN PILL */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-zinc-900/95 px-4.5 py-2.5 text-xs font-black uppercase tracking-widest text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="h-2 w-2 rounded-full bg-amber-400 scale-110 animate-pulse-ring" />
              <span>{lang === "uz" ? "QABUL OCHIQ" : lang === "ru" ? "ПРИЕМ ОТКРЫТ" : "ADMISSIONS OPEN"}</span>
            </div>
            
            {/* LARGE HERO TITLE - High contrast drop shadow & gold gradient */}
            <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6.5xl tracking-tight leading-[1.05] max-w-4xl selection:bg-amber-500/20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <span className="text-white">
                {lang === "uz" ? "Kelajagingizni " : lang === "ru" ? "Стройте Свое " : "Build Your "}
              </span>
              <span className="gold-glow-text">
                {lang === "uz" ? "Biz Bilan Birga " : lang === "ru" ? "Будущее Вместе " : "Future Together "}
              </span>
              <span className="text-white">
                {lang === "uz" ? "Quring" : lang === "ru" ? "с Нами" : "With Us"}
              </span>
            </h1>
            
            {/* HERO SUBTITLE */}
            <p className="text-sm sm:text-[17px] text-zinc-350 max-w-2xl mx-auto leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              {lang === "uz" 
                ? "Eng yuqori natijali Ingliz tili va axborot texnologiyalari kurslari. Malakali ustozlar va zamonaviy o'quv muhiti."
                : lang === "ru"
                  ? "Курсы английского языка и информационных технологий с самыми высокими результатами. Квалифицированные преподаватели и современная среда обучения."
                  : "Highest-scoring English and information technology courses. Qualified mentors and modern learning atmosphere."
              }
            </p>

            {/* HERO BUTTONS AREA - Luxurious gold interactive buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4 w-full sm:w-auto z-10 font-sans">
              <a
                href="#kurslar"
                className="w-full sm:w-auto btn-classic-green text-zinc-950 px-10 py-4.5 text-xs tracking-widest uppercase transition-all inline-flex items-center justify-center gap-2 cursor-pointer duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)]"
              >
                <span>{lang === "uz" ? "Kurslarni Tanlang" : lang === "ru" ? "Выбрать Направление" : "Choose Courses"}</span>
                <span className="text-lg leading-none font-black">&rarr;</span>
              </a>
              <button
                onClick={() => handleEnrollClick("")}
                className="w-full sm:w-auto btn-classic-green-outline px-10 py-5 text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2.5 duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
              >
                <BookOpen size={16} className="text-amber-400" />
                <span>{lang === "uz" ? "Sinf Darslari" : lang === "ru" ? "Пробные Уроки" : "Class Sessions"}</span>
              </button>
            </div>
            
            {/* PEAKING BOTTOM CONTAINER BOUNDARY */}
            <div className="w-full h-4 mt-8 pointer-events-none" />
          </div>
        </section>

        {/* TRUST BANNER STATISTICS */}
        <section className="bg-zinc-950 border-t border-b border-zinc-900 py-12 relative z-20">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white font-sans">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm shadow-xl">
              <strong className="text-3xl sm:text-4.5xl font-black text-white block tracking-tight">5000+</strong>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block font-mono">
                {lang === "uz" ? "Bitiruvchi o'quvchilar" : lang === "ru" ? "Выпускников" : "Graduated Students"}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-805 backdrop-blur-sm shadow-xl">
              <strong className="text-3xl sm:text-4.5xl font-black text-white block tracking-tight">15+</strong>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block font-mono">
                {lang === "uz" ? "Xalqaro Mentorlar" : lang === "ru" ? "Международных Наставников" : "International Mentors"}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm shadow-xl">
              <strong className="text-3xl sm:text-4.5xl font-black text-white block tracking-tight">95% +</strong>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block font-mono">
                {lang === "uz" ? "Imtihondan o'tganlar" : lang === "ru" ? "Успешных Экзаменов" : "Exam Pass Rate"}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm shadow-xl">
              <strong className="text-3xl sm:text-4.5xl font-black text-white block tracking-tight">1-chi</strong>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block font-mono">
                {lang === "uz" ? "Dars Bepul" : lang === "ru" ? "Урок Бесплатно" : "First Lesson Free"}
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES ADVANTAGES SECTION */}
        <section className="py-24 lg:py-32 relative bg-zinc-950 text-white border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-350 bg-zinc-900 border border-zinc-800 px-4.5 py-2 rounded-full inline-block">
                {translations[lang].whyUs}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                {translations[lang].advantagesTitle}
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {translations[lang].advantagesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {settings.features && settings.features.map((feat) => (
                <div 
                  key={feat.id} 
                  className="group bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 mb-6 border border-zinc-800 transition-all duration-300">
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <h3 className="font-sans font-bold text-lg text-white transition-colors mb-2.5">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DYNAMIC VIDEO SHOWCASE SECTION */}
        <section className="py-24 bg-zinc-950 text-white relative border-b border-zinc-900 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-12 text-center space-y-4 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-350 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
                <Sparkles size={11} className="text-zinc-405" />
                {lang === "en" ? "Interactive Masterclass" : lang === "ru" ? "Интерактивный мастер-класс" : "Amaliy video darslar"}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                {lang === "en" ? "Explore Our Virtual Academy" : lang === "ru" ? "Исследуйте наши виртуальные классы" : "Virtual darslarimiz va dars zallari"}
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {lang === "en" ? "Tune in to our actual classroom video sessions, campus virtual tours, and student speaking evaluations to experience our premium teaching design." : lang === "ru" ? "Смотрите живые видеозаписи уроков, виртуальные экскурсии и устные экзамены наших студентов, чтобы оценить качество образования." : "Sinfxonamizdagi real darslar, o'quv binolarimiz bo'ylab virtual tur va talabalarimizning speaking sinovlaridan namunalarni tomosha qiling."}
              </p>
            </div>

            {/* Elegant Player Box with rounded margins (no hard boxes) */}
            <div className="lg:col-span-8 relative">
              <div className="aspect-video w-full rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden relative group">
                <iframe
                  src={activeVideoUrl}
                  className="w-full h-full border-0 select-none"
                  title="Apex Academy Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video Playlist selector styled professionally */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2 font-mono">
                {lang === "en" ? "Academy Channels" : lang === "ru" ? "Каналы академии" : "Kanal pleylisti"}
              </h3>
              
              <div className="space-y-3">
                {[
                  {
                    title: lang === "en" ? "Apex Academy Virtual Tour" : lang === "ru" ? "Виртуальный тур по академии" : "Apex akademiyasi bo'ylab tur",
                    desc: lang === "en" ? "Walk through our high-tech class infrastructure" : lang === "ru" ? "Экскурсия по современным учебным залам" : "Bizning zamonaviy guruh jihozlarimiz bilan tanishing",
                    url: "https://player.vimeo.com/video/371433846?autoplay=1"
                  },
                  {
                    title: lang === "en" ? "IELTS Speaking 8.5 Mock Exam" : lang === "ru" ? "Пробный устный экзамен IELTS 8.5" : "IELTS Speaking Mock-test (8.5 Ball)",
                    desc: lang === "en" ? "Actual student evaluation and feedback sessions" : lang === "ru" ? "Оценка реального выступления студента и разбор" : "Haqiqiy o'quvchi speaking imtihoni tahlili",
                    url: "https://www.youtube.com/embed/5m09B_y_0Qc?autoplay=1"
                  },
                  {
                    title: lang === "en" ? "Interactive Grammar Session" : lang === "ru" ? "Занятие по интерактивной грамматике" : "Ingliz tili intensiv grammatika darsi",
                    desc: lang === "en" ? "Learn mixed conditionals in 5 minutes" : lang === "ru" ? "Изучите mixed conditionals за 5 минут" : "Murakkab grammatik mavzularni o'rgatish darsi",
                    url: "https://www.youtube.com/embed/S_O_LpCclgY?autoplay=1"
                  }
                ].map((video, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideoUrl(video.url)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      activeVideoUrl === video.url
                        ? "bg-zinc-900 border-zinc-750 text-white shadow-md"
                        : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80 text-zinc-400"
                    }`}
                  >
                    <strong className="text-xs font-bold line-clamp-1">{video.title}</strong>
                    <span className="text-[10px] text-zinc-500 line-clamp-1 leading-snug">{video.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* NEW INTERACTIVE DYNAMIC SUITE: TEST, CALCULATOR & AI GENERATOR */}
        <section id="interactive-suite" className="py-24 bg-zinc-950 text-zinc-100 relative overflow-hidden border-b border-zinc-900">
          
          <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-16">
            <div className="text-center space-y-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
                <Sparkles size={11} className="text-zinc-405" />
                {lang === "en" ? "Diagnostic Learning" : lang === "ru" ? "Интерактивная диагностика" : "Interaktiv amaliy o'quv bo'limi"}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                {lang === "en" ? "Interactive Learning & Diagnosis Suite" : lang === "ru" ? "Интерактивная диагностика и планирование" : "Interaktiv bilim sinov va dars reja tizimi"}
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {lang === "en" ? "Assess your exact current English levels, calculate your IELTS target band scores, and instantly spin up a personalized 30-day lesson blueprint using server-side Gemini AI!" : lang === "ru" ? "Определите свой точный уровень английского, рассчитайте балл IELTS и мгновенно сгенерируйте индивидуальный 30-дневный план с помощью ИИ Gemini!" : "Ingliz tili bilim darajangizni aniqlang, IELTS ballingizni salkam aniqlikda hisoblang va Gemini sun'iy intellekti yordamida shaxsiy 30 kunlik reja oling!"}
              </p>
            </div>

            {/* TAB SELECTORS */}
            <div className="flex flex-wrap items-center justify-center gap-4 border-b border-zinc-900 pb-4 max-w-3xl mx-auto">
              <button
                onClick={() => setActiveSuiteTab("placement")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeSuiteTab === "placement"
                    ? "bg-white text-zinc-950 border-white shadow-md font-bold"
                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <BookOpenCheck size={14} />
                <span>{lang === "en" ? "Level Placement Test" : lang === "ru" ? "Тест на уровень" : "Darajani aniqlash testi"}</span>
              </button>
              <button
                onClick={() => setActiveSuiteTab("ielts")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeSuiteTab === "ielts"
                    ? "bg-white text-zinc-950 border-white shadow-md font-bold"
                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Calculator size={14} />
                <span>{lang === "en" ? "IELTS Band Score Calculator" : lang === "ru" ? "Калькулятор IELTS" : "IELTS ball hisoblagichi"}</span>
              </button>
              <button
                onClick={() => setActiveSuiteTab("aiPlanner")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeSuiteTab === "aiPlanner"
                    ? "bg-white text-zinc-950 border-white shadow-md font-bold"
                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles size={14} />
                <span>{lang === "en" ? "AI STUDY PLANNER (Gemini)" : lang === "ru" ? "Учебный план AI" : "AI orqali dars rejasi"}</span>
              </button>
            </div>

            {/* ACTIVE CONTENT SHEET - BEAUTIFUL TRANSPARENT GLASS FLUID CONTAINER */}
            <div className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl relative font-sans">
              
              {/* TAB 1: PLACEMENT TEST VIEW */}
              {activeSuiteTab === "placement" && (
                <div className="space-y-8">
                  {placementQuestions.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <RefreshCw size={36} className="mx-auto text-zinc-400 animate-spin" />
                      <p className="text-zinc-500 text-xs">{lang === "en" ? "Loading questions..." : lang === "ru" ? "Загрузка вопросов..." : "Savollar yuklanmoqda..."}</p>
                    </div>
                  ) : !quizFinished ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          {lang === "en" ? "Question" : lang === "ru" ? "Вопрос" : "Savol"}: {currentQuizIndex + 1} / {placementQuestions.length}
                        </span>
                        <div className="w-32 bg-zinc-850 h-2 rounded-full overflow-hidden border border-zinc-805">
                          <div 
                            className="bg-white h-full transition-all duration-300 shadow-md" 
                            style={{ width: `${((currentQuizIndex + 1) / placementQuestions.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-bold font-sans text-white leading-snug">
                          {placementQuestions[currentQuizIndex].question}
                        </h4>

                        <div className="grid grid-cols-1 gap-3.5 pt-2">
                          {placementQuestions[currentQuizIndex].options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePlacementAnswer(idx)}
                              className={`text-left px-5 py-4 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-between ${
                                selectedAnswerIdx === idx 
                                  ? "bg-white/5 border-white text-white font-bold"
                                  : "bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/60 text-zinc-300"
                              }`}
                            >
                              <span>{opt}</span>
                              <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                                selectedAnswerIdx === idx ? "border-white bg-white text-zinc-950 text-[10px] font-bold" : "border-zinc-650"
                              }`}>
                                {selectedAnswerIdx === idx && "✓"}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic Explaining Output */}
                      {quizSubmitted && (
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 text-xs sm:text-sm text-zinc-300 space-y-1.5 animate-fade-in">
                          <p className="font-bold text-white">
                            {selectedAnswerIdx === placementQuestions[currentQuizIndex].correct ? "✓ To'g'ri javob!" : "✗ Noto'g'ri javob!"}
                          </p>
                          <p className="text-zinc-450">{placementQuestions[currentQuizIndex].explanation}</p>
                        </div>
                      )}

                      {/* Bottom action controls */}
                      <div className="flex items-center justify-end pt-4 border-t border-zinc-800 gap-3">
                        {!quizSubmitted ? (
                          <button
                            onClick={handlePlacementSubmitQuestion}
                            disabled={selectedAnswerIdx === null}
                            className="bg-white text-zinc-950 font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer hover:bg-zinc-200"
                          >
                            Tasdiqlash
                          </button>
                        ) : (
                          <button
                            onClick={handlePlacementNext}
                            className="bg-white text-zinc-950 font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer hover:bg-zinc-200"
                          >
                            <span>{currentQuizIndex === placementQuestions.length - 1 ? "Natijani Ko'rish" : "Keyingisi"}</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* QUIZ FINISHED RESULTS SCREEN */
                    <div className="text-center space-y-8 py-4">
                      <div className="space-y-3">
                        <strong className="text-4xl sm:text-5xl font-black text-white block">
                          {quizScore} / {placementQuestions.length}
                        </strong>
                        <h4 className="text-xl font-bold text-white">
                          Sizning ingliz tili darajangiz: {getDiagnosticsLevel(quizScore, placementQuestions.length).grade}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                          {getDiagnosticsLevel(quizScore, placementQuestions.length).desc}
                        </p>
                      </div>

                      {/* Lead Intake Form for diagnostics saving */}
                      <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto text-left space-y-4">
                        <h5 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                          <GraduationCap size={15} />
                          Darajani tasdiqlab, guruh band qilish
                        </h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Bizda haftalik sinov darslariga guruh ochilgan. Telefoningizni qoldiring, metodistlarimiz qisqa tahlil asosida darsga taklif etishadi.
                        </p>

                        {placementLeadsSuccess ? (
                          <div className="p-4 rounded-xl bg-white/5 text-white text-center font-bold text-xs border border-zinc-800">
                            ✓ Arizangiz ro'yxatga olindi. Operator yaqin daqiqalarda muloqot qiladi!
                          </div>
                        ) : (
                          <form onSubmit={handlePlacementLeadSubmit} className="space-y-4">
                            <div>
                              <input
                                type="text"
                                required
                                placeholder="To'liq ismingiz"
                                value={placementLeadsForm.name}
                                onChange={(e) => setPlacementLeadsForm({ ...placementLeadsForm, name: e.target.value })}
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs outline-none text-white focus:border-white transition-all font-medium"
                              />
                            </div>
                            <div>
                              <input
                                type="tel"
                                required
                                placeholder="Telefon raqamingiz"
                                value={placementLeadsForm.phone}
                                onChange={(e) => setPlacementLeadsForm({ ...placementLeadsForm, phone: e.target.value })}
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs outline-none text-white focus:border-white transition-all font-medium"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={restartQuiz}
                                className="w-1/3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold py-3 text-xs rounded-full transition-all cursor-pointer uppercase tracking-wider text-center border border-zinc-800"
                              >
                                Orqaga
                              </button>
                              <button
                                type="submit"
                                disabled={placementLeadsLoading}
                                className="w-2/3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 text-xs rounded-full cursor-pointer text-center"
                              >
                                {placementLeadsLoading ? "Tekshirilmoqda..." : "Metodistga o'tkazish"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: IELTS BAND CALCULATOR */}
              {activeSuiteTab === "ielts" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Dial sliders */}
                    <div className="space-y-5 font-sans">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                        IELTS Qismlari Ballari (0 - 9.0)
                      </h4>

                      {/* Listening */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                          <span>Listening</span>
                          <span className="text-white">{ieltsListening.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="9"
                          step="0.5"
                          value={ieltsListening}
                          onChange={(e) => setIeltsListening(parseFloat(e.target.value))}
                          className="w-full accent-white cursor-pointer h-1 bg-zinc-800 rounded-lg outline-none"
                        />
                      </div>

                      {/* Reading */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                          <span>Reading</span>
                          <span className="text-white">{ieltsReading.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="9"
                          step="0.5"
                          value={ieltsReading}
                          onChange={(e) => setIeltsReading(parseFloat(e.target.value))}
                          className="w-full accent-white cursor-pointer h-1 bg-zinc-800 rounded-lg outline-none"
                        />
                      </div>

                      {/* Writing */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                          <span>Writing</span>
                          <span className="text-white">{ieltsWriting.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="9"
                          step="0.5"
                          value={ieltsWriting}
                          onChange={(e) => setIeltsWriting(parseFloat(e.target.value))}
                          className="w-full accent-white cursor-pointer h-1 bg-zinc-800 rounded-lg outline-none"
                        />
                      </div>

                      {/* Speaking */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                          <span>Speaking</span>
                          <span className="text-white">{ieltsSpeaking.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="9"
                          step="0.5"
                          value={ieltsSpeaking}
                          onChange={(e) => setIeltsSpeaking(parseFloat(e.target.value))}
                          className="w-full accent-white cursor-pointer h-1 bg-zinc-800 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    {/* Result Output Display card */}
                    <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6.5 text-[#E6F3EE] text-center space-y-4">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#E6F3EE]/55 uppercase font-bold">Calculated Overall Band</span>
                        <strong className="text-5xl sm:text-6.5xl font-black text-white block tracking-tight mt-1">
                          {calcIeltsOverall().toFixed(1)}
                        </strong>
                      </div>

                      <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-xs text-zinc-350 leading-relaxed font-sans text-left">
                        {getIELTSAdvice(calcIeltsOverall())}
                      </div>

                      <button
                        onClick={handleIeltsLeadSubmit}
                        type="button"
                        className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 text-xs rounded-full cursor-pointer transition-all uppercase tracking-wider"
                      >
                        {ieltsLeadSuccess ? "✓ Arizona Qabul maydoniga saqlandi" : "Shu ballni ko'tarib konsultatsiya so'rash"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SMART AI STUDY PLANNER (GEMINI POWERED) */}
              {activeSuiteTab === "aiPlanner" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                      Smart AI Study Plan generator (Gemini API Server-Side)
                    </h4>
                    <p className="text-xs text-zinc-405 leading-relaxed">
                      Litsenziyalangan metod darsliklarimiz hamda Gemini sun'iy intellekti integratsiyasi yordamida, joriy tilingiz va hohlagan maqsadi bo'yicha 30 darslik professional intensiv grafik tuzing!
                    </p>
                  </div>

                  {!generatedPlan ? (
                    <form onSubmit={generateStudyPlan} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end font-sans">
                      <div>
                        <label className="block text-[10px] tracking-wider font-bold mb-1.5 uppercase font-[#E6F3EE]/55">Ismingiz</label>
                        <input
                          type="text"
                          required
                          placeholder="Ismingizni kiriting"
                          value={aiName}
                          onChange={(e) => setAiName(e.target.value)}
                          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none text-white focus:border-white transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider font-bold mb-1.5 uppercase font-[#E6F3EE]/55">Joriy Ingliz tili Levelingiz</label>
                        <select
                          value={aiCurrentLevel}
                          onChange={(e) => setAiCurrentLevel(e.target.value)}
                          className="w-full rounded-xl bg-zinc-900 border border-zinc-805 p-3 text-xs outline-none text-white focus:border-white transition-all font-semibold"
                        >
                          <option value="Beginner (A1)">Beginner / Boshlang'ich (A1)</option>
                          <option value="Elementary (A2)">Elementary / Boshlang'ich (A2)</option>
                          <option value="Intermediate (B1)">Intermediate / O'rta (B1)</option>
                          <option value="Upper-Intermediate (B2)">Upper-Intermediate (B2)</option>
                          <option value="Advanced / IELTS (C1)">Advanced / IELTS tayyorgarligi (C1)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider font-bold mb-1.5 uppercase font-[#E6F3EE]/55">Maqsadingiz / Target Band</label>
                        <select
                          value={aiTargetGoal}
                          onChange={(e) => setAiTargetGoal(e.target.value)}
                          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none text-white focus:border-white transition-all font-semibold"
                        >
                          <option value="IELTS 6.0 Band guruh">IELTS 6.0 Band guruhi</option>
                          <option value="IELTS 7.0 Band guruh">IELTS 7.0 Band guruhi</option>
                          <option value="IELTS 7.5+ High Score">IELTS 7.5+ High Score</option>
                          <option value="CEFR B2 / C1 sertifkat">CEFR B1 / B2 / C1 imtihoni</option>
                          <option value="Fluent English Conversation">Fluent Speaking (Gapirish nutqi)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 pt-3">
                        <button
                          type="submit"
                          disabled={aiPlannerLoading}
                          className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-4 rounded-full text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {aiPlannerLoading ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Gemini dars tahlili qilmoqda... (10 soniya kutib qoling)</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={13} className="text-zinc-950" />
                              <span>Shaxsiy 30 Kunlik Rejani Ishlab chiqish</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* RENDER GENERATED PLAN COMPONENT */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#E6F3EE]/80 font-bold flex items-center gap-1">
                          SIZDAN SHAXSIY REJA / SYSTEM PLAN GENERATED
                        </span>
                        
                        <button
                          onClick={() => setGeneratedPlan("")}
                          className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                        >
                          Yangi Reja Tuzish
                        </button>
                      </div>

                      <div className="border border-zinc-800 rounded-2xl p-6 sm:p-8 bg-zinc-950 text-zinc-100 max-h-[420px] overflow-y-auto outline-none selection:bg-white selection:text-zinc-950">
                        {parseSimpleMarkdown(generatedPlan)}
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Apex Metodist Tizimi</span>
                        <span className="text-white font-extrabold bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">Verified Plan</span>
                      </div>
                    </div>
                  )}

                  {aiPlannerError && (
                    <div className="p-4 rounded-xl bg-red-400/10 text-red-400 border border-red-500/20 font-bold text-xs">
                      ✗ {aiPlannerError}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* COURSES SECTION WITH CATEGORY FILTER */}
        <section id="kurslar" className="py-24 bg-zinc-950 border-b border-zinc-900 relative">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left font-sans">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-900 border border-zinc-805 px-4 py-2 rounded-full font-mono">
                  {translations[lang].coursesSubtitle}
                </span>
                <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                  {translations[lang].coursesTitle}
                </h2>
                <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
                  {translations[lang].coursesDesc}
                </p>
              </div>

              {/* Filtering ribbon */}
              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      activeCategory === cat 
                        ? "bg-white border-white text-zinc-950 font-bold shadow-md" 
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {cat === "Barchasi" ? translations[lang].allCategories : dTrans(cat as string, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Card rendering */}
            {filteredCourses.length === 0 ? (
              <div className="bg-zinc-900/40 border border-zinc-85 backdrop-blur-xl rounded-2xl p-16 text-center shadow-sm max-w-md mx-auto">
                <p className="text-zinc-500 text-xs font-semibold">{lang === "en" ? "There are no classes in this category yet." : lang === "ru" ? "В этой категории пока нет курсов." : "Ushbu kategiriyada hozircha darslar mavjud emas."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    teachers={teachers}
                    onEnroll={handleEnrollClick}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TEACHERS SECTION */}
        <section id="ustozlar" className="py-24 bg-zinc-950 border-b border-zinc-900 relative">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="text-center space-y-4 font-sans">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#52e0a5] bg-[#051C15]/40 border border-[#52e0a5]/25 px-4 py-2 rounded-full font-mono">
                {translations[lang].teachersSubtitle}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                {translations[lang].teachersTitle}
              </h2>
              <p className="text-sm text-zinc-405 max-w-lg mx-auto leading-relaxed font-sans">
                {translations[lang].teachersDesc}
              </p>
            </div>

            {teachers.length === 0 ? (
              <p className="text-center text-zinc-500 text-xs py-10 font-mono">{lang === "en" ? "No teachers added yet." : lang === "ru" ? "Учителя пока не добавлены." : "Hozircha o'qituvchilar qo'shilmagan."}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STUDENT RESULTS SECTION */}
        <section id="natijalar" className="py-24 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
          <div className="mx-auto max-w-7xl px-6 space-y-16 relative z-10">
            <div className="text-center space-y-4 font-sans">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#52e0a5] bg-[#051C15]/40 border border-[#52e0a5]/25 px-4 py-2 rounded-full font-mono">
                {translations[lang].resultsBadge}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white">
                {translations[lang].resultsTitle}
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {translations[lang].resultsDesc}
              </p>
            </div>

            {studentResults.length === 0 ? (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center max-w-sm mx-auto">
                <p className="text-zinc-500 text-xs sm:text-sm font-semibold font-sans">{lang === "en" ? "Results will be posted soon!" : lang === "ru" ? "Результаты будут опубликованы в ближайщее время!" : "Yaxshi natijalar tez orada joylanadi!"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {studentResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResult(res)}
                    className="group bg-zinc-900/40 rounded-2xl border border-zinc-808 p-5 shadow-lg hover:shadow-zinc-950 hover:border-zinc-705 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between backdrop-blur-md"
                  >
                    {/* High contrast white and zinc score badge */}
                    <div className="absolute top-4 right-4 z-10 bg-white text-zinc-950 font-mono font-bold text-[10px] tracking-wide px-2.5 py-1 rounded shadow-md">
                      {res.score}
                    </div>

                    <div className="space-y-4 font-sans">
                      {/* Avatar photo display with robust fallback checks */}
                      <div className="aspect-square w-full rounded-xl bg-zinc-950 overflow-hidden relative border border-zinc-808">
                        {res.studentPhoto || res.image ? (
                          <img
                            src={res.studentPhoto || res.image}
                            alt={res.studentName}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
                            <GraduationCap className="text-zinc-500 h-10 w-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-[10px] font-bold font-mono tracking-widest uppercase flex items-center gap-1">
                            {translations[lang].certificateBtn} <ExternalLink size={10} />
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="font-sans font-bold text-white transition-colors group-hover:text-zinc-300 line-clamp-1">{res.studentName}</h4>
                        <p className="text-xs text-zinc-405 font-medium font-mono mt-0.5">{res.courseName}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-85 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-zinc-500 font-bold">{res.achievementDate || "2026"}</span>
                      <span className="text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-808 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==================== CAMPUS BRANCHES SECTION (Drujba, Oybek, Yunusobod) ==================== */}
        <section id="filiallar" className="py-24 bg-zinc-950 relative overflow-hidden border-b border-zinc-900 font-sans">
          <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-16">
            <div className="text-center space-y-4 font-sans">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-900 border border-zinc-808 px-4 py-2 rounded-full font-mono">
                {lang === "uz" ? "OFLAYN TA'LIM BINOLARI" : lang === "ru" ? "ОФЛАЙН ФИЛИАЛЫ" : "OUR HIGH-TECH CAMPUSES"}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white animate-fade-in">
                {lang === "uz" ? "Bizning Zamonaviy Filiallarimiz" : lang === "ru" ? "Наши Современные Филиалы" : "Explore Our Learning Campuses"}
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {lang === "uz" 
                  ? "Barcha filiallarimiz metro bekatlariga yaqin, eng zamonaviy shart-sharoitlar va dars xonalari bilan to'liq jihozlangan." 
                  : lang === "ru"
                    ? "Все наши филиалы находятся в минутной близости от станций метро и оборудованы по последнему слову техники."
                    : "All our campuses are closely situated next to metro stations, completely loaded with interactive smartboards and comfortable workspaces."}
              </p>
            </div>

            {/* Branches list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "drujba",
                  name: lang === "uz" ? "Drujba Narodov Filiali" : lang === "ru" ? "Филиал Дружба Народов" : "Drujba Narodov Campus",
                  landmark: lang === "uz" ? "Chilonzor tumani, Xalqlar do'stligi metro yaqinida" : lang === "ru" ? "Чиланзарский район, у метро Дружба Народов" : "Chilonzor district, near Drujba Narodov metro",
                  address: "G'afur G'ulom ko'chasi, 2-uy",
                  phone: "+998 (71) 200-0505",
                  mapUrl: "https://yandex.com/map-widget/v1/?ll=69.2396%2C41.3113&z=15",
                  cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=500&auto=format&fit=crop"
                },
                {
                  id: "oybek",
                  name: lang === "uz" ? "Oybek Filiali" : lang === "ru" ? "Филиал Ойбек" : "Oybek Campus",
                  landmark: lang === "uz" ? "Mirobod tumani, Oybek metro bekati yaqinida" : lang === "ru" ? "Мирабадский район, метро Ойбек" : "Mirobod district, near Oybek metro",
                  address: "Afrosiyob ko'chasi, 12-baho",
                  phone: "+998 (71) 200-0606",
                  mapUrl: "https://yandex.com/map-widget/v1/?ll=69.2796%2C41.2985&z=15",
                  cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500&auto=format&fit=crop"
                },
                {
                  id: "yunusobod",
                  name: lang === "uz" ? "Yunusobod Filiali" : lang === "ru" ? "Филиал Юнусабад" : "Yunusobod Campus",
                  landmark: lang === "uz" ? "Yunusobod tumani, Megaplanet va Yunusobod metro yaqini" : lang === "ru" ? "Юнусабадский район, у метро Юнусабад" : "Yunusobod district, near Megaplanet & Yunusobod metro",
                  address: "Amir Temur shoh ko'chasi, 95-uy",
                  phone: "+998 (71) 200-0707",
                  mapUrl: "https://yandex.com/map-widget/v1/?ll=69.2882%2C41.3655&z=15",
                  cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500&auto=format&fit=crop"
                }
              ].map((branch) => (
                <div 
                  key={branch.id} 
                  className="group bg-zinc-900/40 rounded-2xl border border-zinc-808 hover:border-zinc-700 overflow-hidden relative shadow-lg hover:-translate-y-1 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="h-52 w-full bg-zinc-950 overflow-hidden relative border-b border-zinc-800">
                      <img 
                        src={branch.cover} 
                        alt={branch.name} 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#E6F3EE] font-bold uppercase">
                        {lang === "uz" ? "METRO YAQLINIDA" : lang === "ru" ? "РЯДОМ С МЕТРО" : "METRO AREA"}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <strong className="text-white text-base font-bold tracking-tight block">{branch.name}</strong>
                        <span className="text-zinc-405 text-[10px] block font-medium mt-0.5">{branch.landmark}</span>
                      </div>
                    </div>

                    {/* Details body */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-2.5 text-xs font-sans">
                        <div className="flex items-start gap-2.5">
                          <MapPin size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                          <span className="text-zinc-300 font-medium">{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone size={14} className="text-zinc-400 shrink-0" />
                          <span className="text-zinc-300 font-mono font-medium">{branch.phone}</span>
                        </div>
                      </div>

                      {/* Map Widget Embed */}
                      <div className="rounded-xl overflow-hidden h-28 bg-zinc-950 relative border border-zinc-805 shadow-inner">
                        <iframe 
                          src={branch.mapUrl} 
                          title={branch.name}
                          className="w-full h-full border-0 opacity-80"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3 border-t border-zinc-800">
                    <button 
                      onClick={() => handleEnrollClick("")}
                      className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl text-[10px] tracking-wider uppercase py-2.5 cursor-pointer text-center flex items-center justify-center transition-all duration-200"
                    >
                      {lang === "uz" ? "Sinf band qilish" : lang === "ru" ? "Забронировать" : "Reserve Seat"}
                    </button>
                    <a 
                      href={branch.id === "drujba" ? "https://yandex.com/maps" : "https://maps.google.com"}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full border border-zinc-805 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 rounded-xl text-[10px] font-bold tracking-wider uppercase py-2.5 cursor-pointer text-center flex items-center justify-center gap-1 transition-all duration-200"
                    >
                      <Navigation size={10} className="text-zinc-400" />
                      <span>{lang === "uz" ? "Marshrut" : lang === "ru" ? "Маршрут" : "Route"}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="biz-haqimizda" className="py-24 bg-zinc-950 text-zinc-100 relative overflow-hidden border-b border-zinc-900 font-sans">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-6 space-y-8 font-sans">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-zinc-300 bg-zinc-900 border border-zinc-805 px-4 py-2 rounded-full font-mono">
                {translations[lang].aboutSubtitle}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4.5xl tracking-tight text-white leading-tight">
                {translations[lang].aboutTitle}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                {settings.aboutText || "Bizda yoshlar uchun barcha ta'lim dasturlari, mutlaqo tajribali va bir necha sertifikatlarga ega pedagoglar rahbarligida jahon standartiga mos tahlillar asosida o'rgatiladi."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-zinc-300 font-bold text-xs">
                <div className="flex items-center gap-3 bg-zinc-900/40 p-4 border border-zinc-808 rounded-xl shadow-sm">
                  <CheckCircle size={16} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-300">{lang === "en" ? "Safe Learning Workspace" : lang === "ru" ? "Безопасная учебная среда" : "Xavfsiz ta'lim muhiti"}</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/40 p-4 border border-zinc-808 rounded-xl shadow-sm">
                  <CheckCircle size={16} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-300">{lang === "en" ? "IELTS 8.5+ mentors" : lang === "ru" ? "Преподаватели IELTS 8.5+" : "IELTS 8.5+ Mentorlar"}</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/40 p-4 border border-zinc-808 rounded-xl shadow-sm">
                  <CheckCircle size={16} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-300">{lang === "en" ? "Regular Mock Tests" : lang === "ru" ? "Регулярные пробные тесты" : "Doimiy Mock Imtihonlari"}</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/40 p-4 border border-zinc-808 rounded-xl shadow-sm">
                  <CheckCircle size={16} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-300">{lang === "en" ? "Co-working & Library" : lang === "ru" ? "Коворкинг и библиотека" : "Kutubxona & Co-working"}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-video w-full rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
                  alt="Students collaboration"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>


        {/* CONTACT & QUICK QUERY FORM BLOCK */}
        <section id="kontakt" className="py-24 bg-[#03100C] text-[#E6F3EE] relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#52e0a5]/10 rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 animate-fade-in">
            
            {/* Contact Info block */}
            <div className="lg:col-span-5 space-y-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#52e0a5] bg-[#52e0a5]/10 px-3.5 py-2.5 rounded-full inline-block border border-[#52e0a5]/20">
                {translations[lang].contactSubtitle || "CONTACT"}
              </span>
              <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
                {lang === "en" ? "Have Questions? Let's Connect!" : lang === "ru" ? "Есть вопросы? Свяжитесь с нами!" : "Sizda savollar bormi? Biz bilan bog'laning!"}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                {lang === "en" ? "Get in touch with our team for professional academic advice and answers to all your educational queries." : lang === "ru" ? "Свяжитесь с нашей командой для получения профессиональной академической консультации." : "Markazimizga murojaat qilish orqali bepul dars maslahatlari va konsultatsiyani darhol dars boshlash uchun bepul oling."}
              </p>

              <div className="space-y-4 pt-2 text-sm">
                <div className="flex items-center gap-4 bg-[#051C15]/50 p-4.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-102">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#52e0a5]/10 text-[#52e0a5] shrink-0 border border-[#52e0a5]/20">
                    <Phone size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#52e0a5] font-bold block uppercase tracking-widest font-mono">{lang === "en" ? "OUR PHONE NUMBER" : lang === "ru" ? "НАШ ТЕЛЕФОН" : "Telefon raqamimiz"}</span>
                    <strong className="text-white text-sm font-extrabold">{settings.phone}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#051C15]/50 p-4.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-102">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#52e0a5]/10 text-[#52e0a5] shrink-0 border border-[#52e0a5]/20">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#52e0a5] font-bold block uppercase tracking-widest font-mono">{lang === "en" ? "EMAIL ADDRESS" : lang === "ru" ? "ЭЛЕКТРОННАЯ ПОЧТА" : "Pochta manzili"}</span>
                    <strong className="text-white text-sm font-extrabold">{settings.email}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#051C15]/50 p-4.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-102">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#52e0a5]/10 text-[#52e0a5] shrink-0 border border-[#52e0a5]/20">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#52e0a5] font-bold block uppercase tracking-widest font-mono">{lang === "en" ? "OUR ACADEMY ADDRESS" : lang === "ru" ? "АДРЕС АКАДЕМИИ" : "O'quv binosi"}</span>
                    <strong className="text-white text-sm font-extrabold">{settings.address}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick lead intake box */}
            <div className="lg:col-span-7 bg-[#051C15]/70 p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative backdrop-blur-md">
              <div className="absolute top-[8%] right-[8%] opacity-5 pointer-events-none">
                <Mail size={160} className="text-[#52e0a5]" />
              </div>
              <h3 className="font-sans font-black text-2xl text-white mb-2">{translations[lang].formTitle}</h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-8 font-medium font-sans">{translations[lang].formDesc}</p>
              
              {quickSuccess ? (
                <div className="p-8 rounded-2xl bg-[#082D22] text-[#52e0a5] border border-[#52e0a5]/20 text-center space-y-3">
                  <CheckCircle size={44} className="mx-auto text-[#52e0a5] animate-bounce" />
                  <h4 className="font-extrabold text-lg">Arizangiz Muvaffaqiyatli Qo'shildi!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">Tez orada operatorlarimiz siz bilan bog'lanib, bepul dars vaqtlarini aniqlashtirishadi.</p>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-black text-slate-350 uppercase tracking-widest mb-2 font-mono">{translations[lang].formName}</label>
                      <input
                        type="text"
                        required
                        placeholder="Sardor Alimov"
                        value={quickForm.name}
                        onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4.5 py-4 text-sm focus:bg-[#041410] text-white outline-none focus:ring-4 focus:ring-[#52e0a5]/10 focus:border-[#52e0a5] transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-350 uppercase tracking-widest mb-2 font-mono">{translations[lang].formPhone}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 (90) 123-4567"
                        value={quickForm.phone}
                        onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4.5 py-4 text-sm focus:bg-[#041410] text-white outline-none focus:ring-4 focus:ring-[#52e0a5]/10 focus:border-[#52e0a5] transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={quickLoading}
                    className="w-full btn-classic-green py-4.5 text-sm cursor-pointer hover:scale-[1.01]"
                  >
                    {quickLoading ? "Yuborilmoqda..." : translations[lang].formSubmit}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-[#030d0a] text-white border-t border-white/5 shrink-0">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          
          {/* Logo block */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#52e0a5] text-[#051B14] font-bold">
              <GraduationCap size={14} className="text-[#051C15]" />
            </span>
            <span className="font-sans font-black text-base text-white">
              {settings.name}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono text-center md:text-left">
            &copy; 2026 {settings.name}. Barcha huquqlar himoyalangan. Oxford Academy SaaS Edition.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4 text-slate-400">
            {settings.telegram && (
              <a href={settings.telegram} target="_blank" rel="noreferrer" className="hover:text-[#52e0a5] transition-colors" title="Telegram">
                <MessageCircle size={18} />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-[#52e0a5] transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-[#52e0a5] transition-colors" title="Facebook">
                <Facebook size={18} />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="hover:text-[#52e0a5] transition-colors" title="Youtube">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* ==================== INTAKE MODAL FOR INDIVIDUAL COURSE ==================== */}
      {showEnrollModal && (
        <AdmissionForm
          courses={courses}
          selectedCourseId={selectedCourseId}
          onClose={() => setShowEnrollModal(false)}
          onSuccess={loadAllData}
        />
      )}

      {/* ==================== STUDENT CERTIFICATE LIGHTBOX MODAL ==================== */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-[#051C15]/95 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden p-8 md:p-12 backdrop-blur-2xl">
            
            {/* Decorative certificate borders */}
            <div className="absolute inset-4 border-2 border-[#52e0a5]/35 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-[#52e0a5]/10 rounded-2xl pointer-events-none" />

            {/* Header stars */}
            <div className="text-center space-y-4 relative">
              <div className="flex justify-center">
                <Star className="h-6 w-6 text-[#52e0a5] fill-[#52e0a5]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#52e0a5] font-mono">Muvaffaqiyat Shohsupasi</span>
              <h3 className="font-serif italic text-3xl text-white tracking-tight">Certificate of Achievement</h3>
              <p className="text-[9px] text-[#52e0a5]/70 uppercase tracking-wider font-mono mt-2">Tasdiqlangan Natija / Verified Outcome</p>
            </div>

            {/* Student bio and layout columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8 items-center relative">
              <div className="md:col-span-4 flex justify-center">
                <div className="h-36 w-36 rounded-2xl overflow-hidden border-4 border-[#52e0a5]/20 shadow-lg bg-[#041410] flex items-center justify-center">
                  {selectedResult.studentPhoto || selectedResult.image ? (
                    <img
                      src={selectedResult.studentPhoto || selectedResult.image}
                      alt={selectedResult.studentName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-12 w-12 text-[#52e0a5]/50" />
                  )}
                </div>
              </div>

              <div className="md:col-span-8 text-center md:text-left space-y-4">
                <div>
                  <span className="text-xs text-[#52e0a5] block font-bold uppercase font-mono">Talaba / Student</span>
                  <strong className="text-2xl font-black text-white block tracking-tight font-sans mt-0.5">{selectedResult.studentName}</strong>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[#E6F3EE]">
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">Yo'nalish / Course</span>
                    <strong className="text-white font-black text-xs block mt-0.5">{selectedResult.courseName}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">Natija / Verified Score</span>
                    <strong className="text-[#52e0a5] font-black text-sm block mt-0.5">{selectedResult.score}</strong>
                  </div>
                </div>

                {selectedResult.studentBio && (
                  <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl">
                    <p className="text-xs text-slate-350 italic leading-relaxed">"{selectedResult.studentBio}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4 gap-4 relative">
              <div className="text-left py-1">
                <strong className="text-xs text-white block font-black">{settings.name} Administered</strong>
                <span className="text-[10px] text-slate-400 font-mono">Xalqaro Standartlar Kengashi</span>
              </div>
              
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl bg-[#52e0a5] hover:bg-[#43cd94] text-[#051C15] font-black px-5 py-2.5 text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {translations[lang].closeBtn}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== COMPLETE SAAS BACKEND CRUD PANEL ==================== */}
      {showAdminPanel && stats && (
        <AdminPanel
          initialSettings={settings}
          courses={courses}
          teachers={teachers}
          leads={leads}
          stats={stats}
          onRefreshData={loadAllData}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

    </div>
  );
}

// Inline Icon Components for Beautiful Display
function StarsBackgroundIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-[#52e0a5]">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/>
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>
    </svg>
  );
}
