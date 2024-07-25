import { createContext, useState, useEffect, useCallback } from 'react';

const NavigationContext = createContext();

function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = useCallback((to) => {
    window.open(
      to,
      'popUpWindow',
      'popup=true,height=519,width=516,left=0,top=0,resizable=false,scrollbars=false,toolbar=false,menubar=no,location=no,directories=no,status=no'
    );
  }, []);

  const closeWindow = useCallback(() => {
    window.close();
  }, []);

  const value = {
    currentPath,
    navigate,
    closeWindow,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
export default NavigationContext;
