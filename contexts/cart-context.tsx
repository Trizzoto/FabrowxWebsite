"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  selectedVariant?: {
    sku: string
    option1?: string
    option2?: string
    option3?: string
  }
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  cartUpdated: boolean
  setCartUpdated: (updated: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartUpdated, setCartUpdated] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: any, quantity: number) => {
    setCart((prevCart) => {
      // Create a unique ID based on product ID and variant (if any)
      const variantId = product.selectedVariant?.sku 
        ? `${product._id}-${product.selectedVariant.sku}`
        : product._id;
        
      const existingItem = prevCart.find((item) => 
        (item.selectedVariant?.sku && product.selectedVariant?.sku) 
          ? item._id === product._id && item.selectedVariant.sku === product.selectedVariant.sku
          : item._id === product._id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          ((item.selectedVariant?.sku && product.selectedVariant?.sku) 
            ? item._id === product._id && item.selectedVariant.sku === product.selectedVariant.sku
            : item._id === product._id) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      } else {
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity,
            selectedVariant: product.selectedVariant || undefined
          },
        ]
      }
    })
    
    // Trigger the cart animation
    setCartUpdated(true)
    setTimeout(() => setCartUpdated(false), 1000)
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        cartUpdated,
        setCartUpdated
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

