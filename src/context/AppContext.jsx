
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockOrders, mockBusinesses } from '@/data/mockData';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ug-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ug-users');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'admin',
        name: 'Administrador',
        email: 'admin@ug.edu.ec',
        role: 'admin',
      },
      {
        id: 'u1',
        name: 'María García',
        email: 'emprendedor@ug.edu.ec',
        role: 'entrepreneur',
        businessId: 'b1',
      },
      {
        id: 'u2',
        name: 'Cliente',
        email: 'cliente@ug.edu.ec',
        role: 'customer',
      },
    ];
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
    localStorage.setItem('ug-users', JSON.stringify(users));
  }, [users]);

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

  const deleteBusiness = (businessId) => {
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
    setUsers(prev => prev.map(u => (u.businessId === businessId ? { ...u, businessId: undefined } : u)));
  };

  const upsertUser = (nextUser) => {
    setUsers(prev => {
      const index = prev.findIndex(u => u.id === nextUser.id || u.email === nextUser.email);
      if (index >= 0) {
        return prev.map((u, i) => (i === index ? { ...u, ...nextUser } : u));
      }
      return [...prev, nextUser];
    });
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        users,
        upsertUser,
        deleteUser,
        businesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
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
