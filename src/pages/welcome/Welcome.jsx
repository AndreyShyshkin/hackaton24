import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Welcome() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <span>
          Вы вошли в систему как {user.displayName},
          <Link to="/main"> войти в проект</Link>
        </span>
      ) : (
        <Link to="/auth">login</Link>
      )}
    </div>
  );
}

export default Welcome;