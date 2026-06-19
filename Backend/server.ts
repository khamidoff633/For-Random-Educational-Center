import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SchoolSettings, Course, Teacher, Lead, StudentResultItem } from "../Frontend/src/types";

// Helper to dynamically get or initialize active GoogleGenAI Client using current GEMINI_API_KEY
function getAIClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === "MY_GEMINI_API_KEY" || currentKey.trim() === "") {
    console.warn("Google GenAI API Key is missing, empty or an invalid dummy value.");
    return null;
  }
  try {
    return new GoogleGenAI({ 
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (error) {
    console.error("Dynamic initialization of Gemini client failed:", error);
    return null;
  }
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Path to JSON Database
const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Default Database State
const DEFAULT_DB = {
  settings: {
    name: "Apex Academy",
    logoText: "APEX Academy",
    heroTitle: "Kelajagingizni Biz Bilan Birga Quring",
    heroSubtitle: "Eng yuqori natijali Ingliz tili va axborot texnologiyalari kurslari. Malakali ustozlar va zamonaviy o'quv muhiti.",
    heroBgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    heroVideoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c05cba307b26d02f83d944e1e07b78a9&profile_id=139&oauth2_token_id=57447761",
    heroMediaType: "video",
    phone: "+998 (90) 123-4567",
    email: "info@apexacademy.uz",
    address: "Toshkent shahri, Chilonzor tumani, 9-kvartal, 14-uy",
    mapsUrl: "https://maps.google.com",
    telegram: "https://t.me/apex_academy",
    instagram: "https://instagram.com/apex_academy",
    facebook: "https://facebook.com/apex_academy",
    youtube: "https://youtube.com",
    aboutText: "Bizning o'quv markazimiz 2021-yilda tashkil etilgan bo'lib, shu kunga qadar 5000 dan ortiq o'quvchilarga ingliz tili, matematika va dasturlash yo'nalishlarida muvaffaqiyatli ta'lim berib kelmoqda. Bizning maqsadimiz — har bir o'quvchining ichki salohiyatini ochish va ularni global muvaffaqiyatlarga tayyorlashdir.",
    features: [
      {
        id: "feat1",
        title: "Tajribali O'qituvchilar",
        desc: "IELTS 8.5+ ballga ega bo'lgan va xalqaro sertifikatlarga ega professional ustozlar jamoasi.",
        icon: "GraduationCap"
      },
      {
        id: "feat2",
        title: "Zamonaviy Jihozlar",
        desc: "Har bir dars xonasida interaktiv doskalar, noutbuklar va eng so'nggi audio tizimlar mavjud.",
        icon: "Laptop"
      },
      {
        id: "feat3",
        title: "Guruhlardagi Kichiklik",
        desc: "Dars guruhlarida maksimal 10-12 nafar o'quvchi bo'lib, individual yondashuv to'liq ta'minlanadi.",
        icon: "Users"
      },
      {
        id: "feat4",
        title: "Doimiy Monitoring",
        desc: "Ota-onalar uchun haftalik test hisobotlari va qatnashuv natijalarini onlayn baholash paneli.",
        icon: "TrendingUp"
      }
    ]
  } as SchoolSettings,
  teachers: [
    {
      id: "t1",
      name: "Abdurahmon Rasulov",
      specialty: "Senior English Instructor & IELTS Coach",
      bio: "Toshkent Davlat Jahon Tillari Universitetini tamomlagan. IELTS 8.5 sohibi. 6 yillik xalqaro miqyosdagi IELTS o'qitish tajribasiga ega.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      experience: "6 yil",
      phone: "+998 90 999-8877",
      gender: "erkak"
    },
    {
      id: "t2",
      name: "Rayhona Malikova",
      specialty: "General English & Kids Expert",
      bio: "Bolalar va kattalarga ingliz tilini interaktiv va kreativ o'yinlar yordamida o'rgatish bo'yicha mutaxassis. Xalqaro CELTA sertifikati sohibasi.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
      experience: "4 yil",
      phone: "+998 93 111-2233",
      gender: "ayol"
    },
    {
      id: "t3",
      name: "Sardorbek Tursunov",
      specialty: "Web Development Specialist",
      bio: "Full-stack dasturchi, EPAM kompaniyasi sobiq senior muhandisi. Scratch, HTML/CSS va JavaScript bo'yicha yuqori reytingli darslar olib boradi.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      experience: "5 yil",
      phone: "+998 94 444-5566",
      gender: "erkak"
    }
  ] as Teacher[],
  courses: [
    {
      id: "c1",
      name: "Intensive IELTS (8.0+)",
      category: "English",
      description: "IELTS imtihoniga mukammal va tezkor tayyorlov kursi. Kurs davomida har haftalik yozma baholashlar va shaxsiy feedback taqdim etiladi.",
      duration: "3 oy",
      price: "550 000 so'm / oy",
      teacherId: "t1",
      days: "Dush - Chor - Jum",
      time: "15:00 - 17:00",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
      capacity: 12
    },
    {
      id: "c2",
      name: "General English (Pre-Intermediate)",
      category: "English",
      description: "Ingliz tilida erkin gapirish hamda grammatikani chuqur va bexato o'zlashtirish uchun mo'ljallangan intensiv amaliy darslar guruhi.",
      duration: "6 oy",
      price: "450 000 so'm / oy",
      teacherId: "t2",
      days: "Sesh - Pay - Shan",
      time: "10:00 - 12:00",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
      capacity: 15
    },
    {
      id: "c3",
      name: "Web Frontend Dasturlash",
      category: "IT",
      description: "Noldan boshlab professional dasturchi bo'ling. HTML, CSS, JavaScript va React zamonaviy texnologiyalarni amaliy loyihalar orqali o'rganing.",
      duration: "8 oy",
      price: "700 000 so'm / oy",
      teacherId: "t3",
      days: "Dush - Chor - Jum",
      time: "18:30 - 20:30",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop",
      capacity: 10
    }
  ] as Course[],
  leads: [
    {
      id: "l1",
      studentName: "Shohruh Mirzayev",
      phone: "+998 (90) 123-4567",
      courseId: "c1",
      status: "yangi",
      notes: "Telegram sahifamizdan yozdi. IELTS ballini 6 burchakdan 8.0 gacha oshirishni maqsad qilgan.",
      createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
    },
    {
      id: "l2",
      studentName: "Madina Alimova",
      phone: "+998 (93) 456-7890",
      courseId: "c2",
      status: "suhbatda",
      notes: "Darslarni tushdan keyingi soat 16:00 guruhiga so'rayapti. Sinov darsi belgilandi.",
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: "l3",
      studentName: "Eldor Tursunov",
      phone: "+998 (99) 777-5533",
      courseId: "c3",
      status: "oqiyapti",
      notes: "Suhbatdan o'tdi, to'lovni 100% amalga oshirdi. Dushanba kungi birinchi darsga qo'shildi.",
      createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
    }
  ] as Lead[],
  studentResults: [
    {
      id: "sr1",
      studentName: "Doston Yo'ldoshev",
      score: "8.5",
      examType: "IELTS",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      courseName: "Intensive IELTS (8.0+)",
      achievementDate: "2026-02-15"
    },
    {
      id: "sr2",
      studentName: "Olimjon Karimov",
      score: "1540",
      examType: "SAT",
      image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=300&auto=format&fit=crop",
      courseName: "SAT Mathematics",
      achievementDate: "2026-03-10"
    },
    {
      id: "sr3",
      studentName: "Zilola Ergasheva",
      score: "C1",
      examType: "CEFR",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      courseName: "General English (Pre-Intermediate)",
      achievementDate: "2026-01-22"
    },
    {
      id: "sr4",
      studentName: "Ahmadxo'ja No'monov",
      score: "94/100",
      examType: "Dasturlash",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      courseName: "Web Frontend Dasturlash",
      achievementDate: "2025-11-05"
    }
  ] as StudentResultItem[]
};

// Help helper for reading data
function getDatabase() {
  try {
    const parentDir = path.dirname(DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    
    // Auto-migration for missing schemas
    let structuralChange = false;
    
    if (parsed.settings && !parsed.settings.heroVideoUrl) {
      parsed.settings.heroVideoUrl = DEFAULT_DB.settings.heroVideoUrl;
      structuralChange = true;
    }
    if (parsed.settings && !parsed.settings.heroMediaType) {
      parsed.settings.heroMediaType = "video";
      structuralChange = true;
    }
    if (!parsed.studentResults) {
      parsed.studentResults = DEFAULT_DB.studentResults;
      structuralChange = true;
    }
    
    if (structuralChange) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf-8");
    }
    
    return parsed;
  } catch (error) {
    console.error("Database read error:", error);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

// Help helper for writing data
function saveDatabase(data: typeof DEFAULT_DB) {
  try {
    const parentDir = path.dirname(DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// ================= API ENDPOINTS =================

// File Upload Endpoint
app.post("/api/upload", (req, res) => {
  try {
    const { base64, filename } = req.body;
    if (!base64 || !filename) {
      return res.status(400).json({ error: "Fayl matni yoki nomi yetishmayapti" });
    }

    const parts = base64.split(";base64,");
    if (parts.length !== 2) {
      return res.status(400).json({ error: "Fayl formati noto'g'ri (Base64 kutilgan edi)" });
    }

    const mimePart = parts[0];
    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, "base64");
    
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Determine extension
    let ext = path.extname(filename);
    if (!ext) {
      const mimeMatch = mimePart.match(/data:([^;]+)/);
      if (mimeMatch && mimeMatch[1]) {
        const parts = mimeMatch[1].split("/");
        if (parts[1]) {
          ext = "." + parts[1];
        }
      }
    }
    if (!ext) ext = ".bin";

    const safeName = "file_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6) + ext;
    const filePath = path.join(uploadDir, safeName);

    fs.writeFileSync(filePath, buffer);
    res.json({ url: `/uploads/${safeName}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Fayl yuklashda xatolik yuz berdi" });
  }
});

// 1. Settings Endpoints
app.get("/api/settings", (req, res) => {
  const db = getDatabase();
  res.json(db.settings);
});

app.put("/api/settings", (req, res) => {
  const db = getDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json(db.settings);
});

// 2. Courses Endpoints
app.get("/api/courses", (req, res) => {
  const db = getDatabase();
  res.json(db.courses);
});

app.post("/api/courses", (req, res) => {
  const db = getDatabase();
  const newCourse: Course = {
    id: "c_" + Date.now().toString(36),
    name: req.body.name || "Yangi Kurs",
    category: req.body.category || "General",
    description: req.body.description || "",
    duration: req.body.duration || "3 oy",
    price: req.body.price || "Kiritilmagan",
    teacherId: req.body.teacherId || "",
    days: req.body.days || "Dush - Chor - Jum",
    time: req.body.time || "14:00 - 16:00",
    image: req.body.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
    capacity: Number(req.body.capacity) || 12,
  };
  db.courses.push(newCourse);
  saveDatabase(db);
  res.status(201).json(newCourse);
});

app.put("/api/courses/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.courses.findIndex((c: Course) => c.id === id);
  if (index !== -1) {
    db.courses[index] = { ...db.courses[index], ...req.body, id }; // keep same id
    saveDatabase(db);
    res.json(db.courses[index]);
  } else {
    res.status(404).json({ error: "Sinf/kurs topilmadi" });
  }
});

app.delete("/api/courses/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLength = db.courses.length;
  db.courses = db.courses.filter((c: Course) => c.id !== id);
  if (db.courses.length !== initialLength) {
    saveDatabase(db);
    res.json({ success: true, message: "Kurs muvaffaqiyatli o'chirildi." });
  } else {
    res.status(404).json({ error: "Kurs topilmadi" });
  }
});

// 3. Teachers Endpoints
app.get("/api/teachers", (req, res) => {
  const db = getDatabase();
  res.json(db.teachers);
});

app.post("/api/teachers", (req, res) => {
  const db = getDatabase();
  const newTeacher: Teacher = {
    id: "t_" + Date.now().toString(36),
    name: req.body.name || "Yangi Ustoz",
    specialty: req.body.specialty || "O'qituvchi",
    slogan: req.body.slogan || "",
    bio: req.body.bio || "",
    image: req.body.image || "",
    gender: req.body.gender || "erkak",
    experience: req.body.experience || "Yangi",
    phone: req.body.phone || ""
  };
  db.teachers.push(newTeacher);
  saveDatabase(db);
  res.status(201).json(newTeacher);
});

app.put("/api/teachers/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.teachers.findIndex((t: Teacher) => t.id === id);
  if (index !== -1) {
    db.teachers[index] = { ...db.teachers[index], ...req.body, id };
    saveDatabase(db);
    res.json(db.teachers[index]);
  } else {
    res.status(404).json({ error: "O'qituvchi topilmadi" });
  }
});

app.delete("/api/teachers/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLength = db.teachers.length;
  db.teachers = db.teachers.filter((t: Teacher) => t.id !== id);
  if (db.teachers.length !== initialLength) {
    saveDatabase(db);
    res.json({ success: true, message: "O'qituvchi muvaffaqiyatli o'chirildi." });
  } else {
    res.status(404).json({ error: "O'qituvchi topilmadi" });
  }
});

// 4. Leads (Admissions) Endpoints
app.get("/api/leads", (req, res) => {
  const db = getDatabase();
  res.json(db.leads);
});

app.post("/api/leads", (req, res) => {
  const db = getDatabase();
  const phone = (req.body.phone || "").trim();
  const studentName = (req.body.studentName || "").trim();
  const digitCount = phone.replace(/\D/g, "").length;

  if (!studentName || studentName === "Noma'lum O'quvchi") {
    return res.status(400).json({ error: "Talabaning ismi va familiyasini kiritish majburiy!" });
  }

  if (!phone || phone === "+998" || phone.replace(/\s+/g, '') === "+998" || digitCount < 9) {
    return res.status(400).json({ error: "Talabaning telefon raqamini to'liq kiritish majburiy!" });
  }

  const newLead: Lead = {
    id: "l_" + Date.now().toString(36),
    studentName,
    phone,
    courseId: req.body.courseId || "",
    status: req.body.status || "yangi",
    notes: req.body.notes || "",
    createdAt: new Date().toISOString()
  };
  db.leads.push(newLead);
  saveDatabase(db);
  res.status(201).json(newLead);
});

app.put("/api/leads/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.leads.findIndex((l: Lead) => l.id === id);
  if (index !== -1) {
    if (req.body.phone !== undefined) {
      const phone = req.body.phone.trim();
      const digitCount = phone.replace(/\D/g, "").length;
      if (!phone || phone === "+998" || phone.replace(/\s+/g, '') === "+998" || digitCount < 9) {
        return res.status(400).json({ error: "Talabaning telefon raqamini to'liq kiritish majburiy!" });
      }
    }
    db.leads[index] = { ...db.leads[index], ...req.body, id };
    saveDatabase(db);
    res.json(db.leads[index]);
  } else {
    res.status(404).json({ error: "Arizachi topilmadi" });
  }
});

app.delete("/api/leads/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((l: Lead) => l.id !== id);
  if (db.leads.length !== initialLength) {
    saveDatabase(db);
    res.json({ success: true, message: "Ariza muvaffaqiyatli o'chirildi." });
  } else {
    res.status(404).json({ error: "Ariza topilmadi" });
  }
});

// 4b. Student Results Endpoints
app.get("/api/results", (req, res) => {
  const db = getDatabase();
  res.json(db.studentResults || []);
});

app.post("/api/results", (req, res) => {
  const db = getDatabase();
  if (!db.studentResults) db.studentResults = [];
  const newResult: StudentResultItem = {
    id: "sr_" + Date.now().toString(36),
    studentName: req.body.studentName || "Kirish imtihonchisi",
    score: req.body.score || "7.5",
    examType: req.body.examType || "IELTS",
    image: req.body.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    courseName: req.body.courseName || "",
    achievementDate: req.body.achievementDate || new Date().toISOString().split('T')[0]
  };
  db.studentResults.push(newResult);
  saveDatabase(db);
  res.status(201).json(newResult);
});

app.put("/api/results/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  if (!db.studentResults) db.studentResults = [];
  const index = db.studentResults.findIndex((r: any) => r.id === id);
  if (index !== -1) {
    db.studentResults[index] = { ...db.studentResults[index], ...req.body, id };
    saveDatabase(db);
    res.json(db.studentResults[index]);
  } else {
    res.status(404).json({ error: "Natija topilmadi" });
  }
});

app.delete("/api/results/:id", (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  if (!db.studentResults) db.studentResults = [];
  const initialLength = db.studentResults.length;
  db.studentResults = db.studentResults.filter((r: any) => r.id !== id);
  if (db.studentResults.length !== initialLength) {
    saveDatabase(db);
    res.json({ success: true, message: "Natija muvaffaqiyatli o'chirildi." });
  } else {
    res.status(404).json({ error: "Natija topilmadi" });
  }
});

// 5. Dashboard Stats Endpoint
app.get("/api/stats", (req, res) => {
  const db = getDatabase();
  const leads = db.leads;
  
  const stats = {
    totalLeads: leads.length,
    activeStudents: leads.filter((l: Lead) => l.status === "oqiyapti").length,
    totalCourses: db.courses.length,
    totalTeachers: db.teachers.length,
    recentLeads: [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    leadsByStatus: {
      yangi: leads.filter((l: Lead) => l.status === "yangi").length,
      suhbatda: leads.filter((l: Lead) => l.status === "suhbatda").length,
      oqiyapti: leads.filter((l: Lead) => l.status === "oqiyapti").length,
      "rad-etildi": leads.filter((l: Lead) => l.status === "rad-etildi").length,
    }
  };
  res.json(stats);
});

// 6. Gemini AI Course/Bio helper with highly advanced and dynamic bio styling variations
app.post("/api/ai/generate", async (req, res) => {
  const activeAi = getAIClient();
  if (!activeAi) {
    return res.status(503).json({ 
      error: "Sizning serveringizda GEMINI_API_KEY sozlanmagan. Iltimos, AI Studio panelidagi Secrets bo'limida o'rnating."
    });
  }

  try {
    const { type, name, context } = req.body;
    let prompt = "";
    
    if (type === "course") {
      prompt = `Siz professional o'quv markazining bosh kuratori va muallifisiz. 
                Siz yangi dars/kurs uchun batafsil va o'quvchilarni jalb etuvchi ta'rif yaratishingiz kerak.
                Kurs nomi: "${name}". 
                Kurs yo'nalishi va qo'shimcha ma'lumotlar: "${context || "yo'q"}". 
                Iltimos, o'quvchilarni jalb qiladigan, o'zbek tilida yozilgan, nihoyatda professional, jozibador 2-4 jumlali kurs ta'rifini va kurs davomiyligi uchun tavsiyani qaytaring. 
                Javob faqat matndan iborat bo'lsin. Markdown yoki ortiqcha belgilarsiz jozibali o'zbek tilida yozilsin.`;
    } else if (type === "teacher") {
      // Prompt for unique, varied and styled teacher biography as requested
      prompt = `Siz professional va nufuzli zamonaviy o'quv markazining bosh yozuvchisiz.
                O'qituvchi ismi: "${name}".
                Mutaxassis haqida kiritilgan boshlang'ich kalit so'zlar yoki ma'lumotlar (masalan: qaysi fandan o'tishi, tajribasi, yutuqlari): "${context || "yo'q"}".

                Iltimos, o'qituvchining jozibali, professional 2-4 jumlali ajoyib tarjimai holini (bio) o'zbek tilida yozib bering.

                DIQQAT: Biz har safar takrorlanmas, o'ziga xos va har bir ustozga mos turlicha uslublarni qo'llashimiz shart. Shuning uchun, ushbu o'qituvchi uchun quyidagi uslublardan birini MUTLAQO tasodifiy tanlab (hech qachon bir xil qolipli gaplarsiz) yozing:
                - "Storytelling (Hikoya) shaklida": Ta'limga bo'lgan cheksiz muhabbati va o'quvchilar hayotini yorqin qilish istagi haqida hissiy-professional ohangda.
                - "Natijaga yo'naltirilgan & Kuchli nufuz": Qat'iy va ishonchli so'zlar bilan ustozning eng yirik yutuqlari hamda dars berishdagi mukammal natijalarini ulug'lash.
                - "Do'stona, Samimiy & Motivatsion": O'quvchilarning dardini tushunadigan, yaqin do'st va oliyjanob ustoz obrazini ifodalab, ularni yangi bilimlar sari ilhomlantirish.
                - "Zamonaviy & Innovatsion": Dars jarayonida eng ilg'or uslublar, interaktiv texnikalar va darslarni oson o'rgatish yo'llariga urg'u berish.

                Faqatgina to'g'ridan-to'g'ri o'qituvchi bio matnini qaytaring. JSON yoki markdownlarsiz (\`\`\` belgilarisiz), ortiqcha kirish-chiqish gaplarisiz, jozibali va mukammal o'zbek tilida tayyorlab bering.`;
    } else {
      return res.status(400).json({ error: "Yaroqsiz yaratish turi" });
    }

    const model = "gemini-3.5-flash";
    const response = await activeAi.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error.message || "Tafsilotlarni yaratishda xatolik yuz berdi" });
  }
});

// 7. Advanced Server-Side Admin-AI Co-pilot for full-stack control & automation
app.post("/api/ai/copilot", async (req, res) => {
  const activeAi = getAIClient();
  if (!activeAi) {
    return res.status(503).json({
      error: "SaaS sun'iy intellekti yuklanmagan yoki API tokeni xato. Admin paneldan maxfiy kalitni tekshiring."
    });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Yaxshi buyruq yoki savol matnini kiritishingiz lozim." });
    }

    const db = getDatabase();

    const systemInstruction = `Siz professional o'quv markazining boshqaruv tizimidagi eng oliy martabali AI Copilot (Yordamchi terminal) hisoblanasiz.
Foydalanuvchi sizga tizim ma'lumotlarini qidirish, savollar berish yoki tahrirlash (yangi kurs qo'shish, statusni o'zgartirish, markaz sozlamalarini yangilash) bo'yicha tabiiy tildagi buyruqlar beradi.
Sizning asosiy vazifangiz - o'quv markazi ma'lumotlarini to'g'ri boshqarish va foydalanuvchining aytganini so'zsiz va aniq bajarishdir.
Siz javobingizda 'reply' maydonida o'zbek tilida chiroyli, do'stona va ijodiy matn qaytarishingiz kerak.
Agar foydalanuvchi ma'lumotlarni qo'shish, yangilash yoki o'chirishni buyurgan bo'lsa, siz quyidagi 'actions' massivini mos ravishda to'ldirasiz, tizim ularni avtomatik tarzda databazaga yozadi. Agar hech qanday tahrir talab qilinmasa (shunchaki savol so'ralsa), 'actions' massivini bo'sh qoldiring: [].

DIQQAT: Qaytayotgan javobingiz qat'iy ravishda parse qiluvchi to'g'ridan-to'g'ri JSON formatida bo'lsin. Markdown (\`\`\`json) yoki ortiqcha matnli tushuntirishlarni aslo qo'shmang!

Ruxsat berilgan 'actions' va ularning payloads turlari:
1. { "type": "UPDATE_SETTINGS", "payload": { "name": "Yangi ism", "logoText": "LOGO", "heroTitle": "...", "heroSubtitle": "...", "phone": "...", "email": "...", "address": "...", "aboutText": "..." } } -- Markaz sozlamalarini qisman yoki to'liq yangilash
2. { "type": "ADD_COURSE", "payload": { "name": "nom", "category": "IT"|"English"|"Matematika"|"Kids", "description": "batafsil", "duration": "davomiyliyi", "price": "narx", "teacherId": "ustozID (masalan t1, t2)", "days": "kunlari", "time": "vaqti", "capacity": 10, "image": "ixtiyoriy rasm" } } -- Yangi dars qo'shish
3. { "type": "UPDATE_COURSE", "payload": { "id": "kur_id", "name": "...", "price": "..." } } -- Mavjud kursni tahrirlash
4. { "type": "DELETE_COURSE", "payload": { "id": "kur_id" } } -- Kursni o'chirish
5. { "type": "ADD_TEACHER", "payload": { "name": "Ism Familiya", "specialty": "Mutaxassisligi", "bio": "Bio", "experience": "Tajribasi", "phone": "tel", "gender": "erkak"|"ayol", "image": "ixtiyoriy" } } -- Yangi ustoz qo'shish
6. { "type": "UPDATE_TEACHER", "payload": { "id": "ustoz_id", "name": "..." } } -- Ustozni yangilash
7. { "type": "DELETE_TEACHER", "payload": { "id": "ustoz_id" } } -- Ustozni o'chirish
8. { "type": "UPDATE_LEAD", "payload": { "id": "ariza_id", "status": "yangi"|"suhbatda"|"oqiyapti"|"rad-etildi", "notes": "izoh" } } -- Arizalar holatini yoki izohini yangilash
9. { "type": "DELETE_LEAD", "payload": { "id": "ariza_id" } } -- Arizani o'chirish`;

    const prompt = `Joriy ma'lumotlar bazasining to'liq holati:
${JSON.stringify(db, null, 2)}

Foydalanuvchi buyrug'i / savoli: "${message}"

Iltimos, ushbu formatda qat'iy va faqatgina JSON qaytaring:
{
  "reply": "Bajarilgan amallar haqida chiroyli hisobot matni (o'zbek tilida)",
  "actions": [
    // Agar foydalanuvchi biron ma'lumotni o'zgartirishni so'ragan bo'lsa, mos aksiya ob'ektlarini kiriting.
  ]
}`;

    const response = await activeAi.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text?.trim() || "{}";
    let aiResponse: { reply: string; actions?: Array<{ type: string; payload: any }> };

    try {
      aiResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Clean potential markdown tags in case flash returns them
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      aiResponse = JSON.parse(cleaned);
    }

    let dbModified = false;

    if (aiResponse.actions && Array.isArray(aiResponse.actions) && aiResponse.actions.length > 0) {
      for (const action of aiResponse.actions) {
        if (!action.type || !action.payload) continue;

        switch (action.type) {
          case "UPDATE_SETTINGS":
            db.settings = { ...db.settings, ...action.payload };
            dbModified = true;
            break;

          case "ADD_COURSE": {
            const newCourse: Course = {
              id: "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
              name: action.payload.name || "Yangi Kurs",
              category: action.payload.category || "English",
              description: action.payload.description || "",
              duration: action.payload.duration || "3 oy",
              price: action.payload.price || "Sotuvda",
              teacherId: action.payload.teacherId || "",
              days: action.payload.days || "Dush - Chor - Jum",
              time: action.payload.time || "15:00 - 17:00",
              image: action.payload.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
              capacity: Number(action.payload.capacity) || 12
            };
            db.courses.push(newCourse);
            dbModified = true;
            break;
          }

          case "UPDATE_COURSE": {
            const id = action.payload.id;
            const index = db.courses.findIndex((c: Course) => c.id === id);
            if (index !== -1) {
              db.courses[index] = { ...db.courses[index], ...action.payload };
              dbModified = true;
            }
            break;
          }

          case "DELETE_COURSE": {
            const id = action.payload.id;
            db.courses = db.courses.filter((c: Course) => c.id !== id);
            dbModified = true;
            break;
          }

          case "ADD_TEACHER": {
            const newTeacher: Teacher = {
              id: "t_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
              name: action.payload.name || "Yangi Ustoz",
              specialty: action.payload.specialty || "O'qituvchi",
              bio: action.payload.bio || "",
              experience: action.payload.experience || "Yangi",
              phone: action.payload.phone || "",
              gender: action.payload.gender || "erkak",
              image: action.payload.image || ""
            };
            db.teachers.push(newTeacher);
            dbModified = true;
            break;
          }

          case "UPDATE_TEACHER": {
            const id = action.payload.id;
            const index = db.teachers.findIndex((t: Teacher) => t.id === id);
            if (index !== -1) {
              db.teachers[index] = { ...db.teachers[index], ...action.payload };
              dbModified = true;
            }
            break;
          }

          case "DELETE_TEACHER": {
            const id = action.payload.id;
            db.teachers = db.teachers.filter((t: Teacher) => t.id !== id);
            dbModified = true;
            break;
          }

          case "UPDATE_LEAD": {
            const id = action.payload.id;
            const index = db.leads.findIndex((l: Lead) => l.id === id);
            if (index !== -1) {
              db.leads[index] = { ...db.leads[index], ...action.payload };
              dbModified = true;
            }
            break;
          }

          case "DELETE_LEAD": {
            const id = action.payload.id;
            db.leads = db.leads.filter((l: Lead) => l.id !== id);
            dbModified = true;
            break;
          }
        }
      }
    }

    if (dbModified) {
      saveDatabase(db);
    }

    res.json({
      reply: aiResponse.reply || "Ko'rsatmalaringiz bo'yicha tizim muvaffaqiyatli yangilandi.",
      actions: aiResponse.actions || [],
      dbModified
    });

  } catch (error: any) {
    console.error("Gemini Copilot execution error:", error);
    res.status(500).json({ error: error.message || "Tizimni AI boshqaruvida muammo yuz berdi." });
  }
});

// ================= PLACEMENT TEST & STUDY PLAN API =================
app.get("/api/placement-questions", (req, res) => {
  const questions = [
    {
      id: 1,
      question: "Choose the correct verb form: 'Neither of the students ___ completed the assignment yet.'",
      options: [
        "has",
        "have",
        "is",
        "are"
      ],
      correct: 0,
      explanation: "'Neither of' triggers a singular verb in formal English. Therefore, 'neither has' is correct."
    },
    {
      id: 2,
      question: "If she ___ more attention in class yesterday, she would know the answer today.",
      options: [
        "paid",
        "has paid",
        "had paid",
        "would pay"
      ],
      correct: 2,
      explanation: "This is a mixed conditional (past action with a present result). 'If + past perfect' handles yesterday's action."
    },
    {
      id: 3,
      question: "Identify the word that is closest in meaning to 'OBDURATE':",
      options: [
        "Flexible",
        "Stubborn",
        "Mischievous",
        "Generous"
      ],
      correct: 1,
      explanation: "'Obdurate' means stubbornly refusing to change one's opinion or course of action."
    },
    {
      id: 4,
      question: "By next October, they ___ in London for exactly ten years.",
      options: [
        "will live",
        "are living",
        "will be living",
        "will have lived"
      ],
      correct: 3,
      explanation: "The Future Perfect ('will have lived') represents an action that will be completed by a specific point in the future."
    },
    {
      id: 5,
      question: "Complete the sentence: 'Hardly ___ entered the room when the lights went out.'",
      options: [
        "had he",
        "he had",
        "did he",
        "has he"
      ],
      correct: 0,
      explanation: "When a sentence starts with negative adverbials like 'Hardly', subject-verb inversion is required ('had he')."
    },
    {
      id: 6,
      question: "Choose the correct preposition: 'The manager congratulated the team ___ their outstanding academic scorecards.'",
      options: [
        "for",
        "on",
        "about",
        "with"
      ],
      correct: 1,
      explanation: "One congratulates someone 'on' an achievement, not 'for' it."
    }
  ];
  res.json(questions);
});

app.post("/api/ai/study-plan", async (req, res) => {
  const activeAi = getAIClient();
  if (!activeAi) {
    return res.status(503).json({
      error: "Sizning serveringizda GEMINI_API_KEY sozlanmagan. Iltimos, AI Studio panelidagi Secrets bo'limida o'rnating."
    });
  }

  try {
    const { currentLevel, targetGoal, name } = req.body;
    if (!currentLevel || !targetGoal) {
      return res.status(400).json({ error: "Iltimos, joriy daraja va maqsadni kiriting." });
    }

    const studentName = name || "Hurmatli talaba";

    const prompt = `Siz Oxford va Cambridge darajasidagi eng nufuzli ingliz tili metodistisiz.
      Uquvchi ismi: "${studentName}".
      Joriy ingliz tili darajasi: "${currentLevel}" (masalan: Beginner, Elementary, Intermediate, CEFR B1, B2).
      Maqsadi / Target IELTS balli: "${targetGoal}" (masalan: IELTS 7.5, SAT verbal, CEFR C1, Expressive Speaking).

      Iltimos, ushbu talaba uchun shaxsiylashtirilgan 30 kunlik intensiv o'quv rejasini (Daily Timeline Study Plan) tuzib bering.
      O'quv rejasi o'zbek tilida, nihoyatda dalillangan, professional va o'quvchini ruhan ruhlantiruvchi bo'lsin.
      Unda quyidagi bo'limlar bo'lsin:
      1. Darajaning qisqacha professional tahlili va muammoli nuqtalar.
      2. 30 kunlik intensiv dars rejasi (haftalik bloklarga bo'lingan holda - 1-hafta, 2-hafta va h.k.).
      3. IELTS / CEFR imtihoni uchun maxsus tavsiyalar va "Apex Academy" darslarida nimalarga urg'u berish lozimligi.
      
      Javob faqat matndan (Markdown formatida, o'qishga juda qulay, chiroyli sarlavhalar va qalin matnlar bilan) iborat bo'lsin. Ortiqcha kirish so'zlari yoki qo'shtirnoqsiz to'g'ridan-to'g'ri reja matnini bering. `;

    const model = "gemini-3.5-flash";
    const response = await activeAi.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini Plan Generation Error:", error);
    res.status(500).json({ error: error.message || "AI reja tuzishda xatolik yuz berdi" });
  }
});

// ================= VITE OR STATIC FILES =================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
}

startServer();
