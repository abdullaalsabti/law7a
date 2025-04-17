import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../../types";
import { getUIText } from "../../utils/language";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

interface LoginProps {
  language: Language;
}

const Login: React.FC<LoginProps> = ({ language }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError(
        language === "en" ? "Please fill in all fields" : "يرجى ملء جميع الحقول"
      );
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/");
      } else {
        setError(
          language === "en"
            ? "Invalid email or password"
            : "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        );
      }
    } catch (err) {
      setError(
        language === "en"
          ? "An error occurred. Please try again."
          : "حدث خطأ. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">
            {getUIText("loginToAccount", language)}
          </h1>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">{getUIText("email", language)}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Enter your email"
                    : "أدخل بريدك الإلكتروني"
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {getUIText("password", language)}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  language === "en" ? "Enter your password" : "أدخل كلمة المرور"
                }
                required
              />
            </div>

            <div className="form-group forgot-password">
              <Link to="/forgot-password" className="forgot-link">
                {getUIText("forgotPassword", language)}
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? getUIText("loading", language)
                : getUIText("login", language)}
            </button>
          </form>

          <div className="auth-alternate">
            <p>
              {language === "en" ? "Don't have an account?" : "ليس لديك حساب؟"}
              <Link to="/signup">{getUIText("signup", language)}</Link>
            </p>
          </div>
        </div>

        <div className="auth-info">
          <div className="auth-info-content">
            <h2>
              {language === "en"
                ? "Welcome Back to Law7a"
                : "مرحبًا بعودتك إلى لوحة"}
            </h2>
            <p>
              {language === "en"
                ? "Log in to discover and purchase unique artworks from local Jordanian artists."
                : "قم بتسجيل الدخول لاكتشاف وشراء أعمال فنية فريدة من الفنانين الأردنيين المحليين."}
            </p>
            <ul className="auth-benefits">
              <li>
                {language === "en"
                  ? "Access your favorites and purchase history"
                  : "الوصول إلى المفضلات وسجل المشتريات"}
              </li>
              <li>
                {language === "en"
                  ? "Get notified about new artworks from your favorite artists"
                  : "احصل على إشعارات حول الأعمال الفنية الجديدة من الفنانين المفضلين لديك"}
              </li>
              <li>
                {language === "en"
                  ? "Seamless checkout experience"
                  : "تجربة شراء سلسة"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
