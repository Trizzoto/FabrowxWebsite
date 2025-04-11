"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CartButton() {
  const { totalItems, cartUpdated } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className={cn(
          "rounded-full shadow-lg transition-all duration-300 bg-orange-600 hover:bg-orange-700",
          cartUpdated && "scale-110"
        )}
        onClick={() => window.location.href = "/cart"}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Cart
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="ml-2"
            >
              <Badge variant="secondary" className="bg-white text-orange-600 font-bold">
                {totalItems}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
} 