import { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, GraduationCap, Award, HelpCircle, Loader2, ShieldCheck, Check, X } from "lucide-react";
import { api } from "../../api/client";
import { createTranslator } from "../../i18n";
import type { Course, SchoolSettings } from "../../types";

interface Question {
  id: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  text: Record<string, string>;
  options: Record<string, string[]>;
  correctIndex: number;
}

const QUESTION_POOL: Question[] = [
  // A1 Questions (8 total)
  {
    id: 1,
    level: "A1",
    text: { uz: "She ___ a doctor.", ru: "She ___ a doctor.", en: "She ___ a doctor." },
    options: { uz: ["is", "am", "are", "be"], ru: ["is", "am", "are", "be"], en: ["is", "am", "are", "be"] },
    correctIndex: 0,
  },
  {
    id: 2,
    level: "A1",
    text: { uz: "They ___ from Spain.", ru: "They ___ from Spain.", en: "They ___ from Spain." },
    options: { uz: ["are", "is", "am", "be"], ru: ["are", "is", "am", "be"], en: ["are", "is", "am", "be"] },
    correctIndex: 0,
  },
  {
    id: 3,
    level: "A1",
    text: { uz: "What is ___ name?", ru: "What is ___ name?", en: "What is ___ name?" },
    options: { uz: ["your", "you", "yours", "yourself"], ru: ["your", "you", "yours", "yourself"], en: ["your", "you", "yours", "yourself"] },
    correctIndex: 0,
  },
  {
    id: 4,
    level: "A1",
    text: { uz: "I ___ a sister. Her name is Sarah.", ru: "I ___ a sister. Her name is Sarah.", en: "I ___ a sister. Her name is Sarah." },
    options: { uz: ["have", "has", "having", "am having"], ru: ["have", "has", "having", "am having"], en: ["have", "has", "having", "am having"] },
    correctIndex: 0,
  },
  {
    id: 5,
    level: "A1",
    text: { uz: "___ you speak English?", ru: "___ you speak English?", en: "___ you speak English?" },
    options: { uz: ["Do", "Are", "Does", "Is"], ru: ["Do", "Are", "Does", "Is"], en: ["Do", "Are", "Does", "Is"] },
    correctIndex: 0,
  },
  {
    id: 6,
    level: "A1",
    text: { uz: "There ___ two books on the table.", ru: "There ___ two books on the table.", en: "There ___ two books on the table." },
    options: { uz: ["are", "is", "am", "be"], ru: ["are", "is", "am", "be"], en: ["are", "is", "am", "be"] },
    correctIndex: 0,
  },
  {
    id: 7,
    level: "A1",
    text: { uz: "My brother ___ like apples.", ru: "My brother ___ like apples.", en: "My brother ___ like apples." },
    options: { uz: ["doesn't", "don't", "isn't", "not"], ru: ["doesn't", "don't", "isn't", "not"], en: ["doesn't", "don't", "isn't", "not"] },
    correctIndex: 0,
  },
  {
    id: 8,
    level: "A1",
    text: { uz: "We go to school ___ Mondays.", ru: "We go to school ___ Mondays.", en: "We go to school ___ Mondays." },
    options: { uz: ["on", "in", "at", "by"], ru: ["on", "in", "at", "by"], en: ["on", "in", "at", "by"] },
    correctIndex: 0,
  },

  // A2 Questions (8 total)
  {
    id: 9,
    level: "A2",
    text: { uz: "Yesterday I ___ to the cinema.", ru: "Yesterday I ___ to the cinema.", en: "Yesterday I ___ to the cinema." },
    options: { uz: ["went", "go", "going", "gone"], ru: ["went", "go", "going", "gone"], en: ["went", "go", "going", "gone"] },
    correctIndex: 0,
  },
  {
    id: 10,
    level: "A2",
    text: { uz: "She is ___ than her sister.", ru: "She is ___ than her sister.", en: "She is ___ than her sister." },
    options: { uz: ["taller", "more tall", "tallest", "as tall"], ru: ["taller", "more tall", "tallest", "as tall"], en: ["taller", "more tall", "tallest", "as tall"] },
    correctIndex: 0,
  },
  {
    id: 11,
    level: "A2",
    text: { uz: "Where ___ you yesterday afternoon?", ru: "Where ___ you yesterday afternoon?", en: "Where ___ you yesterday afternoon?" },
    options: { uz: ["were", "was", "are", "did"], ru: ["were", "was", "are", "did"], en: ["were", "was", "are", "did"] },
    correctIndex: 0,
  },
  {
    id: 12,
    level: "A2",
    text: { uz: "Look! It ___ outside.", ru: "Look! It ___ outside.", en: "Look! It ___ outside." },
    options: { uz: ["is raining", "rains", "rained", "rain"], ru: ["is raining", "rains", "rained", "rain"], en: ["is raining", "rains", "rained", "rain"] },
    correctIndex: 0,
  },
  {
    id: 13,
    level: "A2",
    text: { uz: "Have you ___ been to London?", ru: "Have you ___ been to London?", en: "Have you ___ been to London?" },
    options: { uz: ["ever", "never", "already", "yet"], ru: ["ever", "never", "already", "yet"], en: ["ever", "never", "already", "yet"] },
    correctIndex: 0,
  },
  {
    id: 14,
    level: "A2",
    text: { uz: "I ___ a new car last week.", ru: "I ___ a new car last week.", en: "I ___ a new car last week." },
    options: { uz: ["bought", "buy", "boughten", "have bought"], ru: ["bought", "buy", "boughten", "have bought"], en: ["bought", "buy", "boughten", "have bought"] },
    correctIndex: 0,
  },
  {
    id: 15,
    level: "A2",
    text: { uz: "He wants ___ a new computer.", ru: "He wants ___ a new computer.", en: "He wants ___ a new computer." },
    options: { uz: ["to buy", "buying", "buy", "for buy"], ru: ["to buy", "buying", "buy", "for buy"], en: ["to buy", "buying", "buy", "for buy"] },
    correctIndex: 0,
  },
  {
    id: 16,
    level: "A2",
    text: { uz: "If it ___ tomorrow, we will stay at home.", ru: "If it ___ tomorrow, we will stay at home.", en: "If it ___ tomorrow, we will stay at home." },
    options: { uz: ["rains", "rain", "will rain", "rained"], ru: ["rains", "rain", "will rain", "rained"], en: ["rains", "rain", "will rain", "rained"] },
    correctIndex: 0,
  },

  // B1 Questions (8 total)
  {
    id: 17,
    level: "B1",
    text: { uz: "I have been living in Tashkent ___ three years.", ru: "I have been living in Tashkent ___ three years.", en: "I have been living in Tashkent ___ three years." },
    options: { uz: ["for", "since", "during", "in"], ru: ["for", "since", "during", "in"], en: ["for", "since", "during", "in"] },
    correctIndex: 0,
  },
  {
    id: 18,
    level: "B1",
    text: { uz: "You ___ smoke here; it is strictly prohibited.", ru: "You ___ smoke here; it is strictly prohibited.", en: "You ___ smoke here; it is strictly prohibited." },
    options: { uz: ["mustn't", "needn't", "shouldn't", "don't have to"], ru: ["mustn't", "needn't", "shouldn't", "don't have to"], en: ["mustn't", "needn't", "shouldn't", "don't have to"] },
    correctIndex: 0,
  },
  {
    id: 19,
    level: "B1",
    text: { uz: "I look forward to ___ from you soon.", ru: "I look forward to ___ from you soon.", en: "I look forward to ___ from you soon." },
    options: { uz: ["hearing", "hear", "heard", "be hearing"], ru: ["hearing", "hear", "heard", "be hearing"], en: ["hearing", "hear", "heard", "be hearing"] },
    correctIndex: 0,
  },
  {
    id: 20,
    level: "B1",
    text: { uz: "The letter was ___ by the director yesterday.", ru: "The letter was ___ by the director yesterday.", en: "The letter was ___ by the director yesterday." },
    options: { uz: ["signed", "sign", "signing", "signs"], ru: ["signed", "sign", "signing", "signs"], en: ["signed", "sign", "signing", "signs"] },
    correctIndex: 0,
  },
  {
    id: 21,
    level: "B1",
    text: { uz: "If I ___ you, I would study harder.", ru: "If I ___ you, I would study harder.", en: "If I ___ you, I would study harder." },
    options: { uz: ["were", "am", "would be", "was"], ru: ["were", "am", "would be", "was"], en: ["were", "am", "would be", "was"] },
    correctIndex: 0,
  },
  {
    id: 22,
    level: "B1",
    text: { uz: "She ___ already eaten dinner when he arrived.", ru: "She ___ already eaten dinner when he arrived.", en: "She ___ already eaten dinner when he arrived." },
    options: { uz: ["had", "has", "did", "was"], ru: ["had", "has", "did", "was"], en: ["had", "has", "did", "was"] },
    correctIndex: 0,
  },
  {
    id: 23,
    level: "B1",
    text: { uz: "While I ___ a book, the phone rang.", ru: "While I ___ a book, the phone rang.", en: "While I ___ a book, the phone rang." },
    options: { uz: ["was reading", "read", "have read", "had read"], ru: ["was reading", "read", "have read", "had read"], en: ["was reading", "read", "have read", "had read"] },
    correctIndex: 0,
  },
  {
    id: 24,
    level: "B1",
    text: { uz: "This is the house ___ my grandfather built.", ru: "This is the house ___ my grandfather built.", en: "This is the house ___ my grandfather built." },
    options: { uz: ["which", "who", "where", "whom"], ru: ["which", "who", "where", "whom"], en: ["which", "who", "where", "whom"] },
    correctIndex: 0,
  },

  // B2 Questions (8 total)
  {
    id: 25,
    level: "B2",
    text: { uz: "By the time the police arrived, the thief ___.", ru: "By the time the police arrived, the thief ___.", en: "By the time the police arrived, the thief ___." },
    options: { uz: ["had escaped", "escaped", "has escaped", "was escaping"], ru: ["had escaped", "escaped", "has escaped", "was escaping"], en: ["had escaped", "escaped", "has escaped", "was escaping"] },
    correctIndex: 0,
  },
  {
    id: 26,
    level: "B2",
    text: { uz: "She wishes she ___ more time to study last week.", ru: "She wishes she ___ more time to study last week.", en: "She wishes she ___ more time to study last week." },
    options: { uz: ["had had", "had", "would have", "has"], ru: ["had had", "had", "would have", "has"], en: ["had had", "had", "would have", "has"] },
    correctIndex: 0,
  },
  {
    id: 27,
    level: "B2",
    text: { uz: "The project was delayed ___ technical difficulties.", ru: "The project was delayed ___ technical difficulties.", en: "The project was delayed ___ technical difficulties." },
    options: { uz: ["due to", "because", "although", "despite of"], ru: ["due to", "because", "although", "despite of"], en: ["due to", "because", "although", "despite of"] },
    correctIndex: 0,
  },
  {
    id: 28,
    level: "B2",
    text: { uz: "He denied ___ the money.", ru: "He denied ___ the money.", en: "He denied ___ the money." },
    options: { uz: ["stealing", "to steal", "steal", "stolen"], ru: ["stealing", "to steal", "steal", "stolen"], en: ["stealing", "to steal", "steal", "stolen"] },
    correctIndex: 0,
  },
  {
    id: 29,
    level: "B2",
    text: { uz: "We should get used to ___ early.", ru: "We should get used to ___ early.", en: "We should get used to ___ early." },
    options: { uz: ["waking up", "wake up", "woke up", "be waking up"], ru: ["waking up", "wake up", "woke up", "be waking up"], en: ["waking up", "wake up", "woke up", "be waking up"] },
    correctIndex: 0,
  },
  {
    id: 30,
    level: "B2",
    text: { uz: "I would have helped you if you ___ me.", ru: "I would have helped you if you ___ me.", en: "I would have helped you if you ___ me." },
    options: { uz: ["had asked", "asked", "would ask", "have asked"], ru: ["had asked", "asked", "would ask", "have asked"], en: ["had asked", "asked", "would ask", "have asked"] },
    correctIndex: 0,
  },
  {
    id: 31,
    level: "B2",
    text: { uz: "She was accused ___ cheating in the exam.", ru: "She was accused ___ cheating in the exam.", en: "She was accused ___ cheating in the exam." },
    options: { uz: ["of", "for", "about", "with"], ru: ["of", "for", "about", "with"], en: ["of", "for", "about", "with"] },
    correctIndex: 0,
  },
  {
    id: 32,
    level: "B2",
    text: { uz: "You had better ___ your homework before you go out.", ru: "You had better ___ your homework before you go out.", en: "You had better ___ your homework before you go out." },
    options: { uz: ["do", "to do", "doing", "did"], ru: ["do", "to do", "doing", "did"], en: ["do", "to do", "doing", "did"] },
    correctIndex: 0,
  },

  // C1 Questions (8 total)
  {
    id: 33,
    level: "C1",
    text: { uz: "Rarely ___ such a beautiful painting.", ru: "Rarely ___ such a beautiful painting.", en: "Rarely ___ such a beautiful painting." },
    options: { uz: ["have I seen", "I have seen", "I saw", "did I saw"], ru: ["have I seen", "I have seen", "I saw", "did I saw"], en: ["have I seen", "I have seen", "I saw", "did I saw"] },
    correctIndex: 0,
  },
  {
    id: 34,
    level: "C1",
    text: { uz: "___ of the bad weather, they went for a walk.", ru: "___ of the bad weather, they went for a walk.", en: "___ of the bad weather, they went for a walk." },
    options: { uz: ["In spite", "Despite", "Although", "However"], ru: ["In spite", "Despite", "Although", "However"], en: ["In spite", "Despite", "Although", "However"] },
    correctIndex: 0,
  },
  {
    id: 35,
    level: "C1",
    text: { uz: "He behaved as if he ___ the boss.", ru: "He behaved as if he ___ the boss.", en: "He behaved as if he ___ the boss." },
    options: { uz: ["were", "is", "has been", "was being"], ru: ["were", "is", "has been", "was being"], en: ["were", "is", "has been", "was being"] },
    correctIndex: 0,
  },
  {
    id: 36,
    level: "C1",
    text: { uz: "Under no circumstances ___ enter this room.", ru: "Under no circumstances ___ enter this room.", en: "Under no circumstances ___ enter this room." },
    options: { uz: ["should you", "you should", "you can", "did you"], ru: ["should you", "you should", "you can", "did you"], en: ["should you", "you should", "you can", "did you"] },
    correctIndex: 0,
  },
  {
    id: 37,
    level: "C1",
    text: { uz: "They decided to call off the meeting, ___ pleased nobody.", ru: "They decided to call off the meeting, ___ pleased nobody.", en: "They decided to call off the meeting, ___ pleased nobody." },
    options: { uz: ["which", "that", "what", "whom"], ru: ["which", "that", "what", "whom"], en: ["which", "that", "what", "whom"] },
    correctIndex: 0,
  },
  {
    id: 38,
    level: "C1",
    text: { uz: "Little ___ that they were planning a surprise party.", ru: "Little ___ that they were planning a surprise party.", en: "Little ___ that they were planning a surprise party." },
    options: { uz: ["did he know", "he knew", "he had known", "has he known"], ru: ["did he know", "he knew", "he had known", "has he known"], en: ["did he know", "he knew", "he had known", "has he known"] },
    correctIndex: 0,
  },
  {
    id: 39,
    level: "C1",
    text: { uz: "No sooner ___ than the rain started.", ru: "No sooner ___ than the rain started.", en: "No sooner ___ than the rain started." },
    options: { uz: ["had we arrived", "we arrived", "did we arrive", "we had arrived"], ru: ["had we arrived", "we arrived", "did we arrive", "we had arrived"], en: ["had we arrived", "we arrived", "did we arrive", "we had arrived"] },
    correctIndex: 0,
  },
  {
    id: 40,
    level: "C1",
    text: { uz: "I would rather you ___ tell her about this.", ru: "I would rather you ___ tell her about this.", en: "I would rather you ___ tell her about this." },
    options: { uz: ["didn't", "don't", "won't", "shouldn't"], ru: ["didn't", "don't", "won't", "shouldn't"], en: ["didn't", "don't", "won't", "shouldn't"] },
    correctIndex: 0,
  },

  // C2 Questions (8 total)
  {
    id: 41,
    level: "C2",
    text: { uz: "Supposing you ___ the lottery, what would you do?", ru: "Supposing you ___ the lottery, what would you do?", en: "Supposing you ___ the lottery, what would you do?" },
    options: { uz: ["won", "win", "had won", "would win"], ru: ["won", "win", "had won", "would win"], en: ["won", "win", "had won", "would win"] },
    correctIndex: 0,
  },
  {
    id: 42,
    level: "C2",
    text: { uz: "It's high time you ___ looking for a job.", ru: "It's high time you ___ looking for a job.", en: "It's high time you ___ looking for a job." },
    options: { uz: ["started", "start", "would start", "had started"], ru: ["started", "start", "would start", "had started"], en: ["started", "start", "would start", "had started"] },
    correctIndex: 0,
  },
  {
    id: 43,
    level: "C2",
    text: { uz: "But for your help, we ___ in time.", ru: "But for your help, we ___ in time.", en: "But for your help, we ___ in time." },
    options: { uz: ["wouldn't have finished", "hadn't finished", "won't finish", "shouldn't finish"], ru: ["wouldn't have finished", "hadn't finished", "won't finish", "shouldn't finish"], en: ["wouldn't have finished", "hadn't finished", "won't finish", "shouldn't finish"] },
    correctIndex: 0,
  },
  {
    id: 44,
    level: "C2",
    text: { uz: "Had I known about the party, I ___ it.", ru: "Had I known about the party, I ___ it.", en: "Had I known about the party, I ___ it." },
    options: { uz: ["would have attended", "will attend", "attended", "would attend"], ru: ["would have attended", "will attend", "attended", "would attend"], en: ["would have attended", "will attend", "attended", "would attend"] },
    correctIndex: 0,
  },
  {
    id: 45,
    level: "C2",
    text: { uz: "She was so engrossed ___ her book that she forgot to eat.", ru: "She was so engrossed ___ her book that she forgot to eat.", en: "She was so engrossed ___ her book that she forgot to eat." },
    options: { uz: ["in", "with", "at", "on"], ru: ["in", "with", "at", "on"], en: ["in", "with", "at", "on"] },
    correctIndex: 0,
  },
  {
    id: 46,
    level: "C2",
    text: { uz: "The company is on the brink ___ bankruptcy.", ru: "The company is on the brink ___ bankruptcy.", en: "The company is on the brink ___ bankruptcy." },
    options: { uz: ["of", "to", "at", "with"], ru: ["of", "to", "at", "with"], en: ["of", "to", "at", "with"] },
    correctIndex: 0,
  },
  {
    id: 47,
    level: "C2",
    text: { uz: "You should have known better ___ to trust him.", ru: "You should have known better ___ to trust him.", en: "You should have known better ___ to trust him." },
    options: { uz: ["than", "rather", "instead", "but"], ru: ["than", "rather", "instead", "but"], en: ["than", "rather", "instead", "but"] },
    correctIndex: 0,
  },
  {
    id: 48,
    level: "C2",
    text: { uz: "Try ___ she might, she couldn't open the door.", ru: "Try ___ she might, she couldn't open the door.", en: "Try ___ she might, she couldn't open the door." },
    options: { uz: ["as", "though", "although", "even if"], ru: ["as", "though", "although", "even if"], en: ["as", "though", "although", "even if"] },
    correctIndex: 0,
  },
];

const TIMER_SECONDS = 45;

export default function PlacementTestPage({
  settings,
  courses,
  lang,
  onBack,
}: {
  settings: SchoolSettings;
  courses: Course[];
  lang: string;
  onBack: () => void;
}) {
  const t = createTranslator(lang as any);
  const [step, setStep] = useState<"intro" | "quiz" | "result" | "success">("intro");
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Visual feedback states
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [revealFeedback, setRevealFeedback] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (step !== "quiz" || isLocked) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1);
          return TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, qIndex, activeQuestions, isLocked]);

  const generateQuiz = () => {
    const levels: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const chosenQuestions: Question[] = [];

    levels.forEach((lvl) => {
      const levelPool = QUESTION_POOL.filter((q) => q.level === lvl);
      const shuffled = [...levelPool].sort(() => 0.5 - Math.random());
      chosenQuestions.push(shuffled[0], shuffled[1]);
    });

    setActiveQuestions(chosenQuestions.sort(() => 0.5 - Math.random()));
    setAnswers([]);
    setQIndex(0);
    setTimeLeft(TIMER_SECONDS);
    setClickedIndex(null);
    setRevealFeedback(false);
    setIsLocked(false);
    setStep("quiz");
  };

  const handleAnswer = (optionIdx: number) => {
    if (isLocked) return;

    setIsLocked(true);
    setClickedIndex(optionIdx);
    setRevealFeedback(true);

    // Delay by 1.2 seconds so the student can study the outcome
    setTimeout(() => {
      const nextAnswers = [...answers, optionIdx];
      setAnswers(nextAnswers);
      setClickedIndex(null);
      setRevealFeedback(false);
      setIsLocked(false);

      if (qIndex + 1 < activeQuestions.length) {
        setQIndex(qIndex + 1);
        setTimeLeft(TIMER_SECONDS);
      } else {
        setStep("result");
      }
    }, 1200);
  };

  // Calculate score
  const score = answers.reduce((acc, ans, idx) => {
    if (idx >= activeQuestions.length) return acc;
    return ans === activeQuestions[idx].correctIndex ? acc + 1 : acc;
  }, 0);

  // Dynamic standing level based on current answers
  const getLiveLevel = () => {
    if (answers.length === 0) return "Beginner (A1)";
    const correctSoFar = answers.reduce((acc, ans, idx) => {
      return ans === activeQuestions[idx].correctIndex ? acc + 1 : acc;
    }, 0);
    const ratio = correctSoFar / answers.length;
    if (ratio <= 0.25) return "Elementary (A2)";
    if (ratio <= 0.5) return "Pre-Intermediate (B1)";
    if (ratio <= 0.7) return "Intermediate (B2)";
    if (ratio <= 0.85) return "Upper-Intermediate (C1)";
    return "Advanced (C2)";
  };

  let levelName = "";
  let levelDesc = "";
  let recKeyword = "";

  if (score <= 2) {
    levelName = "Beginner (A1)";
    levelDesc = lang === "uz" 
      ? "Siz ingliz tilini endi o'rganishni boshlayapsiz. Kurslarimiz sizga harflar va sodda gaplardan boshlab yordam beradi." 
      : lang === "ru" 
      ? "Вы только начинаете изучать английский. Наши курсы помогут вам начать с букв и простых предложений."
      : "You are just starting to learn English. Our courses will help you begin with basics and simple phrases.";
    recKeyword = "Starter";
  } else if (score <= 4) {
    levelName = "Elementary (A2)";
    levelDesc = lang === "uz"
      ? "Sizda asosiy bilimlar bor, sodda suhbatlarni tushunasiz. Endi so'z boyligi va gap tuzishni kuchaytirish kerak."
      : lang === "ru"
      ? "У вас есть базовые знания, вы понимаете простые разговоры. Теперь нужно укрепить словарный запас и грамматику."
      : "You have basic knowledge, you understand simple conversations. Now you need to strengthen vocabulary and grammar.";
    recKeyword = "Elementary";
  } else if (score <= 6) {
    levelName = "Pre-Intermediate (B1)";
    levelDesc = lang === "uz"
      ? "Kundalik vaziyatlarda muloqot qila olasiz. Kelajakda murakkabroq mavzularda so'zlashish uchun grammatika va leksikani chuqurlashtirish kerak."
      : lang === "ru"
      ? "Вы можете общаться в повседневных ситуациях. Требуется углубление грамматики и лексики для сложных тем."
      : "You can communicate in daily situations. Grammar and vocabulary expansion are needed for more complex topics.";
    recKeyword = "General";
  } else if (score <= 8) {
    levelName = "Intermediate (B2)";
    levelDesc = lang === "uz"
      ? "Siz ingliz tilida erkinroq gapira olasiz va matnlarni tushunasiz. IELTS yoki CEFR tayyorlov kurslarimiz sizga mos."
      : lang === "ru"
      ? "Вы свободно говорите по-английски и понимаете тексты. Наши подготовительные курсы IELTS или CEFR идеально вам подходят."
      : "You speak English fluently and understand texts. Our IELTS or CEFR preparation courses are perfect for you.";
    recKeyword = "IELTS Foundation";
  } else if (score <= 10) {
    levelName = "Upper-Intermediate (C1)";
    levelDesc = lang === "uz"
      ? "Siz murakkab matnlar va professional suhbatlarni erkin tushunasiz. Oliy natijalarga erishish uchun maxsus IELTS yoki SAT kurslarimiz mos keladi."
      : lang === "ru"
      ? "Вы свободно понимаете сложные тексты и профессиональные беседы. Для высоких результатов подойдут курсы IELTS или SAT."
      : "You understand complex texts and professional conversations. Advanced IELTS or SAT courses are recommended.";
    recKeyword = "IELTS";
  } else {
    levelName = "Advanced (C2)";
    levelDesc = lang === "uz"
      ? "Siz ingliz tilini ona tili darajasida bilasiz. Ilmiy yoki biznes darajasidagi ingliz tili, shuningdek IELTS 8.0+ kurslarimiz sizga mos."
      : lang === "ru"
      ? "Вы владеете английским на уровне носителя. Подходят курсы академического английского или подготовка к IELTS 8.0+."
      : "You possess native-like fluency. Academic English or IELTS 8.0+ courses are suitable for you.";
    recKeyword = "IELTS";
  }

  const recommendedCourses = courses.filter((c) => 
    c.name.toLowerCase().includes(recKeyword.toLowerCase()) || 
    c.category.toLowerCase().includes(recKeyword.toLowerCase())
  );
  const finalRecommendations = recommendedCourses.length ? recommendedCourses : courses.slice(0, 2);

  if (finalRecommendations.length && !selectedCourseId) {
    setSelectedCourseId(finalRecommendations[0].id);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || phone.length < 9) {
      setError(lang === "uz" ? "Iltimos, maydonlarni to'ldiring." : "Пожалуйста, заполните поля корректно.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const chosenCourse = courses.find(c => c.id === selectedCourseId);
    const courseName = chosenCourse ? chosenCourse.name : "Noma'lum";

    const payload = {
      studentName,
      phone,
      courseId: selectedCourseId,
      notes: `PLACEMENT TEST RESULT: ${levelName} (Score: ${score}/${activeQuestions.length}). Recommended course: ${courseName}.`,
    };

    try {
      await api.post("/leads", payload);
      setStep("success");
    } catch (err) {
      setError(lang === "uz" ? "Tizimda xatolik yuz berdi. Iltimos, qayta urunib ko'ring." : "Произошла ошибка. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / TIMER_SECONDS) * circumference;

  return (
    <div className="min-h-screen bg-warm text-charcoal py-12 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />


      <div className="w-full max-w-2xl bg-white/75 backdrop-blur-xl border border-black/5 rounded-3xl p-6 sm:p-10 shadow-soft-xl relative z-10">
        
        {/* Header with Back button */}
        {step !== "success" && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-soft hover:text-caramel-deep transition"
            >
              <ArrowLeft size={16} />
              {t("galleryBackHome")}
            </button>
            <div className="flex items-center gap-1.5 font-display text-sm font-extrabold text-caramel-deep">
              <GraduationCap size={18} />
              {settings.name}
            </div>
          </div>
        )}

        {/* Intro Step */}
        {step === "intro" && (
          <div className="text-center py-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-caramel/10 text-caramel-deep mb-6">
              <Award size={32} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal mb-4">
              {t("levelTestTitle")}
            </h1>
            <p className="text-base text-charcoal-soft leading-relaxed max-w-lg mx-auto mb-8">
              {lang === "uz"
                ? "48 ta savoldan iborat CEFR bazasidan tasodifiy olingan 12 ta tezkor savol orqali bilimingizni aniq tekshiring. Har bir savolga 45 soniya beriladi."
                : lang === "ru"
                ? "Проверьте свои знания с помощью 12 случайных вопросов из базы CEFR (48 вопросов). На каждый вопрос дается 45 секунд."
                : "Accurately test your English with 12 randomized CEFR questions selected from a pool of 48. You have 45 seconds per question."}
            </p>
            <button onClick={generateQuiz} className="btn-primary rounded-full px-8 py-3.5 text-base shadow-soft-lg w-full sm:w-auto">
              {t("levelTestStart")}
              <ChevronRight size={18} className="inline ml-1" />
            </button>
          </div>
        )}

        {/* Quiz Step */}
        {step === "quiz" && activeQuestions.length > 0 && (
          <div>
            {/* Header / Progress & Timer */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-caramel-deep">
                    Level Test
                  </span>
                  <span className="text-[10px] font-extrabold bg-caramel/10 text-caramel-deep px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {getLiveLevel()}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-charcoal mt-1">
                  {t("question")} {qIndex + 1} {t("of")} {activeQuestions.length}
                </h3>
              </div>

              {/* Circular SVG Timer */}
              <div className="relative flex items-center justify-center h-12 w-12 shrink-0">
                <svg className="transform -rotate-90 w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="rgba(0, 0, 0, 0.05)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-caramel transition-all duration-1000"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-charcoal">
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-caramel to-caramel-deep transition-all duration-300"
                style={{ width: `${((qIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="bg-cream-soft rounded-2xl p-5 border border-black/5 mb-6 flex items-start gap-3">
              <HelpCircle size={20} className="text-caramel shrink-0 mt-0.5" />
              <h2 className="font-display text-lg font-bold text-charcoal leading-snug">
                {activeQuestions[qIndex].text[lang] || activeQuestions[qIndex].text.en}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {(activeQuestions[qIndex].options[lang] || activeQuestions[qIndex].options.en).map((opt, idx) => {
                const isSelected = clickedIndex === idx;
                const isCorrectOption = idx === activeQuestions[qIndex].correctIndex;
                
                let btnStyle = "bg-white border-black/5 hover:border-caramel/40 hover:bg-cream-soft text-charcoal";
                let iconEl = null;

                if (revealFeedback) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-50/70 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-100";
                    iconEl = <Check size={16} className="text-emerald-600 shrink-0" />;
                  } else if (isSelected) {
                    btnStyle = "bg-rose-50/70 border-rose-500 text-rose-700 shadow-sm shadow-rose-100";
                    iconEl = <X size={16} className="text-rose-600 shrink-0" />;
                  } else {
                    btnStyle = "bg-white border-black/5 text-charcoal opacity-40";
                  }
                }

                const animClass = revealFeedback
                  ? (isCorrectOption ? "animate-ripple" : (isSelected ? "animate-gentle-shake" : ""))
                  : "";

                return (
                  <button
                    key={idx}
                    disabled={isLocked}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left border rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-200 shadow-soft flex items-center justify-between group ${btnStyle} ${animClass}`}
                  >
                    <span>{opt}</span>
                    <div className="flex items-center gap-2">
                      {iconEl}
                      <span className="h-6 w-6 rounded-full border border-black/10 flex items-center justify-center text-[10px] font-bold text-charcoal-soft bg-warm group-hover:border-caramel group-hover:text-caramel group-hover:bg-white uppercase">
                        {String.fromCharCode(97 + idx)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result & Lead Capture Step */}
        {step === "result" && (
          <div>
            {/* Visual Level Certificate */}
            <div className="relative border-4 border-double border-caramel/30 bg-cream-soft rounded-3xl p-6 sm:p-8 text-center shadow-soft-lg mb-8 overflow-hidden">
              {/* Gold seal background watermarks */}
              <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full border-4 border-caramel/5 pointer-events-none rotate-45" />

              <div className="flex justify-center mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-caramel/10 text-caramel-deep relative">
                  <ShieldCheck size={26} />
                </div>
              </div>

              <span className="font-display text-[10px] uppercase font-extrabold tracking-[0.25em] text-caramel-deep">
                Certificate of Proficiency
              </span>
              
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal mt-3">
                {levelName}
              </h2>
              
              <div className="w-16 h-0.5 bg-caramel/40 mx-auto my-4" />

              <p className="text-xs text-charcoal-soft leading-relaxed max-w-sm mx-auto font-semibold mb-2">
                {levelDesc}
              </p>

              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-charcoal font-bold border-t border-black/5 pt-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-charcoal-soft font-semibold mb-0.5">
                    {t("levelTestScore")}
                  </span>
                  <span className="text-caramel-deep text-sm">{score} / {activeQuestions.length}</span>
                </div>
                <div className="w-px h-6 bg-black/10" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-charcoal-soft font-semibold mb-0.5">
                    Date
                  </span>
                  <span className="text-charcoal-soft text-sm">{new Date().toLocaleDateString(lang === "uz" ? "uz-UZ" : "ru-RU")}</span>
                </div>
              </div>

              {/* Gold Ribbon Seal Stamp */}
              <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-br from-caramel to-caramel-deep flex items-center justify-center shadow-md rotate-[15deg]">
                <Award size={20} className="text-white" />
                {/* Ribbons */}
                <div className="absolute top-10 left-3 w-2 h-4 bg-caramel-deep origin-top -rotate-[15deg]" />
                <div className="absolute top-10 right-3 w-2 h-4 bg-caramel origin-top rotate-[15deg]" />
              </div>
            </div>

            {/* Course recommendations */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-caramel" />
                {t("levelTestRecommendedCourse")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {finalRecommendations.map((course) => (
                  <div key={course.id} className="card-soft border border-black/5 bg-white rounded-2xl p-5 flex flex-col justify-between hover:border-caramel/30 transition shadow-soft">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-caramel-deep bg-caramel/5 px-2.5 py-0.5 rounded-full">
                        {course.category}
                      </span>
                      <h4 className="font-display text-base font-bold text-charcoal mt-2 mb-1">
                        {course.name}
                      </h4>
                      <p className="text-xs text-charcoal-soft line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-charcoal font-semibold">
                      <span>{course.duration}</span>
                      <span className="text-caramel-deep font-bold">{course.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead capture form */}
            <form onSubmit={handleSubmit} className="bg-cream-soft rounded-2xl p-6 border border-black/5">
              <h3 className="font-display text-base font-bold text-charcoal mb-1">
                {t("levelTestRegisterTitle")}
              </h3>
              <p className="text-xs text-charcoal-soft mb-4">
                {t("levelTestRegisterDesc")}
              </p>

              {error && (
                <div className="mb-4 text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-soft uppercase tracking-wider mb-1.5">
                    {t("formName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Toshmatov Polat"
                    className="w-full bg-white border border-black/10 focus:border-caramel focus:ring-1 focus:ring-caramel rounded-xl px-4 py-3 text-sm transition outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-soft uppercase tracking-wider mb-1.5">
                    {t("formPhone")}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    className="w-full bg-white border border-black/10 focus:border-caramel focus:ring-1 focus:ring-caramel rounded-xl px-4 py-3 text-sm transition outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-soft uppercase tracking-wider mb-1.5">
                    {t("formCourse")}
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-white border border-black/10 focus:border-caramel focus:ring-1 focus:ring-caramel rounded-xl px-4 py-3 text-sm transition outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 shadow-soft-lg mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("formSending")}
                    </>
                  ) : (
                    t("formSubmit")
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="text-center py-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-jade/10 text-jade-deep mb-6">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal mb-4">
              {t("formSuccess")}
            </h1>
            <p className="text-sm text-charcoal-soft leading-relaxed max-w-sm mx-auto mb-8">
              {lang === "uz" 
                ? "Sizning darajangiz va natijalaringiz tizimga muvaffaqiyatli saqlandi. Tez orada aloqaga chiqamiz!" 
                : lang === "ru" 
                ? "Ваш уровень и результаты успешно сохранены. Мы свяжемся с вами в ближайшее время!"
                : "Your level and results have been successfully saved. We will contact you shortly!"}
            </p>
            <button onClick={onBack} className="btn-primary rounded-full px-8 py-3 shadow-soft-lg">
              {t("levelTestBackHome")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
