"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, Clock, Coins } from "lucide-react"

interface PlayerStatsProps {
  walletAddress: string
}

interface PlayerStats {
  lastDungeonBlock: number
  totalDungeonsCompleted: number
  totalRewardsEarned: number
  currentBlock: number
}

export function PlayerStats({ walletAddress }: PlayerStatsProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock function to fetch player stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      try {
        // In a real app, this would call the smart contract
        // Example: await contractCall('get-player-dungeon-stats', ...)
        setTimeout(() => {
          setStats({
            lastDungeonBlock: 7900,
            totalDungeonsCompleted: 5,
            totalRewardsEarned: 1000,
            currentBlock: 8000,
          })
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Failed to fetch player stats:", error)
        setLoading(false)
      }
    }

    if (walletAddress) {
      fetchStats()
    }
  }, [walletAddress])

  const calculateCooldown = () => {
    if (!stats) return 0

    const blocksPassed = stats.currentBlock - stats.lastDungeonBlock
    const cooldownBlocks = 100 // From contract constant

    if (blocksPassed >= cooldownBlocks) return 0
    return cooldownBlocks - blocksPassed
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Dungeon Stats</h2>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Dungeons Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalDungeonsCompleted || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Total quests completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-400" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.totalRewardsEarned || 0}</p>
              <p className="text-xs text-gray-400 mt-1">Total tokens earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Cooldown Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateCooldown()}</p>
              <p className="text-xs text-gray-400 mt-1">Blocks until next dungeon</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent dungeon activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-700">
                    <Skeleton className="h-5 w-32 bg-gray-700" />
                    <Skeleton className="h-5 w-20 bg-gray-700" />
                  </div>
                ))
            ) : stats?.totalDungeonsCompleted ? (
              <>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-sm">Completed Dungeon</span>
                  <span className="text-sm text-green-400">+200 tokens</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-sm">Entered Dungeon</span>
                  <span className="text-sm text-red-400">-100 tokens</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-sm">Completed Dungeon</span>
                  <span className="text-sm text-green-400">+200 tokens</span>
                </div>
              </>
            ) : (
              <p className="text-center py-4 text-gray-400">No transaction history found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

