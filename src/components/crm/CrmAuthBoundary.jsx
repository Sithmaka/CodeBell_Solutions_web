import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

export default function CrmAuthBoundary() {
  return <AuthProvider><Outlet /></AuthProvider>;
}
