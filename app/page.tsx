'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Spot = {
  id: string
  spot_name: string
  spot_type: string | null
  country: string
  city: string | null
  cost_amount: number | null
  cost_currency: string | null
  how_to_get_there: any
  tips: any
}

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('') // 修正: setSearchQUery → setSearchQuery
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    async function fetchSpots() {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching spots:', error)
      } else {
        setSpots(data || [])
      }
      setLoading(false)
    }

    fetchSpots()
  }, [])

  // フィルター処理
  const filteredSpots = spots.filter((spot) => {
    const matchesSearch = 
      searchQuery === '' ||
      spot.spot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.city && spot.city.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = 
      selectedType === 'all' || 
      spot.spot_type === selectedType

    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">読み込み中...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          🌏 Backpacker Spots
        </h1>
        <p className="text-center text-gray-600 mb-12">
          世界中のバックパッカーが共有する目的地情報
        </p>
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="🔍 国名、都市名、目的地名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全て
            </button>
            <button
              onClick={() => setSelectedType('hostel')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'hostel'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏠 ホステル
            </button>
            <button
              onClick={() => setSelectedType('temple')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'temple'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🛕 寺院
            </button>
            <button
              onClick={() => setSelectedType('street')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'street'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🛣️ ストリート
            </button>
          </div>
        </div>

        {filteredSpots.length === 0 ? (
          <p className="text-center text-gray-500">
            該当する目的地が見つかりません
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <Link
                href={`/spots/${spot.id}`}
                key={spot.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer block"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-800 flex-1">
                    📍 {spot.spot_name}
                  </h2>
                  {spot.spot_type && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {spot.spot_type}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    🌍 {spot.country}
                    {spot.city && `, ${spot.city}`}
                  </p>

                  {spot.cost_amount !== null && (
                    <p className="text-lg font-semibold text-green-600">
                      💰 {spot.cost_amount === 0 ? 'Free' : `${spot.cost_amount} ${spot.cost_currency || 'USD'}`}
                    </p>
                  )}

                  {spot.how_to_get_there?.ja && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-700 mb-1">
                        🚶 行き方:
                      </p>
                      <p className="text-gray-600 text-sm">
                        {spot.how_to_get_there.ja}
                      </p>
                    </div>
                  )}

                  {spot.tips?.ja && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-semibold text-gray-700 mb-1">
                        💡 ヒント:
                      </p>
                      <p className="text-gray-600 text-sm">
                        {spot.tips.ja}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}