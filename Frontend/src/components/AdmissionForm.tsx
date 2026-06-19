import React, { useState } from "react";
import { X, Send, CheckCircle, Phone, User, BookOpen, MessageSquare } from "lucide-react";
import { Course } from "../types";

interface AdmissionFormProps {
  courses: Course[];
  selectedCourseId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdmissionForm({ courses, selectedCourseId = "", onClose, onSuccess }: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    courseId: selectedCourseId || (courses.length > 0 ? courses[0].id : ""),
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.phone.trim()) {
      setError("Ism va telefon raqamini kiritish majburiy.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "yangi"
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ariza yuborishda xatolik yuz berdi");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi. Keyinroq qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all">
        {/* Banner with Sleek Dark and Silver Styling */}
        <div className="bg-zinc-950 border-b border-zinc-850 px-8 py-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 bg-zinc-800 border border-zinc-750 px-3 py-1 rounded-full inline-block mb-3">
            ★ APEX ACADEMY ADMISSION ★
          </span>
          <h3 className="font-sans font-bold text-2xl tracking-tight leading-none text-white">
            Guruhga O'rin Band Qilish
          </h3>
          <p className="text-zinc-400 text-xs mt-2 max-w-xs mx-auto leading-normal">
            Professional ustozlar darslariga birinchilardan bo'lib yoziling! Bepul sinov darsi taqdim etiladi.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center rounded-full bg-zinc-800 p-4 text-white border border-zinc-700 animate-pulse-ring">
                <CheckCircle size={44} className="text-white" />
              </div>
              <div>
                <h4 className="font-sans text-xl font-bold text-white">Arizangiz Qabul Qilindi!</h4>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
                  Mutaxassislarimiz 10 daqiqa ichida siz bilan bog'lanib, eng qulay bepul sinov darsi jadvalini taklif etishadi. Qaynoq kutib qoling!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-900/30 rounded-xl">
                  {error}
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                  Ismingiz va Familiyangiz
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardor Alimov"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-zinc-500 font-medium placeholder:text-zinc-650"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                  Telefon Raqamingiz
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Masalan: +998 (90) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-zinc-500 font-medium placeholder:text-zinc-650"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                  Sizni qiziqtirgan dars / yo'nalish
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                    <BookOpen size={15} />
                  </div>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-zinc-500 appearance-none font-semibold"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-zinc-950 text-white">
                        {course.name} ({course.duration})
                      </option>
                    ))}
                    <option value="boshqa" className="bg-zinc-950 text-white font-medium">Boshqa yo'nalishlar / Konsultatsiya</option>
                  </select>
                </div>
              </div>

              {/* Extra notes */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                  Qo'shimcha savollar yoki istaklar (Ixtiyoriy)
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Dars vaqtlari yoki maqsadlaringiz haqida yozishingiz mumkin..."
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white outline-none transition-all focus:border-zinc-500 resize-none font-medium placeholder:text-zinc-650"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full py-4 text-sm font-bold transition-all cursor-pointer hover:scale-[1.01]"
              >
                {loading ? (
                  "Yuborilmoqda..."
                ) : (
                  <>
                    <span>Arizani Tasdiqlash</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
