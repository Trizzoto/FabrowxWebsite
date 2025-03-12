"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const serviceTypes = [
  "Custom Fabrication",
  "Performance Upgrades",
  "4WD Modifications",
  "Exhaust Systems",
  "Roll Cages",
  "Prototyping",
]

export default function JobBookingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    serviceType: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book a job.",
        variant: "destructive",
      })
      router.push("/login?redirect=/job-booking")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit job booking")
      }

      const data = await response.json()

      toast({
        title: "Job booking submitted",
        description: "We have received your job booking request and will contact you soon.",
      })

      router.push(`/account/jobs/${data._id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit job booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Book a <span className="text-blue-500">Job</span>
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Fill out the form below to request a custom fabrication job or service for your vehicle.
        </p>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Job Booking Request</CardTitle>
            <CardDescription>Please provide details about your vehicle and the service you need.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="vehicleMake" className="text-sm font-medium">
                    Vehicle Make
                  </label>
                  <Input
                    id="vehicleMake"
                    name="vehicleMake"
                    placeholder="e.g., Toyota, Ford"
                    value={formData.vehicleMake}
                    onChange={handleChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="vehicleModel" className="text-sm font-medium">
                    Vehicle Model
                  </label>
                  <Input
                    id="vehicleModel"
                    name="vehicleModel"
                    placeholder="e.g., Landcruiser, Ranger"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="vehicleYear" className="text-sm font-medium">
                    Vehicle Year
                  </label>
                  <Input
                    id="vehicleYear"
                    name="vehicleYear"
                    placeholder="e.g., 2020"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="serviceType" className="text-sm font-medium">
                  Service Type
                </label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleSelectChange("serviceType", value)}
                  required
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Job Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the job you need done in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] bg-zinc-800 border-zinc-700"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Job Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

