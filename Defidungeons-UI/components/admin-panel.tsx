"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Coins, UserCheck, UserX } from "lucide-react"

interface AdminPanelProps {
  walletAddress: string
}

export function AdminPanel({ walletAddress }: AdminPanelProps) {
  const { toast } = useToast()
  const [newTokenAddress, setNewTokenAddress] = useState("")
  const [newOwnerAddress, setNewOwnerAddress] = useState("")
  const [pendingOwner, setPendingOwner] = useState<string | null>(null)
  const [isSubmittingToken, setIsSubmittingToken] = useState(false)
  const [isSubmittingOwner, setIsSubmittingOwner] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // Mock function to set allowed token
  const setAllowedToken = async () => {
    if (!newTokenAddress) return

    setIsSubmittingToken(true)

    try {
      // In a real app, this would call the smart contract
      // Example: await contractCall('set-allowed-token', ...)
      setTimeout(() => {
        setIsSubmittingToken(false)
        setNewTokenAddress("")
        toast({
          title: "Token Updated",
          description: `Allowed token has been updated to ${newTokenAddress}`,
        })
      }, 1500)
    } catch (error) {
      console.error("Failed to set allowed token:", error)
      setIsSubmittingToken(false)
      toast({
        title: "Transaction Failed",
        description: "Failed to update allowed token. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Mock function to initiate ownership transfer
  const initiateOwnershipTransfer = async () => {
    if (!newOwnerAddress) return

    setIsSubmittingOwner(true)

    try {
      // In a real app, this would call the smart contract
      // Example: await contractCall('initiate-contract-ownership-transfer', ...)
      setTimeout(() => {
        setIsSubmittingOwner(false)
        setPendingOwner(newOwnerAddress)
        setNewOwnerAddress("")
        toast({
          title: "Ownership Transfer Initiated",
          description: `Ownership transfer to ${newOwnerAddress} has been initiated.`,
        })
      }, 1500)
    } catch (error) {
      console.error("Failed to initiate ownership transfer:", error)
      setIsSubmittingOwner(false)
      toast({
        title: "Transaction Failed",
        description: "Failed to initiate ownership transfer. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Mock function to cancel ownership transfer
  const cancelOwnershipTransfer = async () => {
    if (!pendingOwner) return

    setIsCancelling(true)

    try {
      // In a real app, this would call the smart contract
      // Example: await contractCall('cancel-contract-ownership-transfer', ...)
      setTimeout(() => {
        setIsCancelling(false)
        setPendingOwner(null)
        toast({
          title: "Ownership Transfer Cancelled",
          description: "Pending ownership transfer has been cancelled.",
        })
      }, 1500)
    } catch (error) {
      console.error("Failed to cancel ownership transfer:", error)
      setIsCancelling(false)
      toast({
        title: "Transaction Failed",
        description: "Failed to cancel ownership transfer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Controls</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            Token Management
          </CardTitle>
          <CardDescription>Update the allowed token for the DeFi Dungeons contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current Allowed Token:</span>
              <span className="font-mono">SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token</span>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="token-address" className="text-sm">
                New Token Contract Address:
              </label>
              <Input
                id="token-address"
                value={newTokenAddress}
                onChange={(e) => setNewTokenAddress(e.target.value)}
                placeholder="SP..."
                className="bg-gray-900 border-gray-700"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={setAllowedToken} disabled={isSubmittingToken || !newTokenAddress} className="w-full">
            {isSubmittingToken ? "Updating..." : "Update Token"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-amber-400" />
            Ownership Management
          </CardTitle>
          <CardDescription>Transfer ownership of the DeFi Dungeons contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current Owner:</span>
              <span className="font-mono">{walletAddress}</span>
            </div>

            {pendingOwner && (
              <div className="flex justify-between text-sm">
                <span>Pending Owner:</span>
                <span className="font-mono">{pendingOwner}</span>
              </div>
            )}

            <Separator className="bg-gray-700" />

            <div className="flex flex-col space-y-2">
              <label htmlFor="owner-address" className="text-sm">
                New Owner Address:
              </label>
              <Input
                id="owner-address"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                placeholder="SP..."
                className="bg-gray-900 border-gray-700"
                disabled={!!pendingOwner}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {pendingOwner ? (
            <Button onClick={cancelOwnershipTransfer} disabled={isCancelling} variant="destructive" className="w-full">
              <UserX className="h-4 w-4 mr-2" />
              {isCancelling ? "Cancelling..." : "Cancel Ownership Transfer"}
            </Button>
          ) : (
            <Button
              onClick={initiateOwnershipTransfer}
              disabled={isSubmittingOwner || !newOwnerAddress}
              className="w-full"
            >
              {isSubmittingOwner ? "Initiating..." : "Initiate Ownership Transfer"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

