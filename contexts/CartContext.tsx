'use client';

import { createContext, useContext, useState } from 'react';

type CartContextType = {
  cartCount: number;
  incrementCart: () => void;
  decrementCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  incrementCart: () => {},
  decrementCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const incrementCart = () => setCartCount(c => c + 1);
  const decrementCart = () => setCartCount(c => Math.max(0, c - 1));

  return (
    <CartContext.Provider value={{ cartCount, incrementCart, decrementCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
