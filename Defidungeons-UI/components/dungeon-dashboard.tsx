"use client"

import { useState, useEffect } from "react"
import { ConnectWallet } from "@/components/connect-wallet"
import { PlayerStats } from "@/components/player-stats"
import { DungeonActions } from "@/components/dungeon-actions"
import { AdminPanel } from "@/components/admin-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sword, Shield, Crown } from "lucide-react"

export function DungeonDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isContractOwner, setIsContractOwner] = useState(false)

  // Mock function to check if user is contract owner
  // In a real app, this would query the contract
  useEffect(() => {
    if (walletAddress) {
      // This is a mock - in reality you would check against the contract
      setIsContractOwner(walletAddress === "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9")
    }
  }, [walletAddress])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-amber-400">DeFi Dungeons</h1>
        <p className="text-center text-gray-300 mb-6">Battle monsters, complete quests, earn rewards</p>

        <ConnectWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      </header>

      {walletAddress ? (
        <Tabs defaultValue="dungeon" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dungeon" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              <span>Dungeon</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Stats</span>
            </TabsTrigger>
            {isContractOwner && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dungeon" className="space-y-4">
            <DungeonActions walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <PlayerStats walletAddress={walletAddress} />
          </TabsContent>

          {isContractOwner && (
            <TabsContent value="admin" className="space-y-4">
              <AdminPanel walletAddress={walletAddress} />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Connect your wallet to begin your adventure</h2>
          <p className="text-gray-400 mb-6">Join the quest, defeat monsters, and earn rewards in the DeFi Dungeons</p>
        </div>
      )}
    </div>
  )
}

