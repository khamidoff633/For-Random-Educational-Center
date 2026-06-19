import React, { useState, useEffect } from "react";
import { Teacher } from "../types";
import { Award, Phone, Users, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { dTrans, Language } from "../lib/translate";

interface TeacherCardProps {
  teacher: Teacher;
  lang: Language;
}

export default function TeacherCard({ teacher, lang }: TeacherCardProps) {
  const defaultMaleAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop";
  const defaultFemaleAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop";
  
  const fallbackUrl = teacher.gender === "ayol" ? defaultFemaleAvatar : defaultMaleAvatar;
  const initialUrl = (teacher.image && teacher.image.trim() !== "") ? teacher.image : fallbackUrl;
  
  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [imgError, setImgError] = useState(false);

  // Sync state if teacher prop changes
  useEffect(() => {
    const freshFallbackUrl = teacher.gender === "ayol" ? defaultFemaleAvatar : defaultMaleAvatar;
    setImgSrc((teacher.image && teacher.image.trim() !== "") ? teacher.image : freshFallbackUrl);
    setImgError(false);
  }, [teacher.image, teacher.gender]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] min-h-[460px]"
    >
      {/* Faculty Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden">
        {/* Skeleton placeholder during load */}
        <div className="absolute inset-0 bg-zinc-900 animate-pulse -z-10" />
        
        {imgError ? (
          <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
            <span className="text-3xl font-bold uppercase tracking-widest text-zinc-200">★ {teacher.name.charAt(0)} ★</span>
            <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{dTrans(teacher.specialty, lang)}</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            id={`teacher_img_${teacher.id}`}
            alt={teacher.name}
            onError={() => {
              if (imgSrc === fallbackUrl) {
                setImgError(true);
              } else {
                setImgSrc(fallbackUrl);
              }
            }}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103 z-0"
          />
        )}
        
        {/* Minimal elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Experience badge */}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white border border-zinc-800 flex items-center gap-1">
          <Award size={10} className="text-zinc-300" />
          <span>{dTrans(teacher.experience, lang)} {dTrans("Tajriba", lang)}</span>
        </div>

        {/* Verification Tag */}
        <div className="absolute bottom-4 left-4 z-10 bg-white text-zinc-950 px-2.5 py-1 rounded text-[8px] font-bold uppercase tracking-wider font-mono flex items-center gap-1 shadow">
          <Sparkles size={8} />
          <span>{dTrans("Verified Academic Mentor", lang)}</span>
        </div>
      </div>

      {/* Biography and Contact details */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-transparent rounded-b-2xl relative z-25">
        <div className="space-y-3.5">
          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-zinc-300 bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-md">
            {dTrans(teacher.specialty, lang)}
          </span>
          
          <h4 className="font-sans text-lg font-bold text-white transition-colors leading-tight">
            {teacher.name}
          </h4>
          
          {teacher.slogan && (
            <p className="text-[11px] italic text-zinc-400 bg-zinc-800/30 border-l border-zinc-400 px-2.5 py-1">
              "{teacher.slogan}"
            </p>
          )}
          
          <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3">
            {dTrans(teacher.bio, lang) || dTrans("Bizning o'quv markazimizning oliy ta'lim darajali, xalqaro imtihon ko'nikmalariga ega bo'lgan tajribali mutaxassisi.", lang)}
          </p>
        </div>

        {teacher.phone && (
          <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-zinc-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
              <Phone size={11} className="text-zinc-400" />
              <span>{teacher.phone}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-zinc-400 font-sans font-medium text-[10px] uppercase tracking-wider">
              <Users size={11} className="text-zinc-500" />
              <span>{dTrans("Senior Mentor", lang)}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
