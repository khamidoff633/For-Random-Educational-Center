import React, { useState, useEffect } from "react";
import { Course, Teacher } from "../types";
import { Calendar, Clock, GraduationCap, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { dTrans, Language } from "../lib/translate";

interface CourseCardProps {
  course: Course;
  teachers: Teacher[];
  onEnroll: (courseId: string) => void;
  lang: Language;
}

export default function CourseCard({ course, teachers, onEnroll, lang }: CourseCardProps) {
  // Find teacher name from list
  const teacher = teachers.find(t => t.id === course.teacherId);
  
  const defaultBanner = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop";
  const initialUrl = course.image || defaultBanner;
  
  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [courseImgError, setCourseImgError] = useState(false);

  useEffect(() => {
    setImgSrc(course.image || defaultBanner);
    setCourseImgError(false);
  }, [course.image]);

  // Determine a level badge text in the chosen language
  const getSubBadge = (category: string, name: string, currentLang: Language) => {
    const isIELTS = name.toLowerCase().includes("ielts");
    const isSAT = name.toLowerCase().includes("sat");
    const isIT = category.toLowerCase().includes("it") || name.toLowerCase().includes("web");
    
    if (isIELTS) {
      return { 
        text: currentLang === "en" ? "IELTS Exam Track" : currentLang === "ru" ? "Траектория IELTS" : "IELTS Imtihon Guruhi", 
        color: "bg-zinc-800/80 border-zinc-700/80 text-zinc-200" 
      };
    } else if (isSAT) {
      return { 
        text: currentLang === "en" ? "SAT Math Prep" : currentLang === "ru" ? "Подготовка к SAT Math" : "SAT Matematika Kursi", 
        color: "bg-zinc-800/80 border-zinc-700/80 text-zinc-200" 
      };
    } else if (isIT) {
      return { 
        text: currentLang === "en" ? "IT Academy" : currentLang === "ru" ? "Академия IT" : "IT Akademiyasi", 
        color: "bg-zinc-800/80 border-zinc-700/80 text-zinc-200" 
      };
    } else {
      return { 
        text: currentLang === "en" ? "CEFR Alignment" : currentLang === "ru" ? "Соответствие CEFR" : "CEFR Standarti", 
        color: "bg-zinc-800/80 border-zinc-700/80 text-zinc-200" 
      };
    }
  };

  const badge = getSubBadge(course.category, course.name, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] min-h-[460px]"
    >
      {/* Course Banner Video or Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80 z-10" />
        
        {courseImgError ? (
          <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 flex flex-col justify-between text-white z-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 font-mono">
              ★ {dTrans(course.category, lang)}
            </span>
            <div>
              <h5 className="text-base font-bold tracking-tight line-clamp-1 text-white">{dTrans(course.name, lang)}</h5>
              <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 font-sans">
                {dTrans(course.duration, lang)}
              </p>
            </div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
              APEX PREMIUM COURSE
            </div>
          </div>
        ) : (
          <img
            src={imgSrc}
            id={`course_img_${course.id}`}
            alt={course.name}
            onError={() => {
              if (imgSrc === defaultBanner) {
                setCourseImgError(true);
              } else {
                setImgSrc(defaultBanner);
              }
            }}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103 z-0"
          />
        )}
        
        {/* Floating Category Badges */}
        <div className="absolute top-4 left-4 z-20 rounded-lg bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white border border-zinc-800 flex items-center gap-1.5 shadow-md">
          <BookOpen size={10} className="text-zinc-300" />
          <span>{dTrans(course.category, lang)}</span>
        </div>

        {/* Academic Premium stamp */}
        <div className="absolute top-4 right-4 z-20 rounded-lg bg-white backdrop-blur-xs px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-zinc-950 shadow-md flex items-center gap-1">
          <Sparkles size={8} />
          <span>{lang === "en" ? "Intensive" : lang === "ru" ? "Интенсив" : "Intensiv"}</span>
        </div>

        {/* Course duration badge */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-zinc-950/80 px-3 py-1.5 text-[11px] font-bold text-white border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
          <Clock size={11} className="text-zinc-300" />
          <span>{dTrans(course.duration, lang)}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-transparent rounded-b-2xl relative z-25">
        <div className="space-y-4">
          <div>
            <div className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-2 ${badge.color}`}>
              {badge.text}
            </div>
            
            <h4 className="font-sans text-lg font-bold text-white transition-colors line-clamp-1 leading-tight tracking-tight">
              {dTrans(course.name, lang)}
            </h4>
            
            <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {dTrans(course.description, lang) || dTrans("Ushbu nufuzli akademiya darsi talabalarga xalqaro standart darajasidagi ko'nikmalarni amaliy darslar yordamida kafolatli o'rgatadi.", lang)}
            </p>
          </div>

          {/* Key Schedule Grid */}
          <div className="grid grid-cols-1 gap-2 border-t border-b border-zinc-800/60 py-3.5 text-xs font-sans">
            {/* Days indicator */}
            <div className="flex items-center gap-2.5">
              <Calendar size={12} className="text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-200 truncate">{dTrans(course.days, lang)}</span>
            </div>

            {/* Hours indicator */}
            <div className="flex items-center gap-2.5">
              <Clock size={12} className="text-zinc-500 shrink-0" />
              <span className="text-zinc-300 font-medium">{course.time}</span>
            </div>

            {/* Teacher mentor lookup */}
            <div className="flex items-center gap-2.5">
              <GraduationCap size={12} className="text-zinc-400 shrink-0" />
              <span className="truncate text-zinc-300 text-xs font-semibold">
                {lang === "en" ? "Mentor:" : lang === "ru" ? "Куратор:" : "Ustoz:"} <strong className="text-white font-bold">{teacher ? teacher.name : "Senior Coach"}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Price and CTA footer */}
        <div className="mt-5 pt-1.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest font-mono">
              {dTrans("O'quv kursi to'lovi", lang)}
            </span>
            <span className="text-base font-bold text-white tracking-tight">
              {dTrans(course.price, lang)}
            </span>
          </div>

          <button
            onClick={() => onEnroll(course.id)}
            className="flex items-center gap-1 px-4.5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full text-xs font-bold transition-all hover:scale-102 active:scale-98 shadow-md cursor-pointer"
          >
            <span>{dTrans("Ro'yxatdan o'tish", lang)}</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
