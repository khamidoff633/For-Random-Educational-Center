# UI konventsiyalari (Apex Academy)

## Ikonkalar — emoji ishlatilmaydi
- Mahsulot interfeysida (sayt va admin panel) **hech qachon emoji/stiker** ishlatilmasin
  (masalan: ✅, 🚀, 🎓, ⭐ va shunga o'xshash belgilar).
- Buning o'rniga **doimo toza vektor ikonkalardan** foydalaning:
  - Asosiy manba: **lucide-react** (loyihada mavjud).
  - Kerak bo'lsa, qo'lda yozilgan **SVG**.
- Bu qoida tugmalar, badge'lar, status belgilари, favicon va har qanday ko'rinadigan
  UI matniga taalluqli.
- Emoji faqat suhbat/chatda mumkin — yetkazib beriladigan mahsulot UI'sida emas.

## Sabab
Emoji/stiker professional bo'lmagan ko'rinish beradi. Sotiladigan, premium
mahsulot uchun barcha vizual belgilar izchil ikonka to'plamidan bo'lishi shart.



## Saqlash tugmasi — "dirty state" (o'zgarish bor/yo'q)
Forma + "Saqlash" tugmasi bo'lgan HAR QANDAY joyda:
- Saqlangan (o'zgarishsiz) holatda tugma **o'chiq/xira** (`disabled`, past opacity,
  `cursor-not-allowed`) bo'lsin — bosilmaydi, hover'da ham hech narsa bo'lmaydi.
- Foydalanuvchi formada biror maydonni **o'zgartirgandagina** tugma **faol va to'q
  rangli** (neon/jonli) bo'ladi.
- Muvaffaqiyatli saqlangach, tugma yana xira (disabled) holatga qaytsin.
- Texnik: dastlabki ma'lumotni saqlab, joriy holat bilan solishtirib `isDirty`
  hisoblanadi (chuqur tenglik). `isDirty=false` bo'lsa tugma disabled.
- Bu qoida Sozlamalar va boshqa barcha tahrirlash formalariga taalluqli.



## Takrorlanuvchi elementlarga limit (masalan: Afzalliklar)
- Foydalanuvchi tomonidagi tartib (layout) belgilangan songa bog'liq bo'lsa,
  admin paneldagi "Qo'shish" tugmasi shu limitni hisobga olsin.
- Afzalliklar (Features): **maksimal 4 ta**. 4  taga yetganda "Qo'shish" tugmasi
  **xira/disabled** bo'ladi; element o'chirilib son kamaysa, tugma yana jonlanadi.
- Umumiy qoida: limitli ro'yxatlarda "Qo'shish" tugmasi limitga yetganda disabled
  bo'lsin (dirty-state tugmalari bilan bir xil vizual uslubda).
