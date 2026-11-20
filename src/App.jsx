import AppRoutes from "./routes/AppRoutes";
import SiteMotionLayer from "./components/motion/SiteMotionLayer";

export default function App() {
  return (
    <div className="cb-theme">
      <SiteMotionLayer />
      <AppRoutes />
    </div>
  );
}
