"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  isReady: boolean
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  isReady: false,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isReady, setIsReady] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
    setIsReady(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isReady) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }
  }, [items, isReady])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    if (!isReady) return
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item._id === newItem._id)
      if (existingItem) {
        return currentItems.map(item =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    if (!isReady) return
    setItems(currentItems => currentItems.filter(item => item._id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!isReady) return
    setItems(currentItems =>
      currentItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const clearCart = () => {
    if (!isReady) return
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isReady,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  return context
} 