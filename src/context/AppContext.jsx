
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockOrders, mockBusinesses } from '@/data/mockData';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const normalizeProduct = (product) => {
    if (!product) return product;

    const imagesFromArray = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const images = imagesFromArray.length > 0
      ? imagesFromArray
      : product.image
        ? [product.image]
        : [];

    const image = product.image || images[0] || '';
    return {
      ...product,
      images,
      image,
      acceptsDelivery: product.acceptsDelivery ?? true,
      acceptsPickup: product.acceptsPickup ?? true,
      acceptsPaypal: product.acceptsPaypal ?? true,
      acceptsCash: product.acceptsCash ?? true,
    };
  };

  const normalizeProducts = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(normalizeProduct);
  };

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
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => ({
        ...item,
        product: normalizeProduct(item?.product),
      }));
    } catch {
      return [];
    }
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
    if (!saved) return normalizeProducts(mockProducts);
    try {
      return normalizeProducts(JSON.parse(saved));
    } catch {
      return normalizeProducts(mockProducts);
    }
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('ug-reports');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [notificationsByUser, setNotificationsByUser] = useState(() => {
    const saved = localStorage.getItem('ug-notifications');
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
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

  useEffect(() => {
    localStorage.setItem('ug-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('ug-notifications', JSON.stringify(notificationsByUser));
  }, [notificationsByUser]);


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

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const completeOnboarding = () => {
    localStorage.setItem('ug-onboarding', 'complete');
    setIsOnboardingComplete(true);
  };

  const addProduct = (product) => {
    setProducts(prev => [...prev, normalizeProduct(product)]);
  };

  const updateProduct = (product) => {
    const normalized = normalizeProduct(product);
    setProducts(prev => prev.map(p => (p.id === normalized.id ? normalized : p)));
    setCart(prev =>
      prev.map(item =>
        item?.product?.id === normalized.id ? { ...item, product: normalized } : item
      )
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

  const getNotificationsForUser = (userId) => {
    if (!userId) return [];
    const list = notificationsByUser?.[userId];
    return Array.isArray(list) ? list : [];
  };

  const addNotification = (userId, notification) => {
    if (!userId) return;
    setNotificationsByUser((prev) => {
      const current = Array.isArray(prev?.[userId]) ? prev[userId] : [];
      return {
        ...(prev || {}),
        [userId]: [notification, ...current],
      };
    });
  };

  const markNotificationAsRead = (userId, notificationId) => {
    if (!userId) return;
    setNotificationsByUser((prev) => {
      const current = Array.isArray(prev?.[userId]) ? prev[userId] : [];
      return {
        ...(prev || {}),
        [userId]: current.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      };
    });
  };

  const markAllNotificationsAsRead = (userId) => {
    if (!userId) return;
    setNotificationsByUser((prev) => {
      const current = Array.isArray(prev?.[userId]) ? prev[userId] : [];
      return {
        ...(prev || {}),
        [userId]: current.map((n) => ({ ...n, read: true })),
      };
    });
  };

  const deleteNotification = (userId, notificationId) => {
    if (!userId) return;
    setNotificationsByUser((prev) => {
      const current = Array.isArray(prev?.[userId]) ? prev[userId] : [];
      return {
        ...(prev || {}),
        [userId]: current.filter((n) => n.id !== notificationId),
      };
    });
  };

  const findOwnerUserIdByBusinessId = (businessId) => {
    if (!businessId) return null;
    const owner = users.find((u) => u?.businessId === businessId);
    return owner?.id || null;
  };

  const createReport = ({ type, targetId, targetName, reason }) => {
    if (!user) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    const id = `r${Date.now()}`;

    let ownerUserId = null;
    if (type === 'product') {
      const product = products.find((p) => p?.id === targetId);
      ownerUserId = findOwnerUserIdByBusinessId(product?.businessId);
    } else if (type === 'business') {
      ownerUserId = findOwnerUserIdByBusinessId(targetId);
    } else if (type === 'user') {
      ownerUserId = targetId;
    }

    const report = {
      id,
      type,
      targetId,
      targetName,
      reason,
      reporterId: user.id,
      reportedBy: user.name,
      reportedAt: now,
      status: 'pending',
      ownerUserId,
    };

    setReports((prev) => [report, ...prev]);

    // Notify admin
    addNotification('admin', {
      id: `n${Date.now()}-admin`,
      title: 'Nuevo reporte recibido',
      message: `${user.name} reportó ${type === 'product' ? 'un producto' : type === 'business' ? 'un negocio' : 'un usuario'}${targetName ? `: ${targetName}` : ''}.`,
      createdAt: now,
      read: false,
      meta: { kind: 'report', reportId: id },
    });

    // Notify owner (entrepreneur/user being reported)
    if (ownerUserId && ownerUserId !== user.id) {
      addNotification(ownerUserId, {
        id: `n${Date.now()}-owner`,
        title: 'Tu perfil recibió un reporte',
        message: `${targetName ? `"${targetName}"` : 'Un elemento'} fue reportado. Razón: ${reason}`,
        createdAt: now,
        read: false,
        meta: { kind: 'report', reportId: id },
      });
    }

    // Notify reporter
    addNotification(user.id, {
      id: `n${Date.now()}-reporter`,
      title: 'Reporte enviado',
      message: `Tu reporte${targetName ? ` de "${targetName}"` : ''} fue enviado al administrador.`,
      createdAt: now,
      read: false,
      meta: { kind: 'report', reportId: id },
    });

    return report;
  };

  const updateReportStatus = (reportId, status) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  };

  const deleteReport = (reportId) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
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
        updateOrderStatus,
        deleteOrder,
        isOnboardingComplete,
        completeOnboarding,
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        reports,
        createReport,
        updateReportStatus,
        deleteReport,

        getNotificationsForUser,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
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
