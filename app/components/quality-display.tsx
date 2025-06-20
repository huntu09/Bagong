"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react"
import type { QualityAnalysis } from "../lib/content-quality-analyzer"

interface QualityDisplayProps {
  analysis: QualityAnalysis
  className?: string
}

export function QualityDisplay({ analysis, className = "" }: QualityDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default"
    if (score >= 6) return "secondary"
    return "destructive"
  }

  return (
    <Card className={`${className} bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analisis Kualitas Konten
          </span>
          <Badge variant={getScoreBadgeVariant(analysis.score.overall)} className="text-lg px-3 py-1">
            {analysis.score.overall}/10
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(analysis.score.overall)}`}>
            {analysis.score.overall}/10
          </div>
          <p className="text-gray-400 text-sm mt-1">Skor Keseluruhan</p>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Keterbacaan</span>
              <span className={getScoreColor(analysis.score.readability)}>{analysis.score.readability}/10</span>
            </div>
            <Progress value={analysis.score.readability * 10} className="h-2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Struktur</span>
              <span className={getScoreColor(analysis.score.structure)}>{analysis.score.structure}/10</span>
            </div>
            <Progress value={analysis.score.structure * 10} className="h-2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Engagement</span>
              <span className={getScoreColor(analysis.score.engagement)}>{analysis.score.engagement}/10</span>
            </div>
            <Progress value={analysis.score.engagement * 10} className="h-2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">SEO</span>
              <span className={getScoreColor(analysis.score.seo)}>{analysis.score.seo}/10</span>
            </div>
            <Progress value={analysis.score.seo * 10} className="h-2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Originalitas</span>
              <span className={getScoreColor(analysis.score.originality)}>{analysis.score.originality}/10</span>
            </div>
            <Progress value={analysis.score.originality * 10} className="h-2 bg-gray-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Akurasi</span>
              <span className={getScoreColor(analysis.score.factualAccuracy)}>{analysis.score.factualAccuracy}/10</span>
            </div>
            <Progress value={analysis.score.factualAccuracy * 10} className="h-2 bg-gray-700" />
          </div>
        </div>

        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <Alert className="bg-green-900/20 border-green-700">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>Kelebihan:</strong>
              <ul className="mt-1 space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm">
                    • {strength}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <Alert className="bg-blue-900/20 border-blue-700">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              <strong>Saran Perbaikan:</strong>
              <ul className="mt-1 space-y-1">
                {analysis.suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="text-sm">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <Alert className="bg-yellow-900/20 border-yellow-700">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              <strong>Peringatan:</strong>
              <ul className="mt-1 space-y-1">
                {analysis.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
