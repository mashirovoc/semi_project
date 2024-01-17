import { useEffect, useState } from 'react';
export const useAuth = () => {
  const [check, setCheck] = useState({
    checked: false,
    isAuthenticated: false,
  });
  useEffect(() => {
    const handleCheckJwt = async () => {
      try {
        let isAuthenticated = false;
        if (localStorage.getItem('access_token') !== null) {
          isAuthenticated = true;
        }
        setCheck({
          checked: true,
          isAuthenticated: isAuthenticated,
        });
      } catch (error) {
        setCheck({ checked: true, isAuthenticated: false });
      }
    };
    handleCheckJwt();
  }, []);
  return check;
};
