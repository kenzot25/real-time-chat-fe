import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const userId = useUserStore((state) => state.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  if (userId) {
    return children;
  }
};

export default ProtectedRoutes;
