import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/FakeAuthProvider";
import { useEffect } from "react";

function RedirectedPage({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [isAuthenticated, navigate]
  );
 

  return isAuthenticated && children ;
}

export default RedirectedPage;
