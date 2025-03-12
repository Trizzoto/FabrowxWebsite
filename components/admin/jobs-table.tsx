"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSocket } from "@/contexts/socket-context"

interface Job {
  _id: string
  customer: {
    name: string
    email: string
  }
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  serviceType: string
  status: "Pending" | "Scheduled" | "In Progress" | "Completed"
  scheduledDate?: string
  createdAt: string
}

export default function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { socket } = useSocket()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs")
        if (!response.ok) throw new Error("Failed to fetch jobs")

        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load jobs.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()

    // Join admin room for real-time updates
    if (socket) {
      socket.emit("joinAdmin")

      socket.on("jobStatusUpdate", ({ jobId, status }) => {
        setJobs((prev) => prev.map((job) => (job._id === jobId ? { ...job, status: status as any } : job)))

        toast({
          title: "Job Updated",
          description: `Job #${jobId.slice(-6)} status changed to ${status}`,
        })
      })
    }

    return () => {
      if (socket) {
        socket.off("jobStatusUpdate")
      }
    }
  }, [toast, socket])

  const handleStatusChange = async (jobId: string, status: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update job status")

      // Update local state
      setJobs((prev) => prev.map((job) => (job._id === jobId ? { ...job, status: status as any } : job)))

      toast({
        title: "Success",
        description: `Job status updated to ${status}`,
      })
    } catch (error) {
      console.error("Error updating job status:", error)
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No jobs found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell className="font-medium">#{job._id.slice(-6)}</TableCell>
              <TableCell>{job.customer.name}</TableCell>
              <TableCell>{`${job.vehicleYear} ${job.vehicleMake} ${job.vehicleModel}`}</TableCell>
              <TableCell>{job.serviceType}</TableCell>
              <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Select defaultValue={job.status} onValueChange={(value) => handleStatusChange(job._id, value)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Job
                    </DropdownMenuItem>
                    <DropdownMenuItem>Send Email</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Cancel Job</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

