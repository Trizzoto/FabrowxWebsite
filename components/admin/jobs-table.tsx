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
  id: number
  customerName: string
  description: string
  date: string
  status: string
}

export function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { socket } = useSocket()

  useEffect(() => {
    // For demo purposes, simulate loading jobs
    const demoJobs: Job[] = [
      {
        id: 1,
        customerName: "John Doe",
        description: "Custom Fabrication",
        date: "2024-04-01",
        status: "Pending"
      },
      {
        id: 2,
        customerName: "Jane Smith",
        description: "Welding Repair",
        date: "2024-04-02",
        status: "In Progress"
      }
    ]
    
    setTimeout(() => {
      setJobs(demoJobs)
      setLoading(false)
    }, 1000)

    // Join admin room for real-time updates
    if (socket) {
      socket.emit("joinAdmin")

      socket.on("jobStatusUpdate", ({ jobId, status }) => {
        setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: status as any } : job)))

        toast({
          title: "Job Updated",
          description: `Job #${jobId} status changed to ${status}`,
        })
      })
    }

    return () => {
      if (socket) {
        socket.off("jobStatusUpdate")
      }
    }
  }, [toast, socket])

  const updateJobStatus = (jobId: number, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ))
  }

  if (loading) {
    return <div>Loading jobs...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b">Job ID</th>
            <th className="px-6 py-3 border-b">Customer</th>
            <th className="px-6 py-3 border-b">Description</th>
            <th className="px-6 py-3 border-b">Date</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 border-b">{job.id}</td>
              <td className="px-6 py-4 border-b">{job.customerName}</td>
              <td className="px-6 py-4 border-b">{job.description}</td>
              <td className="px-6 py-4 border-b">{job.date}</td>
              <td className="px-6 py-4 border-b">{job.status}</td>
              <td className="px-6 py-4 border-b">
                <select
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

