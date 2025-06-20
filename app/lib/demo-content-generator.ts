export class DemoContentGenerator {
  static generateDemoContent(contentType: string, topic: string, style: string): string {
    const demoContents = {
      artikel: `# ${topic}

Dalam era digital saat ini, ${topic.toLowerCase()} menjadi topik yang sangat relevan untuk dibahas. 

## Pendahuluan
${topic} memiliki dampak yang signifikan dalam kehidupan sehari-hari. Berbagai aspek perlu dipertimbangkan untuk memahami fenomena ini secara komprehensif.

## Pembahasan Utama
Beberapa poin penting yang perlu diperhatikan:

1. **Aspek Pertama**: Penjelasan detail tentang aspek pertama
2. **Aspek Kedua**: Analisis mendalam tentang aspek kedua  
3. **Aspek Ketiga**: Evaluasi komprehensif aspek ketiga

## Kesimpulan
Berdasarkan pembahasan di atas, dapat disimpulkan bahwa ${topic.toLowerCase()} merupakan hal yang penting untuk dipahami dan diterapkan dalam konteks yang tepat.

*Artikel ini dibuat dengan AI Writer Pro - Demo Mode*`,

      "tugas-sekolah": `# Tugas: ${topic}

## Pendahuluan
Tugas ini membahas tentang ${topic.toLowerCase()} yang merupakan topik penting dalam pembelajaran.

## Tujuan Pembelajaran
- Memahami konsep dasar ${topic.toLowerCase()}
- Menganalisis berbagai aspek terkait
- Menarik kesimpulan yang tepat

## Pembahasan
### A. Definisi dan Konsep Dasar
${topic} dapat didefinisikan sebagai...

### B. Analisis Mendalam
Berdasarkan berbagai sumber, dapat dianalisis bahwa...

### C. Contoh Penerapan
Dalam kehidupan sehari-hari, ${topic.toLowerCase()} dapat ditemukan dalam...

## Kesimpulan
Dari pembahasan di atas, dapat disimpulkan bahwa...

## Daftar Pustaka
- Sumber 1: Referensi akademik terkait
- Sumber 2: Jurnal ilmiah yang relevan

*Tugas ini dibuat dengan AI Writer Pro - Demo Mode*`,

      "caption-ig": `🌟 ${topic} 🌟

Hey guys! Hari ini mau sharing tentang ${topic.toLowerCase()} nih! 

${style === "santai" ? "😊 Jadi ceritanya..." : "Berdasarkan pengalaman..."}

✨ Poin-poin penting:
• Point pertama yang menarik
• Insight yang bermanfaat  
• Tips praktis untuk kalian

${style === "santai" ? "Gimana menurut kalian? Share di comment ya! 💬" : "Semoga bermanfaat untuk teman-teman semua."}

#${topic.replace(/\s+/g, "")} #ContentCreator #AIWriterPro #Indonesia #Viral #Trending

*Generated with AI Writer Pro - Demo Mode*`,

      "email-formal": `Subject: ${topic}

Kepada Yth.
[Nama Penerima]
[Jabatan]
[Perusahaan]

Dengan hormat,

Saya menulis surat ini untuk menyampaikan hal terkait ${topic.toLowerCase()}.

${style === "formal" ? "Berdasarkan pertimbangan yang matang," : "Dengan ini saya ingin menyampaikan bahwa"} ${topic.toLowerCase()} merupakan hal yang perlu mendapat perhatian khusus.

Beberapa poin yang ingin saya sampaikan:
1. Poin pertama yang relevan
2. Aspek kedua yang penting
3. Usulan atau saran konstruktif

Demikian surat ini saya sampaikan. Atas perhatian dan kerjasamanya, saya ucapkan terima kasih.

Hormat saya,

[Nama Pengirim]
[Jabatan]
[Kontak]

*Email ini dibuat dengan AI Writer Pro - Demo Mode*`,

      "ringkasan-buku": `# Ringkasan: ${topic}

## Informasi Buku
- **Judul**: ${topic}
- **Penulis**: [Nama Penulis]
- **Tahun Terbit**: [Tahun]
- **Genre**: [Genre Buku]

## Sinopsis Singkat
Buku ini membahas tentang ${topic.toLowerCase()} dengan pendekatan yang komprehensif dan mudah dipahami.

## Poin-Poin Utama

### Bab 1: Pengenalan
- Konsep dasar yang diperkenalkan
- Latar belakang pentingnya topik ini

### Bab 2: Pembahasan Inti  
- Analisis mendalam tentang tema utama
- Contoh-contoh praktis yang relevan

### Bab 3: Aplikasi Praktis
- Cara menerapkan konsep dalam kehidupan
- Tips dan strategi yang bisa digunakan

## Key Takeaways
1. **Insight Utama**: Pembelajaran penting dari buku
2. **Aplikasi Praktis**: Cara menerapkan dalam kehidupan
3. **Inspirasi**: Motivasi yang bisa diambil

## Rekomendasi
Buku ini cocok untuk pembaca yang ingin memahami ${topic.toLowerCase()} secara mendalam.

**Rating**: ⭐⭐⭐⭐⭐

*Ringkasan ini dibuat dengan AI Writer Pro - Demo Mode*`,
    }

    return demoContents[contentType as keyof typeof demoContents] || demoContents.artikel
  }
}
