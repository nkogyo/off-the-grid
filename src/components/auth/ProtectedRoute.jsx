import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="px-6 py-10">
        <div className="mx-auto max-w-3xl border-4 border-black bg-white p-8 shadow-[6px_6px_0px_#000]">
          <h1 className="text-3xl font-black uppercase">Checking access...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}