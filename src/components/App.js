import AppRouter from "components/Router";
import { useEffect, useState } from "react";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=> {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObj(user);
      } else {
        setUserObj(false);
      }
      setInit(true);
    }, []);
  })

  const refreshUser = () => {
    setUserObj(Object.assign({}, authService.currentUser));
  };

  return (
    <>
      {init ? (
        <AppRouter 
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)} 
          userObj = {userObj}
        />
        ) : (
        "initializing..."
        )}
    </>
  );
}

export default App;
