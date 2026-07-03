/**
 * Default seed data used to initialise an empty database (file store or
 * PostgreSQL). Demo content can be freely edited from the admin panel.
 */
import { env } from "../config/env";
import { hashPassword } from "../utils/crypto";
import type { DatabaseShape } from "../models/types";

export function buildSeedDatabase(): DatabaseShape {
  return {
    settings: {
      name: "Apex Academy",
      logoText: "APEX Academy",
      heroTitle: "Kelajagingizni biz bilan birga quring",
      heroSubtitle:
        "Eng yuqori natijali ingliz tili va axborot texnologiyalari kurslari. Malakali ustozlar va zamonaviy o'quv muhiti.",
      heroBgImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
      heroVideoUrl:
        "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c05cba307b26d02f83d944e1e07b78a9&profile_id=139&oauth2_token_id=57447761",
      heroMediaType: "video",
      phone: "+998 (90) 123-4567",
      email: "info@apexacademy.uz",
      address: "Toshkent shahri, Chilonzor tumani, 9-kvartal, 14-uy",
      mapsUrl: "https://maps.google.com",
      telegram: "https://t.me/apex_academy",
      instagram: "https://instagram.com/apex_academy",
      facebook: "https://facebook.com/apex_academy",
      youtube: "https://youtube.com",
      aboutText:
        "Bizning o'quv markazimiz 2021-yilda tashkil etilgan bo'lib, shu kunga qadar 5000 dan ortiq o'quvchilarga ingliz tili, matematika va dasturlash yo'nalishlarida muvaffaqiyatli ta'lim berib kelmoqda. Maqsadimiz — har bir o'quvchining salohiyatini ochish va ularni global muvaffaqiyatlarga tayyorlash.",
      features: [
        {
          id: "feat1",
          title: "Tajribali o'qituvchilar",
          desc: "IELTS 8.5+ ballga ega va xalqaro sertifikatlangan professional ustozlar jamoasi.",
          icon: "GraduationCap",
        },
        {
          id: "feat2",
          title: "Zamonaviy jihozlar",
          desc: "Har bir xonada interaktiv doskalar, noutbuklar va zamonaviy audio tizimlar mavjud.",
          icon: "Laptop",
        },
        {
          id: "feat3",
          title: "Kichik guruhlar",
          desc: "Guruhlarda 10-12 nafar o'quvchi bo'lib, har bir o'quvchiga individual yondashuv ta'minlanadi.",
          icon: "Users",
        },
        {
          id: "feat4",
          title: "Doimiy monitoring",
          desc: "Ota-onalar uchun haftalik test hisobotlari va natijalarni onlayn kuzatish paneli.",
          icon: "TrendingUp",
        },
      ],
      logoImage: "",
      aboutImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      whatsapp: "998901234567",
      gallery: [],
      partners: [],
      branches: [
        {
          id: "br1",
          name: "Chilonzor filiali",
          address: "Toshkent, Chilonzor 9-kvartal, 14-uy",
          phone: "+998 90 123-4567",
          mapsUrl: "https://maps.google.com",
        },
        {
          id: "br2",
          name: "Yunusobod filiali",
          address: "Toshkent, Yunusobod 4-mavze",
          phone: "+998 90 765-4321",
          mapsUrl: "https://maps.google.com",
        },
      ],
      pricing: [
        {
          id: "p1",
          name: "Standart",
          price: "450 000",
          period: "oy",
          features: ["Haftada 3 kun", "Guruhda 12 talaba", "O'quv materiallari"],
          highlighted: false,
        },
        {
          id: "p2",
          name: "Premium",
          price: "650 000",
          period: "oy",
          features: ["Haftada 4 kun", "Guruhda 8 talaba", "Shaxsiy mentor", "Mock testlar"],
          highlighted: true,
        },
        {
          id: "p3",
          name: "Individual",
          price: "1 200 000",
          period: "oy",
          features: ["Yakkama-yakka", "Moslashuvchan jadval", "Tezkor natija"],
          highlighted: false,
        },
      ],
      reviews: [
        {
          id: "rv1",
          name: "Nigora Tosheva",
          role: "IELTS 7.5",
          text: "Ustozlar juda professional. 4 oyda ballimni 5.5 dan 7.5 ga ko'tardim!",
          rating: 5,
          avatar: "",
        },
        {
          id: "rv2",
          name: "Jasur Komilov",
          role: "Web Frontend",
          text: "Noldan boshlab haqiqiy loyihalar ustida ishladik. Kursdan keyin ishga joylashdim.",
          rating: 5,
          avatar: "",
        },
        {
          id: "rv3",
          name: "Dilnoza Karimova",
          role: "General English",
          text: "Kichik guruhlar va individual yondashuv yoqdi. Endi erkin gaplashaman.",
          rating: 5,
          avatar: "",
        },
      ],
    },
    teachers: [
      {
        id: "t1",
        name: "Abdurahmon Rasulov",
        specialty: "Katta ingliz tili o'qituvchisi & IELTS murabbiysi",
        bio: "Toshkent Davlat Jahon Tillari Universitetini tamomlagan. IELTS 8.5 sohibi. 6 yillik xalqaro IELTS o'qitish tajribasiga ega.",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        experience: "6 yil",
        phone: "+998 90 999-8877",
        gender: "erkak",
      },
      {
        id: "t2",
        name: "Rayhona Malikova",
        specialty: "General English & bolalar uchun mutaxassis",
        bio: "Bolalar va kattalarga ingliz tilini interaktiv usulda o'rgatish bo'yicha mutaxassis. Xalqaro CELTA sertifikati sohibasi.",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
        experience: "4 yil",
        phone: "+998 93 111-2233",
        gender: "ayol",
      },
      {
        id: "t3",
        name: "Sardorbek Tursunov",
        specialty: "Web dasturlash mutaxassisi",
        bio: "Full-stack dasturchi, yirik kompaniyaning sobiq katta muhandisi. HTML/CSS, JavaScript va React bo'yicha yuqori reytingli darslar olib boradi.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        experience: "5 yil",
        phone: "+998 94 444-5566",
        gender: "erkak",
      },
    ],
    courses: [
      {
        id: "c1",
        name: "Intensive IELTS (8.0+)",
        category: "English",
        description:
          "IELTS imtihoniga tezkor va mukammal tayyorgarlik kursi. Har hafta yozma baholash va shaxsiy fikr-mulohaza beriladi.",
        duration: "3 oy",
        price: "550 000 so'm / oy",
        teacherId: "t1",
        days: "Dush - Chor - Jum",
        time: "15:00 - 17:00",
        image:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
        capacity: 12,
      },
      {
        id: "c2",
        name: "General English (Pre-Intermediate)",
        category: "English",
        description:
          "Ingliz tilida erkin gapirish va grammatikani chuqur o'zlashtirish uchun mo'ljallangan intensiv amaliy darslar.",
        duration: "6 oy",
        price: "450 000 so'm / oy",
        teacherId: "t2",
        days: "Sesh - Pay - Shan",
        time: "10:00 - 12:00",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
        capacity: 15,
      },
      {
        id: "c3",
        name: "Web Frontend dasturlash",
        category: "IT",
        description:
          "Noldan boshlab professional dasturchi bo'ling. HTML, CSS, JavaScript va React'ni amaliy loyihalar orqali o'rganing.",
        duration: "8 oy",
        price: "700 000 so'm / oy",
        teacherId: "t3",
        days: "Dush - Chor - Jum",
        time: "18:30 - 20:30",
        image:
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop",
        capacity: 10,
      },
    ],
    leads: [
      {
        id: "l1",
        studentName: "Shohruh Mirzayev",
        phone: "+998 (90) 123-4567",
        courseId: "c1",
        status: "yangi",
        notes: "Telegram sahifamizdan yozdi. IELTS ballini 6.0 dan 8.0 gacha oshirishni maqsad qilgan.",
        createdAt: new Date(Date.now() - 43_200_000).toISOString(),
        seen: false,
        verified: false,
        verifiedAt: null,
      },
      {
        id: "l2",
        studentName: "Madina Alimova",
        phone: "+998 (93) 456-7890",
        courseId: "c2",
        status: "boglanildi",
        notes: "Tushdan keyingi 16:00 guruhini so'rayapti. Sinov darsi belgilandi.",
        createdAt: new Date(Date.now() - 172_800_000).toISOString(),
        seen: true,
        verified: false,
        verifiedAt: null,
      },
      {
        id: "l3",
        studentName: "Eldor Tursunov",
        phone: "+998 (99) 777-5533",
        courseId: "c3",
        status: "royxatga_otdi",
        notes: "Suhbatdan o'tdi, to'lovni amalga oshirdi. Dushanba kuni birinchi darsga qo'shildi.",
        createdAt: new Date(Date.now() - 345_600_000).toISOString(),
        seen: true,
        verified: false,
        verifiedAt: null,
      },
    ],
    studentResults: [
      {
        id: "sr1",
        studentName: "Doston Yo'ldoshev",
        score: "8.5",
        examType: "IELTS",
        image:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
        certificateImage: "",
        description: "3 oylik intensiv tayyorgarlikdan so'ng IELTS 8.5 ball.",
        courseName: "Intensive IELTS (8.0+)",
        achievementDate: "2026-02-15",
      },
      {
        id: "sr2",
        studentName: "Olimjon Karimov",
        score: "1540",
        examType: "SAT",
        image:
          "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop",
        certificateImage: "",
        description: "",
        courseName: "SAT Mathematics",
        achievementDate: "2026-03-10",
      },
      {
        id: "sr3",
        studentName: "Zilola Ergasheva",
        score: "C1",
        examType: "CEFR",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        certificateImage: "",
        description: "",
        courseName: "General English (Pre-Intermediate)",
        achievementDate: "2026-01-22",
      },
    ],
    admin: {
      id: "admin",
      email: env.auth.adminEmail,
      passwordHash: hashPassword(env.auth.adminPassword),
      totpSecret: null,
      totpEnabled: false,
    },
  };
}
