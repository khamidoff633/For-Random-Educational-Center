/**
 * Gemini AI integration.
 *
 *  - generateText: writes course descriptions and teacher bios.
 *  - generateStudyPlan: builds a personalised 30-day study plan.
 *  - runCopilot: a natural-language admin assistant that can both answer
 *    questions about the panel AND perform data changes via safe, typed
 *    actions applied through the repository.
 *
 * The model name comes from config (default: gemini-2.5-flash). The previous
 * code referenced a non-existent "gemini-3.5-flash" model, which is fixed here.
 */
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { getRepository } from "../db";
import { createId } from "../utils/id";
import type { Course, Lead, Teacher } from "../models/types";

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "GEMINI_API_KEY sozlanmagan. Iltimos, server .env faylida API kalitini o'rnating."
    );
    this.name = "AiNotConfiguredError";
  }
}

function getClient(): GoogleGenAI {
  const key = env.gemini.apiKey;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new AiNotConfiguredError();
  }
  return new GoogleGenAI({ apiKey: key });
}

async function generate(prompt: string, systemInstruction?: string, json = false): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: env.gemini.model,
    contents: prompt,
    config: {
      ...(systemInstruction ? { systemInstruction } : {}),
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  });
  return response.text?.trim() ?? "";
}

// ---- Content generation --------------------------------------------------
export async function generateText(
  type: "course" | "teacher",
  name: string,
  context?: string
): Promise<string> {
  if (type === "course") {
    return generate(
      `Siz professional o'quv markazining kurs muallifisiz. "${name}" nomli kurs uchun ` +
        `o'quvchilarni jalb qiladigan, o'zbek tilida, 2-4 jumlali professional ta'rif yozing. ` +
        `Qo'shimcha ma'lumot: "${context || "yo'q"}". Faqat ta'rif matnini qaytaring, ortiqcha belgilarsiz.`
    );
  }
  return generate(
    `Siz nufuzli o'quv markazining matn muallifisiz. "${name}" ismli o'qituvchi uchun ` +
      `jozibali, professional 2-4 jumlali tarjimai hol (bio) yozing. Kalit ma'lumotlar: "${context || "yo'q"}". ` +
      `Har safar o'ziga xos uslubda yozing. Faqat bio matnini qaytaring, ortiqcha belgilarsiz.`
  );
}

export async function generateStudyPlan(
  name: string,
  currentLevel: string,
  targetGoal: string
): Promise<string> {
  return generate(
    `Siz tajribali ingliz tili metodistisiz. Talaba: "${name || "Hurmatli talaba"}", ` +
      `joriy daraja: "${currentLevel}", maqsad: "${targetGoal}". ` +
      `Ushbu talaba uchun 30 kunlik shaxsiy o'quv rejasini o'zbek tilida tuzing. ` +
      `Reja Markdown formatida, haftalik bloklarga bo'lingan, sarlavhalar va qalin matnlar bilan bo'lsin. ` +
      `Quyidagilar bo'lsin: 1) darajaning qisqa tahlili, 2) 30 kunlik haftalik reja, 3) imtihon uchun tavsiyalar. ` +
      `Faqat reja matnini qaytaring.`
  );
}

// ---- Admin copilot -------------------------------------------------------
interface CopilotAction {
  type: string;
  payload: Record<string, unknown>;
}

interface CopilotResult {
  reply: string;
  actions: CopilotAction[];
  dbModified: boolean;
}

function buildCopilotSystemInstruction(): string {
  return `Siz "Apex Academy" o'quv markazi boshqaruv panelining AI yordamchisiz.
Vazifangiz ikki xil:
1) ADMINGA YORDAM: panel qanday ishlashi, bo'limlar (Boshqaruv paneli, Sozlamalar, Kurslar, O'qituvchilar, Arizalar, O'quvchilar natijalari) va funksiyalar haqida o'zbek tilida sodda tushuntirib berish.
2) MA'LUMOTLARNI BOSHQARISH: foydalanuvchi buyrug'iga ko'ra kurs/o'qituvchi qo'shish, tahrirlash, o'chirish yoki ariza holatini yangilash.

Javobni QAT'IY JSON formatida qaytaring (markdown yoki \`\`\` belgilarisiz):
{ "reply": "o'zbek tilidagi do'stona javob", "actions": [ ... ] }

Agar faqat savol berilsa, "actions" bo'sh bo'lsin: [].
Ruxsat etilgan action turlari:
- { "type": "UPDATE_SETTINGS", "payload": { "name": "...", "phone": "...", "email": "...", "address": "...", "aboutText": "...", "heroTitle": "...", "heroSubtitle": "..." } }
- { "type": "ADD_COURSE", "payload": { "name": "...", "category": "English|IT|Matematika|Kids", "description": "...", "duration": "...", "price": "...", "teacherId": "...", "days": "...", "time": "...", "capacity": 12 } }
- { "type": "UPDATE_COURSE", "payload": { "id": "...", ...o'zgartiriladigan maydonlar } }
- { "type": "DELETE_COURSE", "payload": { "id": "..." } }
- { "type": "ADD_TEACHER", "payload": { "name": "...", "specialty": "...", "bio": "...", "experience": "...", "phone": "...", "gender": "erkak|ayol" } }
- { "type": "UPDATE_TEACHER", "payload": { "id": "...", ... } }
- { "type": "DELETE_TEACHER", "payload": { "id": "..." } }
- { "type": "UPDATE_LEAD", "payload": { "id": "...", "status": "yangi|boglanildi|royxatga_otdi", "notes": "..." } }
- { "type": "DELETE_LEAD", "payload": { "id": "..." } }`;
}

async function applyAction(action: CopilotAction): Promise<boolean> {
  const repo = getRepository();
  const p = action.payload as Record<string, any>;
  switch (action.type) {
    case "UPDATE_SETTINGS":
      await repo.updateSettings(p);
      return true;
    case "ADD_COURSE":
      await repo.createCourse({
        id: createId("c"),
        name: p.name || "Yangi kurs",
        category: p.category || "English",
        description: p.description || "",
        duration: p.duration || "3 oy",
        price: p.price || "Kelishilgan",
        teacherId: p.teacherId || "",
        days: p.days || "Dush - Chor - Jum",
        time: p.time || "15:00 - 17:00",
        image: p.image || "",
        capacity: Number(p.capacity) || 12,
      } as Course);
      return true;
    case "UPDATE_COURSE":
      return Boolean(p.id && (await repo.updateCourse(p.id, p)));
    case "DELETE_COURSE":
      return Boolean(p.id && (await repo.deleteCourse(p.id)));
    case "ADD_TEACHER":
      await repo.createTeacher({
        id: createId("t"),
        name: p.name || "Yangi o'qituvchi",
        specialty: p.specialty || "O'qituvchi",
        slogan: p.slogan || "",
        bio: p.bio || "",
        image: p.image || "",
        experience: p.experience || "Yangi",
        phone: p.phone || "",
        gender: p.gender || "erkak",
      } as Teacher);
      return true;
    case "UPDATE_TEACHER":
      return Boolean(p.id && (await repo.updateTeacher(p.id, p)));
    case "DELETE_TEACHER":
      return Boolean(p.id && (await repo.deleteTeacher(p.id)));
    case "UPDATE_LEAD":
      return Boolean(p.id && (await repo.updateLead(p.id, p as Partial<Lead>)));
    case "DELETE_LEAD":
      return Boolean(p.id && (await repo.deleteLead(p.id)));
    default:
      return false;
  }
}

export async function runCopilot(message: string): Promise<CopilotResult> {
  const repo = getRepository();
  const [settings, courses, teachers, leads] = await Promise.all([
    repo.getSettings(),
    repo.listCourses(),
    repo.listTeachers(),
    repo.listLeads(),
  ]);

  // Optimize snapshot payload to reduce token count (remove images and heavy data strings)
  const cleanSettings = {
    name: settings.name,
    logoText: settings.logoText,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    aboutText: settings.aboutText,
  };

  const cleanCourses = courses.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    duration: c.duration,
    price: c.price,
    teacherId: c.teacherId,
    days: c.days,
    time: c.time,
    capacity: c.capacity,
  }));

  const cleanTeachers = teachers.map((t) => ({
    id: t.id,
    name: t.name,
    specialty: t.specialty,
    experience: t.experience,
    phone: t.phone,
    gender: t.gender,
    bio: t.bio,
  }));

  const cleanLeads = leads.map((l) => ({
    id: l.id,
    studentName: l.studentName,
    phone: l.phone,
    courseId: l.courseId,
    status: l.status,
    notes: l.notes,
    createdAt: l.createdAt,
  }));

  const snapshot = JSON.stringify(
    {
      settings: cleanSettings,
      courses: cleanCourses,
      teachers: cleanTeachers,
      leads: cleanLeads,
    },
    null,
    2
  );

  const prompt = `Joriy ma'lumotlar:\n${snapshot}\n\nFoydalanuvchi buyrug'i / savoli: "${message}"\n\nFaqat JSON qaytaring.`;

  const raw = await generate(prompt, buildCopilotSystemInstruction(), true);
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  let parsed: { reply?: string; actions?: CopilotAction[] };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { reply: raw || "Javobni qayta ishlashda muammo yuz berdi.", actions: [], dbModified: false };
  }

  let dbModified = false;
  const applied: CopilotAction[] = [];
  for (const action of parsed.actions ?? []) {
    if (!action?.type || !action?.payload) continue;
    if (await applyAction(action)) {
      dbModified = true;
      applied.push(action);
    }
  }

  return {
    reply: parsed.reply || "Buyruq bajarildi.",
    actions: applied,
    dbModified,
  };
}
