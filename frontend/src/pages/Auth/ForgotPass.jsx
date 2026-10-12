import { Link, useNavigate } from "react-router-dom";

export default function ForgotPass() {
  return (
    <div>
      <p>Ну вспоминайте епт</p>
      <Link to="/login" className="link">
        Go back
      </Link>
    </div>
  );
}
