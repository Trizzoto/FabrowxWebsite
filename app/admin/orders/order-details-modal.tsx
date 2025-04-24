"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, FileText, User, Mail, Phone, MapPin, DollarSign, Tag } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: {
    sku: string;
    options: string;
  };
}

interface Order {
  id: string;
  reference: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }: OrderDetailsModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!order) return null

  const getFormattedDetails = () => {
    return `
Order Details:
-------------
Order Reference: ${order.reference}
Date: ${new Date(order.date).toLocaleDateString()}

Customer Information:
------------------
Name: ${order.customer}
Email: ${order.email}
${order.phone ? `Phone: ${order.phone}` : ''}
${order.address ? `Delivery Address: ${order.address}` : ''}

Order Items:
-----------
${order.items.map(item => {
  const baseText = `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`;
  if (item.variant) {
    return `${baseText}\n  Variant: ${item.variant.options}\n  SKU: ${item.variant.sku}`;
  }
  return baseText;
}).join('\n')}

Total: $${order.total.toFixed(2)}
    `.trim()
  }

  const handleCopyToClipboard = () => {
    const formattedDetails = getFormattedDetails()
    navigator.clipboard.writeText(formattedDetails)
    setCopied(true)
    
    toast({
      title: "Copied to clipboard",
      description: "Order details have been copied to your clipboard",
    })
    
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(order.id, newStatus)
    toast({
      title: "Status updated",
      description: `Order status changed to ${newStatus}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Order #{order.reference}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow py-4 pr-2 custom-scrollbar">
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">Status:</span>
                <Badge className={
                  order.status === 'completed' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                  order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' :
                  'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                }>
                  {order.status.toUpperCase()}
                </Badge>
              </div>
              
              {order.status !== 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange('completed')}
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  Mark as Completed
                </Button>
              )}
            </div>
            
            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-400">Name</p>
                    <p>{order.customer}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p>{order.email}</p>
                  </div>
                </div>
                
                {order.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">Phone</p>
                      <p>{order.phone}</p>
                    </div>
                  </div>
                )}
                
                {order.address && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">Delivery Address</p>
                      <p className="whitespace-pre-line">{order.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Order Items</h3>
              <div className="border border-zinc-800 rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium text-zinc-400">Item</th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-zinc-400">Quantity</th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-zinc-400">Price</th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-zinc-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t border-zinc-800">
                        <td className="py-3 px-4">
                          <div>
                            {item.name}
                            {item.variant && (
                              <div className="text-sm text-zinc-400 mt-0.5">
                                {item.variant.options}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-zinc-800 bg-zinc-800/30">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">Total</td>
                      <td className="py-3 px-4 text-right font-medium">${order.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Email Template Text */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Email Template Text</h3>
              <div className="border border-zinc-800 rounded-md overflow-hidden">
                <Textarea 
                  value={getFormattedDetails()} 
                  readOnly 
                  className="min-h-[200px] bg-zinc-800/50 border-none font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex justify-center items-center gap-2 mt-4 pb-6">
          <div className="flex flex-col sm:flex-row gap-2 ml-12">
            <Button 
              variant="outline" 
              onClick={handleCopyToClipboard}
              className="w-[140px] border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Details
                </>
              )}
            </Button>
            <Button onClick={onClose} className="w-[140px]">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 