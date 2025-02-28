"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Swords, Trophy, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DungeonActionsProps {
  walletAddress: string
}

export function DungeonActions({ walletAddress }: DungeonActionsProps) {
  const { toast } = useToast()
  const [isEntering, setIsEntering] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [inDungeon, setInDungeon] = useState(false)
  const [cooldownProgress, setCooldownProgress] = useState(100)

  // Mock function to enter dungeon
  const enterDungeon = async () => {
    setIsEntering(true)

    try {
      // In a real app, this would call the smart contract
      // Example: await contractCall('enter-dungeon', ...)
      setTimeout(() => {
        setIsEntering(false)
        setInDungeon(true)
        toast({
          title: "Dungeon Entered",
          description: "You've entered the dungeon. Defeat monsters to earn rewards!",
        })

        // Simulate cooldown
        setCooldownProgress(0)
        const interval = setInterval(() => {
          setCooldownProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 1
          })
        }, 100) // Faster for demo purposes
      }, 1500)
    } catch (error) {
      console.error("Failed to enter dungeon:", error)
      setIsEntering(false)
      toast({
        title: "Transaction Failed",
        description: "Failed to enter dungeon. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Mock function to complete dungeon
  const completeDungeon = async () => {
    setIsCompleting(true)

    try {
      // In a real app, this would call the smart contract
      // Example: await contractCall('complete-dungeon', ...)
      setTimeout(() => {
        setIsCompleting(false)
        setInDungeon(false)
        toast({
          title: "Dungeon Completed",
          description: "Congratulations! You've earned 200 tokens as a reward.",
        })
      }, 1500)
    } catch (error) {
      console.error("Failed to complete dungeon:", error)
      setIsCompleting(false)
      toast({
        title: "Transaction Failed",
        description: "Failed to complete dungeon. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-amber-400" />
            Enter Dungeon
          </CardTitle>
          <CardDescription>Pay 100 tokens to enter the dungeon and start your quest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Entry Cost:</span>
              <span className="font-semibold">100 Tokens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cooldown Period:</span>
              <span className="font-semibold">100 Blocks</span>
            </div>
            {cooldownProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-amber-400" />
                    Cooldown:
                  </span>
                  <span>{cooldownProgress}%</span>
                </div>
                <Progress value={cooldownProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={enterDungeon}
            disabled={isEntering || inDungeon || cooldownProgress < 100}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black"
          >
            {isEntering ? "Entering..." : inDungeon ? "Already in Dungeon" : "Enter Dungeon"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Complete Quest
          </CardTitle>
          <CardDescription>Complete your dungeon quest to earn token rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Reward Amount:</span>
              <span className="font-semibold">200 Tokens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <span className={`font-semibold ${inDungeon ? "text-green-400" : "text-red-400"}`}>
                {inDungeon ? "In Dungeon" : "Not in Dungeon"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={completeDungeon}
            disabled={isCompleting || !inDungeon}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isCompleting ? "Completing..." : "Complete Quest"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

