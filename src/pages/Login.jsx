import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../Contexts/FakeAuthProvider";
import { replace, useNavigate } from "react-router-dom";
import Button from "../components/Buttons";

export default function Login() {
  const { Login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("Arjun@example.com");
  const [password, setPassword] = useState("qwerty@12345");

  function handleLogin(e) {
    e.preventDefault();

    if ((email, password)) Login(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <NavBar />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
