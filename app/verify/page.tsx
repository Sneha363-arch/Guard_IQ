"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, CheckCircle, XCircle, ArrowLeft, Lock, Fingerprint, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface VIPUser {
  fullName: string
  email: string
  role: string
  platform: string
  followers: number
  verificationStatus: string
}

interface VerificationResponse {
  success: boolean
  message: string
  user?: VIPUser
  blocked?: boolean
}

export default function VIPVerification() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    platform: "",
    followers: "",
  })
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | "blocked" | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifiedUser, setVerifiedUser] = useState<VIPUser | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVerification = async () => {
    setIsVerifying(true)
    setVerificationResult(null)
    setErrorMessage("")
    setVerifiedUser(null)

    try {
      const response = await fetch("http://localhost:5000/api/verify-vip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          followers: Number.parseInt(formData.followers) || 0,
        }),
      })

      const data: VerificationResponse = await response.json()

      if (data.blocked) {
        setVerificationResult("blocked")
        setErrorMessage(data.message)
      } else if (data.success && data.user) {
        setVerificationResult("success")
        setVerifiedUser(data.user)
      } else {
        setVerificationResult("error")
        setErrorMessage(data.message || "You're not a VIP")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationResult("error")
      setErrorMessage("Unable to connect to verification service. Please try again later.")
    } finally {
      setIsVerifying(false)
    }
  }

  const isFormValid = formData.fullName && formData.email && formData.role && formData.platform && formData.followers

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-400" />
                <Eye className="h-4 w-4 text-cyan-400 absolute" />
              </div>
              <span className="text-2xl font-bold text-white">GuardIQ</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                <div className="relative bg-slate-800/50 p-6 rounded-full border border-blue-500/30">
                  <Fingerprint className="h-12 w-12 text-blue-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              VIP <span className="text-blue-400">Authentication</span>
            </h1>
            <p className="text-lg text-slate-300 mb-4">Secure Identity Verification Protocol</p>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-amber-300 text-sm font-medium">🔒 Quantum-encrypted verification process</p>
            </div>
          </div>

          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Lock className="h-6 w-6 text-cyan-400" />
                <CardTitle className="text-white text-2xl">Identity Verification</CardTitle>
              </div>
              <CardDescription className="text-slate-300">
                Complete all fields for secure authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-white font-semibold flex items-center space-x-2">
                    <span>Legal Full Name</span>
                    <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="As registered in official documents"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white font-semibold flex items-center space-x-2">
                    <span>Primary Email Address</span>
                    <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.official@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="role" className="text-white font-semibold flex items-center space-x-2">
                    <span>Select Role/Category</span>
                    <span className="text-red-400">*</span>
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-12 text-base">
                      <SelectValue placeholder="Choose your category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="influencer" className="text-white hover:bg-slate-700">
                        Influencer
                      </SelectItem>
                      <SelectItem value="celebrity" className="text-white hover:bg-slate-700">
                        Celebrity
                      </SelectItem>
                      <SelectItem value="vip" className="text-white hover:bg-slate-700">
                        VIP
                      </SelectItem>
                      <SelectItem value="executive" className="text-white hover:bg-slate-700">
                        Executive
                      </SelectItem>
                      <SelectItem value="content-creator" className="text-white hover:bg-slate-700">
                        Content Creator
                      </SelectItem>
                      <SelectItem value="public-figure" className="text-white hover:bg-slate-700">
                        Public Figure
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="platform" className="text-white font-semibold flex items-center space-x-2">
                    <span>Official Social Media Platform</span>
                    <span className="text-red-400">*</span>
                  </Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-12 text-base">
                      <SelectValue placeholder="Select your primary platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="twitter" className="text-white hover:bg-slate-700">
                        Twitter/X
                      </SelectItem>
                      <SelectItem value="instagram" className="text-white hover:bg-slate-700">
                        Instagram
                      </SelectItem>
                      <SelectItem value="youtube" className="text-white hover:bg-slate-700">
                        YouTube
                      </SelectItem>
                      <SelectItem value="tiktok" className="text-white hover:bg-slate-700">
                        TikTok
                      </SelectItem>
                      <SelectItem value="linkedin" className="text-white hover:bg-slate-700">
                        LinkedIn
                      </SelectItem>
                      <SelectItem value="facebook" className="text-white hover:bg-slate-700">
                        Facebook
                      </SelectItem>
                      <SelectItem value="twitch" className="text-white hover:bg-slate-700">
                        Twitch
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="followers" className="text-white font-semibold flex items-center space-x-2">
                    <span>Followers Count</span>
                    <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="followers"
                    type="number"
                    placeholder="Enter your follower count"
                    value={formData.followers}
                    onChange={(e) => handleInputChange("followers", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-12 text-base"
                    min="0"
                  />
                  <p className="text-slate-400 text-xs">Enter your current follower count on the selected platform</p>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleVerification}
                  disabled={!isFormValid || isVerifying}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-14"
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Authenticating Identity...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Fingerprint className="h-6 w-6" />
                      <span>Initiate Verification Protocol</span>
                    </div>
                  )}
                </Button>
              </div>

              {verificationResult && (
                <div className="mt-8">
                  {verificationResult === "success" && verifiedUser ? (
                    <Card className="bg-green-500/10 border-green-500/30 shadow-lg">
                      <CardContent className="py-8">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                          <CheckCircle className="h-10 w-10 text-green-400" />
                          <div className="text-center">
                            <span className="text-green-300 text-xl font-semibold block">Verified as VIP</span>
                            <span className="text-green-400 text-sm">VIP Status Confirmed</span>
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Name:</span>
                              <span className="text-white ml-2">{verifiedUser.fullName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Role:</span>
                              <span className="text-white ml-2 capitalize">{verifiedUser.role}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Platform:</span>
                              <span className="text-cyan-400 ml-2 capitalize">{verifiedUser.platform}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Followers:</span>
                              <span className="text-white ml-2">{verifiedUser.followers.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : verificationResult === "blocked" ? (
                    <Card className="bg-orange-500/10 border-orange-500/30 shadow-lg">
                      <CardContent className="flex items-center justify-center space-x-4 py-8">
                        <AlertTriangle className="h-10 w-10 text-orange-400" />
                        <div className="text-center">
                          <span className="text-orange-300 text-xl font-semibold block">
                            Account Temporarily Locked
                          </span>
                          <span className="text-orange-400 text-sm">{errorMessage}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-red-500/10 border-red-500/30 shadow-lg">
                      <CardContent className="flex items-center justify-center space-x-4 py-8">
                        <XCircle className="h-10 w-10 text-red-400" />
                        <div className="text-center">
                          <span className="text-red-300 text-xl font-semibold block">You're not a VIP</span>
                          <span className="text-red-400 text-sm">{errorMessage || "VIP Status Not Verified"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
