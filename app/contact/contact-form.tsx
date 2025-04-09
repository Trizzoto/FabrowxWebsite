"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Topic {
  value: string
  label: string
}

interface ContactFormProps {
  topics?: Topic[]
}

const defaultTopics: Topic[] = [
  { value: "custom-fabrication", label: "Custom Fabrication" },
  { value: "welding", label: "Welding Services" },
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "consultation", label: "Project Consultation" },
  { value: "other", label: "Other" },
]

export function ContactForm({ topics = defaultTopics }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    preferredContact: "email"
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // TODO: Add actual form submission logic
  }

  if (!mounted) {
    return (
      <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
        <CardContent>
          <div className="h-[600px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-800 border-zinc-700 shadow-lg">
      <CardContent>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-zinc-300">Name *</Label>
            <Input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your full name"
              className="bg-zinc-900 border-zinc-700 text-white focus:border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-zinc-300">Email *</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your.email@example.com"
              className="bg-zinc-900 border-zinc-700 text-white focus:border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="text-zinc-300">Phone Number</Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Your phone number"
              className="bg-zinc-900 border-zinc-700 text-white focus:border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <div id="contact-method-group" className="text-zinc-300 block mb-2">Preferred Contact Method *</div>
            <RadioGroup
              value={formData.preferredContact}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredContact: value })
              }
              className="flex space-x-4"
              aria-labelledby="contact-method-group"
              name="preferredContact"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="email" 
                  id="r-email"
                  aria-label="Email contact method"
                  className="text-orange-500 border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0" 
                />
                <Label 
                  htmlFor="r-email" 
                  className="text-zinc-300 cursor-pointer"
                >
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="phone" 
                  id="r-phone"
                  aria-label="Phone contact method"
                  className="text-orange-500 border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0" 
                />
                <Label 
                  htmlFor="r-phone" 
                  className="text-zinc-300 cursor-pointer"
                >
                  Phone
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-topic" className="text-zinc-300">Topic *</Label>
            <Select
              value={formData.topic}
              onValueChange={(value) =>
                setFormData({ ...formData, topic: value })
              }
              name="topic"
              required
            >
              <SelectTrigger 
                id="contact-topic" 
                aria-label="Select a topic for your inquiry"
                className="bg-zinc-900 border-zinc-700 text-white focus:border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                {topics.map((topic) => (
                  <SelectItem 
                    key={topic.value} 
                    value={topic.value}
                    className="focus:bg-orange-500/20 focus:text-orange-400 data-[highlighted]:bg-orange-500/20 data-[highlighted]:text-orange-400"
                  >
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message" className="text-zinc-300">Message *</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Please describe your project or inquiry"
              className="min-h-[150px] bg-zinc-900 border-zinc-700 text-white focus:border-orange-500 focus:ring-orange-500/20 focus-visible:ring-orange-500/20 focus-visible:ring-offset-0"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white focus-visible:ring-orange-500 focus-visible:ring-offset-0"
          >
            Send Message
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
      </CardContent>
    </Card>
  )
} 