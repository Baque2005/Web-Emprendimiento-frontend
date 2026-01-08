
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockOrders, mockBusinesses } from '@/data/mockData';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ug-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('ug-businesses');
    return saved ? JSON.parse(saved) : mockBusinesses;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ug-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ug-orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return localStorage.getItem('ug-onboarding') === 'complete';
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ug-products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ug-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ug-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ug-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ug-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ug-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ug-businesses', JSON.stringify(businesses));
  }, [businesses]);


  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const completeOnboarding = () => {
    localStorage.setItem('ug-onboarding', 'complete');
    setIsOnboardingComplete(true);
  };

  const addProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product) => {
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? product : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addBusiness = (business) => {
    setBusinesses(prev => {
      const exists = prev.some(b => b.id === business.id);
      if (exists) {
        return prev.map(b => (b.id === business.id ? business : b));
      }
      return [...prev, business];
    });
  };

  const updateBusiness = (business) => {
    setBusinesses(prev => prev.map(b => (b.id === business.id ? business : b)));
  };
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        businesses,
        addBusiness,
        updateBusiness,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        addOrder,
        isOnboardingComplete,
        completeOnboarding,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
