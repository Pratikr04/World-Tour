import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialValue = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };

    case "logout":
      return { ...initialValue };

    default:
      throw new Error("Unknown Action");
  }
}

const FAKE_USER = {
  name: "Arjun",
  email: "Arjun@example.com",
  password: "qwerty@12345",
  avatar: "https://www.worldhistory.org/img/r/p/500x600/12379.jpg?v=1722428463",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  function Login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      alert("Wrong Credentials");
    }
  }

  function Logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const userContext = useContext(AuthContext);
  if (userContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return userContext;
}

export { AuthProvider, useAuth };
