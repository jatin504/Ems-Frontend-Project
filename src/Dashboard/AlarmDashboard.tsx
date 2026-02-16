import { useNavigate, useLocation } from "react-router-dom";
import AlarmModal from "./AlarmModal";

export default function AlarmDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const type = location.pathname.includes("latest") ? "latest" : "history";

  return (
    <AlarmModal
      isOpen={true}
      onClose={() => navigate("/")}
      type={type}
    />
  );
}
