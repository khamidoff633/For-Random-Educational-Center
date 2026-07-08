import { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, GraduationCap, Award, HelpCircle, Loader2, ShieldCheck, Check, X, Hourglass } from "lucide-react";
import { api } from "../../api/client";
import { createTranslator } from "../../i18n";
import type { Course, SchoolSettings } from "../../types";
import gsap from "gsap";
import tornPaper from "../../assets/torn_paper.png";
import twoCandlesImg from "../../assets/two_candles.png";
import realisticClock from "../../assets/realistic_clock.png";
import libraryDeskBg from "../../assets/library_desk_bg.jpg";

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

const Candle = () => {
  const glow1Ref   = useRef<HTMLDivElement>(null);
  const glow2Ref   = useRef<HTMLDivElement>(null);
  const ground1Ref = useRef<HTMLDivElement>(null);
  const ground2Ref = useRef<HTMLDivElement>(null);
  const spark1Ref  = useRef<HTMLDivElement>(null);
  const spark2Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Flicker each candle's glow + its matching ground shadow ──
    const flicker = (
      glowEl:    HTMLDivElement | null,
      groundEl:  HTMLDivElement | null,
      offsetSec: number
    ) => {
      const tl = gsap.timeline({ repeat: -1, delay: offsetSec });
      for (let i = 0; i < 80; i++) {
        const dur = 0.03 + Math.random() * 0.07;
        const op  = 0.45 + Math.random() * 0.55;
        const sc  = 0.82 + Math.random() * 0.36;
        const dx  = (-3  + Math.random() * 6);
        tl.to(glowEl,   { opacity: op, scale: sc, x:  dx, duration: dur, ease: "none" }, i * dur);
        tl.to(groundEl, { opacity: op * 0.8, scaleX: sc * 0.9, duration: dur, ease: "none" }, i * dur);
      }
      return tl;
    };

    // ── Rising ember sparks ───────────────────────────────────────
    const sparkUp = (el: HTMLDivElement | null, delay: number) => {
      gsap.fromTo(el,
        { y: 0, x: 0, opacity: 0, scale: 0.2 },
        {
          y: -120,
          x: () => -10 + Math.random() * 20,
          opacity: () => 0.6 + Math.random() * 0.4,
          scale:   () => 0.05 + Math.random() * 0.25,
          duration: 1.6 + Math.random() * 2,
          repeat: -1, delay,
          ease: "power1.out",
        }
      );
    };

    const tl1 = flicker(glow1Ref.current, ground1Ref.current, 0);
    const tl2 = flicker(glow2Ref.current, ground2Ref.current, 0.4);
    sparkUp(spark1Ref.current, 0);
    sparkUp(spark2Ref.current, 1.2);

    return () => { tl1.kill(); tl2.kill(); };
  }, []);

  // Flame tip coordinates inside the PNG (tweak if image changes)
  // Left flame  ≈ 27% from left, 5% from top
  // Right flame ≈ 67% from left, 14% from top
  const L = { gx: "27%", gy: "5%",  sx: "22%", sy: "88%" };
  const R = { gx: "67%", gy: "14%", sx: "62%", sy: "90%" };

  return (
    <div
      className="hidden xl:block absolute pointer-events-none select-none parallax-candle"
      style={{
        left:   "-400px",
        bottom: "0",
        width:  "400px",
        zIndex: 20,
      }}
    >
      {/* ── Candle PNG ── */}
      <img
        src={twoCandlesImg}
        alt="Vintage Candles"
        style={{
          display:   "block",
          width:     "100%",
          height:    "auto",
          // Deep drop-shadow grounds the candle into the background
          filter:
            "drop-shadow(0 40px 60px rgba(0,0,0,0.90))" +
            " drop-shadow(0 10px 25px rgba(0,0,0,0.70))" +
            " drop-shadow(0  0  100px rgba(255,130,20,0.14))",
          position: "relative",
          zIndex: 3,
        }}
      />

      {/* ── LEFT flame glow ── */}
      <div ref={glow1Ref} style={{
        position:   "absolute",
        width:      "210px", height: "210px",
        left:       `calc(${L.gx} - 105px)`,
        top:        `calc(${L.gy} - 105px)`,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,210,90,0.80) 0%, rgba(255,145,35,0.38) 28%, rgba(255,90,10,0.12) 52%, transparent 72%)",
        filter:     "blur(24px)",
        zIndex:     4,
        transformOrigin: "center center",
        willChange: "opacity, transform",
      }} />

      {/* ── LEFT ground light pool (blends with dark floor of bg image) ── */}
      <div ref={ground1Ref} style={{
        position:   "absolute",
        width:      "160px", height: "40px",
        left:       `calc(${L.sx} - 80px)`,
        bottom:     "1px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,155,40,0.28) 0%, rgba(255,100,15,0.10) 45%, transparent 72%)",
        filter:     "blur(14px)",
        zIndex:     2,
        transformOrigin: "center bottom",
        willChange: "opacity, transform",
      }} />

      {/* ── LEFT spark ── */}
      <div ref={spark1Ref} style={{
        position:   "absolute",
        width: "6px", height: "6px",
        borderRadius: "50%",
        background: "rgba(255,235,130,1)",
        boxShadow:  "0 0 8px 4px rgba(255,210,60,0.75)",
        left: L.gx, top: L.gy,
        zIndex: 5,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }} />

      {/* ── RIGHT flame glow ── */}
      <div ref={glow2Ref} style={{
        position:   "absolute",
        width:      "175px", height: "175px",
        left:       `calc(${R.gx} - 87px)`,
        top:        `calc(${R.gy} - 87px)`,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,210,90,0.75) 0%, rgba(255,145,35,0.33) 28%, rgba(255,90,10,0.10) 52%, transparent 72%)",
        filter:     "blur(20px)",
        zIndex:     4,
        transformOrigin: "center center",
        willChange: "opacity, transform",
      }} />

      {/* ── RIGHT ground light pool ── */}
      <div ref={ground2Ref} style={{
        position:   "absolute",
        width:      "130px", height: "30px",
        left:       `calc(${R.sx} - 65px)`,
        bottom:     "1px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,155,40,0.24) 0%, rgba(255,100,15,0.08) 45%, transparent 72%)",
        filter:     "blur(12px)",
        zIndex:     2,
        transformOrigin: "center bottom",
        willChange: "opacity, transform",
      }} />

      {/* ── RIGHT spark ── */}
      <div ref={spark2Ref} style={{
        position:   "absolute",
        width: "5px", height: "5px",
        borderRadius: "50%",
        background: "rgba(255,235,130,1)",
        boxShadow:  "0 0 6px 3px rgba(255,210,60,0.70)",
        left: R.gx, top: R.gy,
        zIndex: 5,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }} />
    </div>
  );
};



const DeskClock = () => {
  const secondHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const hourHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update hands position in real-time matching the system local time
    const updateHands = () => {
      if (!secondHandRef.current || !minuteHandRef.current || !hourHandRef.current) return;
      const now = new Date();
      const secs = now.getSeconds();
      const mins = now.getMinutes() + secs / 60;
      const hrs = (now.getHours() % 12) + mins / 60;

      // Smooth ticking hands using GSAP
      gsap.to(secondHandRef.current, {
        rotation: secs * 6,
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.to(minuteHandRef.current, {
        rotation: mins * 6,
        duration: 0.5,
        ease: "power1.out"
      });
      gsap.to(hourHandRef.current, {
        rotation: hrs * 30,
        duration: 0.5,
        ease: "power1.out"
      });
    };

    updateHands();
    const interval = setInterval(updateHands, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:flex flex-col items-center absolute right-[-200px] bottom-[-10px] z-20 pointer-events-none select-none origin-bottom scale-90 lg:scale-100 parallax-clock">
      {/* Photo-realistic Clock Body PNG - 2x Larger (260px) */}
      <div className="relative w-[260px] h-[260px]">
        <img 
          src={realisticClock} 
          alt="Vintage Clock" 
          className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
        />

        {/* Center Pin container (exactly on the center hole of the dial) */}
        <div className="absolute left-[50%] top-[55.5%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-20">
          {/* Hour Hand */}
          <div 
            ref={hourHandRef}
            className="absolute w-[4.5px] h-[48px] bg-neutral-900 rounded-full origin-bottom"
            style={{ bottom: 0, left: "-2.25px", transformOrigin: "bottom center" }}
          />
          
          {/* Minute Hand */}
          <div 
            ref={minuteHandRef}
            className="absolute w-[3.2px] h-[68px] bg-neutral-800 rounded-full origin-bottom"
            style={{ bottom: 0, left: "-1.6px", transformOrigin: "bottom center" }}
          />

          {/* Second Hand */}
          <div 
            ref={secondHandRef}
            className="absolute w-[1.8px] h-[78px] bg-[#d32f2f] origin-bottom"
            style={{ bottom: "-16px", left: "-0.9px", transformOrigin: "center 62px" }}
          />

          {/* Brass Pin Center Cap */}
          <div className="absolute w-[9px] h-[9px] rounded-full bg-amber-500 border border-amber-700 -left-[4.5px] -top-[4.5px] z-30" />
        </div>
      </div>
    </div>
  );
};

const StopwatchBadge = ({ timeLeft }: { timeLeft: number }) => {
  const secs = timeLeft < 10 ? "0" + timeLeft : String(timeLeft);
  const formatted = "00:" + secs;
  return (
    <div className="relative flex flex-col items-center select-none origin-center shrink-0">
      {/* Winding knob and loops */}
      <div className="flex flex-col items-center -mb-0.5 relative z-0">
        <div className="w-5 h-2.5 border border-caramel-deep rounded-full bg-cream" />
        <div className="w-2 h-1 bg-caramel-deep -mt-0.5" />
      </div>

      {/* Watch Body */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-4 border-caramel-deep bg-[#fdfaf5] shadow-sm z-10">
        {/* Inner ticks */}
        <div className="absolute inset-1 rounded-full border border-dashed border-caramel/35 pointer-events-none" />
        
        {/* Digital countdown */}
        <span className="text-xs font-extrabold font-mono tracking-tight text-charcoal relative z-20">
          {formatted}
        </span>
      </div>
    </div>
  );
};

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

  // Dynamic document body background color injector (prevents white gap on Safari/Chrome overscroll)
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = "#0d0703";
    document.documentElement.style.backgroundColor = "#0d0703";
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
    };
  }, []);

  // Floating warm dust motes state
  const [dustMotes] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      size: 1.8 + Math.random() * 4,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
    }))
  );

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

  // Timer Heartbeat Pulse Effect (GSAP)
  useEffect(() => {
    if (step !== "quiz" || isLocked) return;
    const timerCircle = document.querySelector(".timer-badge");
    if (timerCircle) {
      const scaleVal = timeLeft <= 10 ? 1.15 : 1.08;
      const colorVal = timeLeft <= 10 ? "#e74c3c" : "#dca64b";
      gsap.fromTo(
        timerCircle,
        { scale: 1 },
        { 
          scale: scaleVal, 
          color: colorVal,
          duration: 0.25, 
          yoyo: true, 
          repeat: 1, 
          ease: "power1.out" 
        }
      );
    }
  }, [timeLeft, step, isLocked]);

  // Spring Card Slide-In & Hourglass Flip Effect on Question Change (GSAP)
  useEffect(() => {
    if (step !== "quiz") return;
    
    // Slide in the card
    gsap.fromTo(
      ".quiz-card",
      { x: 60, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.55, ease: "elastic.out(1, 0.78)" }
    );

    // Spin the hourglass 180 degrees
    gsap.to(".hourglass-container", {
      rotation: "+=180",
      duration: 0.85,
      ease: "back.out(1.4)"
    });
  }, [qIndex, step]);

  // ─── 3D Parallax Mouse Move Handler ──────────────────────────
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1280) return;

    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Normalised coordinates (-0.5 to 0.5)
    const normX = (clientX / width) - 0.5;
    const normY = (clientY / height) - 0.5;

    // Smoothly tilt only the card with rotation values (3D depth)
    gsap.to(".parallax-card", {
      rotationY: normX * 12,
      rotationX: -normY * 10,
      x: normX * 20,
      y: normY * 15,
      duration: 0.85,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    // Reset position smoothly
    gsap.to(".parallax-card", {
      rotationX: 0,
      rotationY: 0,
      x: 0,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    });
  };

  // ─── Ambient Light & Flickering Shadow Loop ──────────────────
  useEffect(() => {
    const card = document.querySelector(".parallax-card");
    const clock = document.querySelector(".parallax-clock");
    const bleed = document.querySelector(".parallax-glow");

    const shadowTl = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < 50; i++) {
      const dur = 0.04 + Math.random() * 0.08;
      const op = 0.5 + Math.random() * 0.5;
      
      // Flickering shadow offsets mimicking left candle light source
      const swayX = 14 + Math.random() * 8; // casts rightwards
      const swayY = 16 + Math.random() * 6;
      const blur = 28 + Math.random() * 12;

      shadowTl.to(card, {
        boxShadow: `${swayX}px ${swayY}px ${blur}px rgba(0,0,0,${op * 0.35})`,
        duration: dur,
        ease: "none"
      }, i * dur);

      if (clock) {
        const clockSwayX = 22 + Math.random() * 10;
        shadowTl.to(clock, {
          filter: `drop-shadow(${clockSwayX}px ${swayY}px ${blur - 6}px rgba(0,0,0,${op * 0.50}))`,
          duration: dur,
          ease: "none"
        }, i * dur);
      }

      if (bleed) {
        shadowTl.to(bleed, {
          opacity: 0.06 + op * 0.12,
          scale: 0.95 + op * 0.08,
          duration: dur,
          ease: "none"
        }, i * dur);
      }
    }

    return () => { shadowTl.kill(); };
  }, [step]);

  // ─── Dust Motes Drift Animation ─────────────────────────────
  useEffect(() => {
    const motes = document.querySelectorAll(".dust-mote");
    motes.forEach((mote) => {
      gsap.to(mote, {
        y: () => -180 - Math.random() * 220,
        x: () => -25 + Math.random() * 50,
        keyframes: [
          { opacity: 0, duration: 0 },
          { opacity: 0.45, duration: 0.5 },
          { opacity: 0, duration: 0.5 }
        ],
        duration: 9 + Math.random() * 13,
        repeat: -1,
        ease: "sine.inOut",
        delay: -Math.random() * 10
      });
    });
  }, []);

  // Liquid Progress Bar Effect (GSAP)
  useEffect(() => {
    if (step !== "quiz" || !activeQuestions.length) return;
    const pct = ((qIndex + 1) / activeQuestions.length) * 100;
    gsap.to(".quiz-progress-bar", {
      width: `${pct}%`,
      duration: 0.65,
      ease: "power2.out"
    });
  }, [qIndex, step, activeQuestions]);

  // Confetti Particle Explosion on Result Screen (GSAP)
  useEffect(() => {
    if (step === "result") {
      const timer = setTimeout(() => {
        triggerConfetti();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const triggerConfetti = () => {
    const container = document.querySelector(".confetti-container");
    if (!container) return;

    container.innerHTML = "";
    const colors = ["#dca64b", "#b08130", "#3bb273", "#1d8a4e", "#f39c12", "#e74c3c"];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement("div");
      p.className = "absolute w-2 h-2 rounded-sm pointer-events-none";
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = "50%";
      p.style.top = "40%";
      container.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 150 + Math.random() * 260;
      const xDest = Math.cos(angle) * velocity;
      const yDest = Math.sin(angle) * velocity - (60 + Math.random() * 120);

      // Launch outwards
      gsap.to(p, {
        x: xDest,
        y: yDest,
        rotation: Math.random() * 720,
        duration: 0.7 + Math.random() * 0.7,
        ease: "power2.out",
        onComplete: () => {
          // Fall down under gravity
          gsap.to(p, {
            y: yDest + 450,
            opacity: 0,
            duration: 1.0 + Math.random() * 1.5,
            ease: "power1.in",
            onComplete: () => p.remove()
          });
        }
      });
    }
  };

  const generateQuiz = () => {
    const levels: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const chosenQuestions: Question[] = [];

    levels.forEach((lvl) => {
      const levelPool = QUESTION_POOL.filter((q) => q.level === lvl);
      const shuffled = [...levelPool].sort(() => 0.5 - Math.random());
      chosenQuestions.push(shuffled[0], shuffled[1]);
    });

    // Shuffling the chosen questions and dynamically randomizing answer positions (A, B, C, D)
    const randomizedQuestions = chosenQuestions
      .sort(() => 0.5 - Math.random())
      .map((q) => {
        // Generate a random mapping of original indices [0, 1, 2, 3]
        const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        return {
          ...q,
          options: {
            uz: indices.map((idx) => q.options.uz[idx]),
            ru: indices.map((idx) => q.options.ru[idx]),
            en: indices.map((idx) => q.options.en[idx]),
          },
          // Original correct answer was always index 0. Find where 0 went.
          correctIndex: indices.indexOf(0),
        };
      });

    setActiveQuestions(randomizedQuestions);
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

    // Slide out the card to the left smoothly before setting the next question
    gsap.to(".quiz-card", {
      x: -45,
      opacity: 0,
      scale: 0.95,
      delay: 0.75,
      duration: 0.35,
      ease: "power2.in"
    });

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
    }, 1100);
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
      ? "Siz ingliz tilini ona tili darajasida bilasiz. Akademik ingliz tili yoki IELTS 8.0+ kurslarimiz sizga mos."
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
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen text-charcoal py-12 px-4 sm:px-6 relative flex flex-col items-center justify-start"
      style={{
        backgroundColor: "#0d0703", // prevents white flashes during image load
        backgroundImage: `linear-gradient(to bottom right, rgba(20,12,6,0.84), rgba(35,22,12,0.80), rgba(15,8,4,0.88)), url(${libraryDeskBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        perspective: "1200px" // critical for true 3d CSS transforms
      }}
    >
      {/* Global Ambient light bleed from left candle */}
      <div 
        className="parallax-glow absolute top-1/4 left-[-10%] w-[850px] h-[850px] rounded-full pointer-events-none z-10" 
        style={{
          background: "radial-gradient(circle, rgba(255,155,25,0.18) 0%, rgba(255,100,10,0.06) 42%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />

      {/* Floating dust motes layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {dustMotes.map((mote) => (
          <div
            key={mote.id}
            className="dust-mote absolute rounded-full bg-amber-300/40"
            style={{
              width: mote.size,
              height: mote.size,
              left: mote.left,
              top: mote.top,
              boxShadow: "0 0 6px 2px rgba(255,180,60,0.12)",
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Dynamic confetti celebration container */}
      <div className="confetti-container absolute inset-0 pointer-events-none z-50 overflow-hidden" />

      {/* Background blobs (soft warmth) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Main unified workspace container: anchors left and right desk elements relative to the card */}
      <div className="relative flex items-end justify-center w-full max-w-2xl mx-auto my-auto">
        
        {/* Single Candle on the Left */}
        <Candle />

        {/* Parchment Card */}
        <div 
          className="parallax-card w-full max-w-2xl relative z-10 p-10 pb-12 sm:p-14 sm:pb-16 min-h-[520px]"
          style={{
            backgroundImage: `url(${tornPaper})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundColor: "transparent",
            transformStyle: "preserve-3d",
          }}
        >
          
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
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-caramel/10 text-caramel-deep mb-6 animate-pulse">
                <Award size={32} />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal mb-4">
                {t("levelTestTitle")}
              </h1>
              <p className="text-base text-charcoal-soft leading-relaxed max-w-lg mx-auto mb-8 font-medium">
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

                {/* Animated Stopwatch Timer */}
                <StopwatchBadge timeLeft={timeLeft} />
              </div>

              {/* Liquid progress bar */}
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden mb-6">
                <div 
                  className="quiz-progress-bar h-full bg-gradient-to-r from-caramel to-caramel-deep"
                  style={{ width: "0%" }}
                />
              </div>

            {/* Animated Quiz Card (Text & Options) */}
            <div className="quiz-card">
              {/* Question Text */}
              <div className="bg-cream-soft rounded-2xl p-5 border border-black/5 mb-6 flex items-start gap-3 shadow-sm">
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
                      iconEl = <Check size={16} className="text-emerald-600 shrink-0 animate-bounce" />;
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
                      className={`w-full text-left border rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-200 shadow-soft flex items-center justify-between group hover:-translate-y-0.5 active:scale-95 ${btnStyle} ${animClass}`}
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

        </div> {/* Closes Parchment Card */}

        {/* Flanking Desk Clock on the Right */}
        {step !== "success" && (
          <DeskClock />
        )}
      </div>
    </div>
  );
}
