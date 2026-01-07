'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Spot = {
  id: string
  spot_name: string
  spot_type: string | null
  country: string
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  cost_amount: number | null
  cost_currency: string | null
  how_to_get_there: any
  tips: any
  created_at: string
}

export default function SpotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [spot, setSpot] = useState<Spot | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'ja' | 'en'>('ja')

  useEffect(() => {
    async function fetchSpot() {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching spot:', error)
      } else {
        setSpot(data)
      }
      setLoading(false)
    }

    if (params.id) {
      fetchSpot()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">読み込み中...</p>
      </div>
    )
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl">目的地が見つかりませんでした</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          ← 一覧に戻る
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                📍 {spot.spot_name}
              </h1>
              {spot.spot_type && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {spot.spot_type}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('ja')}
                className={`px-4 py-2 rounded transition-colors ${
                  language === 'ja'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🇯🇵 日本語
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">🌍</span>
              <span className="text-lg">
                {spot.country}
                {spot.city && `, ${spot.city}`}
              </span>
            </div>

            {spot.address && (
              <div className="flex items-start gap-2 text-gray-700">
                <span className="text-2xl">📮</span>
                <span>{spot.address}</span>
              </div>
            )}

            {spot.cost_amount !== null && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="text-2xl font-bold text-green-600">
                  {spot.cost_amount === 0
                    ? 'Free'
                    : `${spot.cost_amount} ${spot.cost_currency || 'USD'}`}
                </span>
              </div>
            )}

            {(spot.latitude !== null && spot.longitude !== null) && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-2xl">🗺️</span>
                <span>
                  緯度: {spot.latitude}, 経度: {spot.longitude}
                </span>
              </div>
            )}
          </div>

          {spot.how_to_get_there?.[language] && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                🚶 行き方
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {spot.how_to_get_there[language]}
              </p>
            </div>
          )}

          {spot.tips?.[language] && (
            <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                💡 おすすめポイント・ヒント
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {spot.tips[language]}
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500 pt-6 border-t border-gray-200">
            投稿日: {new Date(spot.created_at).toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>
    </main>
  )
}