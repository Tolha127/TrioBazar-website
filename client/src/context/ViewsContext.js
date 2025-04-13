import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewsContext = createContext();

export const useViews = () => useContext(ViewsContext);

export const ViewsProvider = ({ children }) => {  const [pageViews, setPageViews] = useState(() => {
    const savedViews = localStorage.getItem('trioBazaarPageViews');
    return savedViews ? JSON.parse(savedViews) : {};
  });

  const location = useLocation();

  useEffect(() => {
    // Increment page views for the current path
    const path = location.pathname;
    setPageViews(prev => {      const newViews = {
        ...prev,
        [path]: (prev[path] || 0) + 1
      };
      localStorage.setItem('trioBazaarPageViews', JSON.stringify(newViews));
      return newViews;
    });
  }, [location.pathname]);

  const getTotalViews = () => {
    return Object.values(pageViews).reduce((sum, views) => sum + views, 0);
  };

  return (
    <ViewsContext.Provider value={{ pageViews, getTotalViews }}>
      {children}
    </ViewsContext.Provider>
  );
};
