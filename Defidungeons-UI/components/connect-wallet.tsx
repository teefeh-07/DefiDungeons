"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

interface ConnectWalletProps {
  walletAddress: string | null
  setWalletAddress: (address: string | null) => void
}

export function ConnectWallet({ walletAddress, setWalletAddress }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // Mock wallet connection - in a real app, you would use a Stacks wallet library
      // For example: @stacks/connect
      setTimeout(() => {
        setWalletAddress("SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9")
        setIsConnecting(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
  }

  return (
    <div className="flex justify-center">
      {walletAddress ? (
        <div className="flex items-center gap-4 bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-mono">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={disconnectWallet} className="text-gray-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet} disabled={isConnecting} className="bg-amber-500 hover:bg-amber-600 text-black">
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  )
}

