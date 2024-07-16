import { createContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handler);

    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const navigate = (to) => {
    // window.history.pushState({}, '', to);
    window.open(
      to,
      'popUpWindow',
      'popup=true,height=519,width=516,left=0,top=0,resizable=true,scrollbars=false,toolbar=false,menubar=no,location=no,directories=false,status=false'
    );
    // setCurrentPath(to);
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
export default NavigationContext;
