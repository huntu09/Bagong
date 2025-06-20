"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// SVG Icons
import {
  MenuIcon,
  CloseIcon,
  StarIcon,
  ShareIcon,
  ShieldIcon,
  DocumentIcon,
  PenToolIcon,
  ExternalLinkIcon,
} from "../icons"

interface NavbarProps {
  onMenuToggle?: (isOpen: boolean) => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const toggleMenu = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)
    onMenuToggle?.(newState)
  }

  const handleMenuItemClick = (item: string) => {
    setActiveModal(item)
    setIsMenuOpen(false)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const menuItems = [
    {
      id: "rate",
      label: "Rate App",
      icon: StarIcon,
      description: "Berikan rating untuk aplikasi ini",
      action: () => handleMenuItemClick("rate"),
    },
    {
      id: "share",
      label: "Share App",
      icon: ShareIcon,
      description: "Bagikan aplikasi ke teman-teman",
      action: () => handleMenuItemClick("share"),
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: ShieldIcon,
      description: "Kebijakan privasi aplikasi",
      action: () => handleMenuItemClick("privacy"),
    },
    {
      id: "terms",
      label: "Terms of Service",
      icon: DocumentIcon,
      description: "Syarat dan ketentuan layanan",
      action: () => handleMenuItemClick("terms"),
    },
    {
      id: "about",
      label: "About Us",
      icon: DocumentIcon,
      description: "Tentang AI Writer Pro",
      action: () => handleMenuItemClick("about"),
    },
    {
      id: "contact",
      label: "Contact Us",
      icon: ShareIcon,
      description: "Hubungi tim kami",
      action: () => handleMenuItemClick("contact"),
    },
  ]

  return (
    <>
      {/* Navbar - Dark Theme */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-700 shadow-sm">
        {/* Safe area untuk mobile browser */}
        <div className="h-safe-top bg-black/95"></div>

        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-18 py-2">
            {/* Left side - Logo and Hamburger */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={isMenuOpen}
                aria-controls="sidebar-menu"
              >
                <div className="relative">
                  {isMenuOpen ? (
                    <CloseIcon size="lg" className="text-blue-400 animate-spin-in" />
                  ) : (
                    <MenuIcon size="lg" className="text-blue-400 animate-fade-in" />
                  )}
                </div>
              </Button>

              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:scale-110 transition-transform duration-300 animate-glow">
                  <PenToolIcon size="xl" className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="block">
                  <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                    AI Writer Pro
                  </h1>
                  <p className="text-xs text-gray-300 leading-tight">Smart Content Generator</p>
                </div>
              </div>
            </div>

            {/* Right side - Version Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Badge variant="outline" className="hidden sm:flex animate-pulse text-xs border-gray-600 text-gray-300">
                v1.0.0
              </Badge>
              <Badge variant="secondary" className="bg-green-900 text-green-300 animate-bounce-slow text-xs">
                ✨ Free
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu - Dark Theme */}
      <div
        id="sidebar-menu"
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Menu navigasi utama"
      >
        {/* Safe area untuk mobile */}
        <div className="h-safe-top bg-gradient-to-r from-gray-800 to-gray-900"></div>

        <div className="p-4 sm:p-6 pt-4 sm:pt-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg animate-glow">
              <PenToolIcon size="xl" className="text-white h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">AI Writer Pro</h2>
              <p className="text-sm text-gray-300">Smart Content Generator</p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-md group animate-slide-in text-left"
                style={{ animationDelay: `${index * 0.1}s` }}
                aria-label={item.description}
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors duration-200">
                  <Icon className="text-gray-300 group-hover:text-blue-400" size="md" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 text-sm sm:text-base">
                    {item.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">{item.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">AI</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">Powered by AI</p>
                <p className="text-xs sm:text-sm text-gray-400">OpenAI GPT-4</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Tutup menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMenuOpen(false)
            }
          }}
        />
      )}

      {/* Modals - Dark Theme */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card
            className="w-full max-w-md animate-scale-in bg-gray-900 border-gray-700"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <CardHeader className="bg-gray-900">
              <CardTitle id="modal-title" className="flex items-center gap-2 text-white">
                {activeModal === "rate" && <StarIcon size="md" className="text-yellow-400" />}
                {activeModal === "share" && <ShareIcon size="md" className="text-blue-400" />}
                {activeModal === "privacy" && <ShieldIcon size="md" className="text-green-400" />}
                {activeModal === "terms" && <DocumentIcon size="md" className="text-purple-400" />}
                {activeModal === "rate" && "Rate AI Writer Pro"}
                {activeModal === "share" && "Share AI Writer Pro"}
                {activeModal === "privacy" && "Privacy Policy"}
                {activeModal === "terms" && "Terms of Service"}
                {activeModal === "about" && "About Us"}
                {activeModal === "contact" && "Contact Us"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-gray-900">
              {activeModal === "rate" && (
                <div className="text-center space-y-4">
                  <p className="text-white font-medium">Bagaimana pengalaman Anda menggunakan AI Writer Pro?</p>
                  <div className="flex justify-center gap-2" role="group" aria-label="Rating bintang">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="p-2 hover:scale-125 transition-transform duration-200"
                        aria-label={`Berikan rating ${star} bintang`}
                      >
                        <StarIcon size="xl" className="h-8 w-8 text-yellow-400 hover:text-yellow-300" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open("https://play.google.com/store", "_blank")}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      aria-label="Buka Google Play Store"
                    >
                      <ExternalLinkIcon size="sm" className="h-4 w-4 mr-2" />
                      Play Store
                    </Button>
                    <Button
                      onClick={() => window.open("https://apps.apple.com", "_blank")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      aria-label="Buka Apple App Store"
                    >
                      <ExternalLinkIcon size="sm" className="h-4 w-4 mr-2" />
                      App Store
                    </Button>
                  </div>
                </div>
              )}

              {activeModal === "share" && (
                <div className="space-y-4">
                  <p className="text-white font-medium">Bagikan AI Writer Pro dengan teman-teman Anda!</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=Coba AI Writer Pro - Generator konten AI yang keren! ${window.location.href}`,
                          "_blank",
                        )
                      }
                      className="bg-green-600 hover:bg-green-700"
                      aria-label="Bagikan ke WhatsApp"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?text=Coba AI Writer Pro - Generator konten AI yang amazing!&url=${window.location.href}`,
                          "_blank",
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600"
                      aria-label="Bagikan ke Twitter"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")
                      }
                      className="bg-blue-700 hover:bg-blue-800"
                      aria-label="Bagikan ke Facebook"
                    >
                      Facebook
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        alert("Link berhasil disalin!")
                      }}
                      variant="outline"
                      className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      aria-label="Salin link"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              )}

              {activeModal === "privacy" && (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 text-sm text-gray-300">
                    <h3 className="font-semibold text-white">Kebijakan Privasi</h3>
                    <p>
                      <strong className="text-white">1. Pengumpulan Data:</strong> Kami hanya mengumpulkan data yang
                      diperlukan untuk memberikan layanan terbaik kepada Anda.
                    </p>
                    <p>
                      <strong className="text-white">2. Penggunaan Data:</strong> Data Anda digunakan untuk meningkatkan
                      kualitas layanan AI dan personalisasi konten.
                    </p>
                    <p>
                      <strong className="text-white">3. Keamanan:</strong> Kami menggunakan enkripsi tingkat enterprise
                      untuk melindungi data Anda.
                    </p>
                    <p>
                      <strong className="text-white">4. Berbagi Data:</strong> Kami tidak akan membagikan data pribadi
                      Anda kepada pihak ketiga tanpa persetujuan.
                    </p>
                    <p>
                      <strong className="text-white">5. Hak Anda:</strong> Anda memiliki hak untuk mengakses, mengubah,
                      atau menghapus data pribadi Anda.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "terms" && (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 text-sm text-gray-300">
                    <h3 className="font-semibold text-white">Syarat dan Ketentuan</h3>
                    <p>
                      <strong className="text-white">1. Penggunaan Layanan:</strong> Dengan menggunakan AI Writer Pro,
                      Anda setuju untuk mematuhi semua syarat dan ketentuan yang berlaku.
                    </p>
                    <p>
                      <strong className="text-white">2. Konten yang Dihasilkan:</strong> Anda bertanggung jawab atas
                      konten yang dihasilkan dan penggunaannya.
                    </p>
                    <p>
                      <strong className="text-white">3. Batasan Penggunaan:</strong> Layanan ini tidak boleh digunakan
                      untuk konten yang melanggar hukum atau merugikan pihak lain.
                    </p>
                    <p>
                      <strong className="text-white">4. Kekayaan Intelektual:</strong> Semua hak kekayaan intelektual
                      aplikasi ini adalah milik pengembang.
                    </p>
                    <p>
                      <strong className="text-white">5. Perubahan Layanan:</strong> Kami berhak mengubah atau
                      menghentikan layanan kapan saja dengan pemberitahuan sebelumnya.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "about" && (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 text-sm text-gray-300">
                    <h3 className="font-semibold text-white">Tentang AI Writer Pro</h3>
                    <p>
                      <strong className="text-white">Visi:</strong> Menjadi platform AI terdepan untuk membantu content
                      creator menghasilkan konten berkualitas tinggi dengan mudah dan efisien.
                    </p>
                    <p>
                      <strong className="text-white">Misi:</strong> Memberikan akses teknologi AI terdepan kepada semua
                      orang untuk meningkatkan produktivitas dan kreativitas dalam pembuatan konten.
                    </p>
                    <p>
                      <strong className="text-white">Tim Kami:</strong> Dikembangkan oleh tim ahli AI dan pengembang
                      berpengalaman yang berdedikasi untuk inovasi teknologi.
                    </p>
                    <p>
                      <strong className="text-white">Teknologi:</strong> Menggunakan GPT-4 dan teknologi AI terdepan
                      untuk menghasilkan konten yang akurat dan relevan.
                    </p>
                    <p>
                      <strong className="text-white">Komitmen:</strong> Kami berkomitmen untuk terus mengembangkan
                      fitur-fitur inovatif dan menjaga kualitas layanan terbaik.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "contact" && (
                <div className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-300">
                    <h3 className="font-semibold text-white">Hubungi Kami</h3>
                    <div className="space-y-2">
                      <p>
                        <strong className="text-white">Email:</strong> support@aiwriterpro.com
                      </p>
                      <p>
                        <strong className="text-white">WhatsApp:</strong> +62 812-3456-7890
                      </p>
                      <p>
                        <strong className="text-white">Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold text-white mb-2">Kirim Pesan</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nama Anda"
                          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
                        />
                        <input
                          type="email"
                          placeholder="Email Anda"
                          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
                        />
                        <textarea
                          placeholder="Pesan Anda"
                          rows={3}
                          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Tutup
                </Button>
                {activeModal === "rate" && (
                  <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium">
                    Kirim Rating
                  </Button>
                )}
                {activeModal === "about" && (
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Pelajari Lebih Lanjut
                  </Button>
                )}
                {activeModal === "contact" && (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium">Kirim Pesan</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        /* Safe area untuk mobile browser */
        .h-safe-top {
          height: env(safe-area-inset-top, 20px);
          min-height: 20px;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes spin-in {
          from { opacity: 0; transform: rotate(-180deg); }
          to { opacity: 1; transform: rotate(0deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out both; }
        .animate-spin-in { animation: spin-in 0.3s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </>
  )
}
