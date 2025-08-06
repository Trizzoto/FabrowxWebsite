"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Mail, Phone, Check, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  title: string
  message: string
  date: string
  status: "new" | "read" | "replied"
}

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact")
      if (!response.ok) {
        throw new Error("Failed to fetch submissions")
      }
      const data = await response.json()
      
      // Sort submissions by date, most recent first
      const sortedData = data.sort((a: ContactSubmission, b: ContactSubmission) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setSubmissions(sortedData)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast.error("Failed to load contact submissions")
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: "read" | "replied") => {
    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update submission")
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === id ? { ...submission, status } : submission
        )
      )

      toast.success(`Submission marked as ${status}`)
    } catch (error) {
      console.error("Error updating submission:", error)
      toast.error("Failed to update submission status")
    }
  }

  const deleteSubmission = async (id: string) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete submission")
      }

      // Update local state
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      )

      toast.success("Submission deleted successfully")
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast.error("Failed to delete submission")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
      case "read":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Read</Badge>
      case "replied":
        return <Badge className="bg-green-500 hover:bg-green-600">Replied</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredSubmissions = submissions.filter((submission) => {
    if (activeTab === "all") return true
    return submission.status === activeTab
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <Button onClick={fetchSubmissions} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="text-center py-10">Loading submissions...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-10">No submissions found.</div>
          ) : (
            <div className="grid gap-6">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{submission.name}</CardTitle>
                        <CardDescription>
                          {format(new Date(submission.date), "PPP p")}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="font-medium text-lg">
                        {submission.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {submission.email}
                        </a>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a
                            href={`tel:${submission.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {submission.phone}
                          </a>
                        </div>
                      )}
                      <div className="pt-2 border-t">
                        <p className="whitespace-pre-wrap">{submission.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.status === "new" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSubmissionStatus(submission.id, "read")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        {submission.status !== "replied" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSubmissionStatus(submission.id, "replied")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as Replied
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="ml-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Contact Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this contact submission? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSubmission(submission.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 