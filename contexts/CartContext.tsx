import React, { createContext, useContext, useEffect, useState } from 'react';

type Article = {
  imageUrl: string;
  name: string;
  sifra: string;
  barkod: string;
  stanje: string;
  jm: string;
  cena: number;
  pakovanje: number;
  kolicina: number;
};

type CartContextType = {
  items: Article[];
  addItem: (item: Article) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Article[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Proveri da svaki item ima sve potrebne ključeve
          const valid = parsed.filter((item) =>
            item &&
            typeof item.name === 'string' &&
            typeof item.cena === 'number' &&
            typeof item.kolicina === 'number' &&
            typeof item.imageUrl === 'string' &&
            typeof item.pakovanje === 'number'
          );
          setItems(valid);
        }
      } catch (e) {
        console.error("Greška pri parsiranju localStorage cart:", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Article) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
