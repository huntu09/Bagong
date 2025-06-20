"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  NewspaperIcon,
  StarIcon,
  BookIcon,
  ArticleIcon,
  BriefcaseIcon,
  UsersIcon,
  TrendingUpIcon,
  HeartIcon,
  AlertIcon,
  CalendarIcon,
} from "../icons"

interface Template {
  id: string
  name: string
  description: string
  structure: string[]
  icon: any
  example: string
}

const templates = {
  artikel: [
    {
      id: "berita",
      name: "Artikel Berita",
      description: "Format berita dengan 5W+1H",
      structure: ["Headline menarik", "Lead paragraph", "Body dengan fakta", "Quote narasumber", "Kesimpulan"],
      icon: NewspaperIcon,
      example: "Cocok untuk: berita terkini, laporan kejadian, update informasi",
    },
    {
      id: "tutorial",
      name: "Artikel Tutorial",
      description: "Panduan step-by-step",
      structure: [
        "Pengenalan masalah",
        "Tools yang dibutuhkan",
        "Langkah-langkah detail",
        "Tips tambahan",
        "Kesimpulan",
      ],
      icon: BookIcon,
      example: "Cocok untuk: how-to guides, tutorial teknis, panduan praktis",
    },
    {
      id: "review",
      name: "Artikel Review",
      description: "Ulasan produk/layanan",
      structure: ["Pendahuluan produk", "Kelebihan", "Kekurangan", "Perbandingan", "Rekomendasi"],
      icon: StarIcon,
      example: "Cocok untuk: review produk, ulasan film, evaluasi layanan",
    },
    {
      id: "opini",
      name: "Artikel Opini",
      description: "Pendapat dan analisis",
      structure: ["Pernyataan thesis", "Argumen pendukung", "Contoh kasus", "Counter-argument", "Kesimpulan kuat"],
      icon: ArticleIcon,
      example: "Cocok untuk: editorial, analisis isu, pendapat pribadi",
    },
  ],
  "tugas-sekolah": [
    {
      id: "essay",
      name: "Essay Akademik",
      description: "Essay dengan struktur formal",
      structure: ["Pendahuluan + thesis", "Body paragraph 1", "Body paragraph 2", "Body paragraph 3", "Kesimpulan"],
      icon: ArticleIcon,
      example: "Cocok untuk: essay argumentatif, analisis sastra, tugas bahasa",
    },
    {
      id: "laporan",
      name: "Laporan Penelitian",
      description: "Format laporan ilmiah",
      structure: ["Abstrak", "Pendahuluan", "Metodologi", "Hasil & Pembahasan", "Kesimpulan & Saran"],
      icon: BriefcaseIcon,
      example: "Cocok untuk: laporan praktikum, penelitian sederhana, observasi",
    },
    {
      id: "analisis",
      name: "Analisis Kasus",
      description: "Analisis mendalam suatu topik",
      structure: ["Latar belakang", "Identifikasi masalah", "Analisis penyebab", "Dampak", "Solusi"],
      icon: TrendingUpIcon,
      example: "Cocok untuk: studi kasus, analisis sosial, evaluasi kebijakan",
    },
    {
      id: "presentasi",
      name: "Materi Presentasi",
      description: "Outline untuk presentasi",
      structure: ["Opening hook", "Agenda", "Poin utama 1-3", "Supporting data", "Call to action"],
      icon: UsersIcon,
      example: "Cocok untuk: presentasi kelas, proposal proyek, pitch ide",
    },
  ],
  "ringkasan-buku": [
    {
      id: "akademik",
      name: "Ringkasan Akademik",
      description: "Ringkasan untuk keperluan studi",
      structure: ["Informasi buku", "Thesis utama", "Poin-poin kunci", "Argumen penting", "Relevansi"],
      icon: BookIcon,
      example: "Cocok untuk: buku teks, jurnal akademik, referensi penelitian",
    },
    {
      id: "review-buku",
      name: "Review Buku",
      description: "Ulasan dan penilaian buku",
      structure: ["Sinopsis singkat", "Kelebihan", "Kekurangan", "Target pembaca", "Rating & rekomendasi"],
      icon: StarIcon,
      example: "Cocok untuk: novel, buku non-fiksi, buku pengembangan diri",
    },
    {
      id: "poin-utama",
      name: "Poin-Poin Utama",
      description: "Ekstrak insight penting",
      structure: ["Key takeaways", "Konsep penting", "Quotes memorable", "Actionable insights", "Aplikasi praktis"],
      icon: TrendingUpIcon,
      example: "Cocok untuk: buku bisnis, self-help, motivasi",
    },
  ],
  "caption-ig": [
    {
      id: "promosi",
      name: "Caption Promosi",
      description: "Untuk mempromosikan produk/jasa",
      structure: ["Hook menarik", "Benefit produk", "Social proof", "Call to action", "Hashtag relevan"],
      icon: TrendingUpIcon,
      example: "Cocok untuk: jualan online, promosi bisnis, launching produk",
    },
    {
      id: "storytelling",
      name: "Caption Storytelling",
      description: "Bercerita untuk engagement",
      structure: ["Opening menarik", "Konflik/tantangan", "Resolusi", "Lesson learned", "Question untuk audience"],
      icon: HeartIcon,
      example: "Cocok untuk: personal branding, sharing experience, motivasi",
    },
    {
      id: "motivasi",
      name: "Caption Motivasi",
      description: "Konten inspiratif dan motivasi",
      structure: ["Quote/statement kuat", "Penjelasan makna", "Contoh aplikasi", "Encouragement", "Hashtag motivasi"],
      icon: StarIcon,
      example: "Cocok untuk: daily motivation, quotes, inspirasi hidup",
    },
    {
      id: "lifestyle",
      name: "Caption Lifestyle",
      description: "Sharing aktivitas sehari-hari",
      structure: ["Situasi/moment", "Feeling/emotion", "Insight/reflection", "Relatable content", "Hashtag lifestyle"],
      icon: HeartIcon,
      example: "Cocok untuk: daily life, hobi, travel, food",
    },
  ],
  "email-formal": [
    {
      id: "lamaran",
      name: "Email Lamaran Kerja",
      description: "Surat lamaran via email",
      structure: ["Subject line profesional", "Salam pembuka", "Pengenalan diri", "Kualifikasi", "Penutup & lampiran"],
      icon: BriefcaseIcon,
      example: "Cocok untuk: melamar pekerjaan, internship, volunteer",
    },
    {
      id: "proposal",
      name: "Email Proposal Bisnis",
      description: "Proposal kerjasama bisnis",
      structure: ["Subject menarik", "Pengenalan singkat", "Proposal value", "Benefit mutual", "Next steps"],
      icon: TrendingUpIcon,
      example: "Cocok untuk: partnership, sponsorship, kerjasama bisnis",
    },
    {
      id: "komplain",
      name: "Email Komplain",
      description: "Menyampaikan keluhan formal",
      structure: [
        "Subject jelas",
        "Penjelasan masalah",
        "Dampak yang dialami",
        "Solusi yang diharapkan",
        "Penutup sopan",
      ],
      icon: AlertIcon,
      example: "Cocok untuk: komplain layanan, return produk, feedback negatif",
    },
    {
      id: "undangan",
      name: "Email Undangan",
      description: "Mengundang ke acara/meeting",
      structure: ["Subject dengan tanggal", "Tujuan acara", "Detail waktu & tempat", "Agenda", "RSVP"],
      icon: CalendarIcon,
      example: "Cocok untuk: meeting, webinar, event, gathering",
    },
  ],
}

interface TemplateSelectorProps {
  contentType: string
  selectedTemplate: string
  onTemplateChange: (templateId: string) => void
}

export function TemplateSelector({ contentType, selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const availableTemplates = templates[contentType as keyof typeof templates] || []

  if (availableTemplates.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {availableTemplates.map((template, index) => {
        const Icon = template.icon
        const isSelected = selectedTemplate === template.id

        return (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up border ${
              isSelected
                ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-400 shadow-md"
                : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isSelected ? "bg-blue-800 animate-pulse" : "bg-gray-700"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-blue-300" : "text-gray-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-white">{template.name}</h4>
                    {isSelected && (
                      <Badge variant="default" className="text-xs bg-blue-600 animate-bounce-in">
                        Dipilih
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{template.description}</p>
                  <p className="text-xs text-gray-400 italic">{template.example}</p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-blue-700 animate-slide-down">
                  <p className="text-xs font-medium text-blue-300 mb-2">Struktur Template:</p>
                  <ul className="text-xs text-blue-200 space-y-1">
                    {template.structure.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="w-4 h-4 bg-blue-700 text-blue-200 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform duration-200">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out both; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
      `}</style>
    </div>
  )
}
