import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../../types";
import { getUIText } from "../../utils/language";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

interface SignUpProps {
  language: Language;
}

const SignUp: React.FC<SignUpProps> = ({ language }) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError(
        language === "en" ? "Please fill in all fields" : "يرجى ملء جميع الحقول"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        language === "en"
          ? "Passwords do not match"
          : "كلمات المرور غير متطابقة"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        language === "en"
          ? "Password must be at least 6 characters"
          : "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
      );
      return;
    }

    setLoading(true);

    try {
      const success = await signUp({
        name,
        email,
        password,
        isArtist,
      });

      if (success) {
        navigate("/");
      } else {
        setError(
          language === "en"
            ? "This email address is already in use"
            : "عنوان البريد الإلكتروني هذا قيد الاستخدام بالفعل"
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
          <h1 className="auth-title">{getUIText("createAccount", language)}</h1>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">{getUIText("name", language)}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  language === "en" ? "Enter your name" : "أدخل اسمك"
                }
                required
              />
            </div>

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
                  language === "en" ? "Create a password" : "إنشاء كلمة مرور"
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                {getUIText("confirmPassword", language)}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Confirm your password"
                    : "تأكيد كلمة المرور"
                }
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="isArtist" className="checkbox-label">
                <input
                  id="isArtist"
                  type="checkbox"
                  checked={isArtist}
                  onChange={(e) => setIsArtist(e.target.checked)}
                />
                <span>{getUIText("registerAsArtist", language)}</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? getUIText("loading", language)
                : getUIText("createAccount", language)}
            </button>
          </form>

          <div className="auth-terms">
            <p>
              {language === "en"
                ? "By signing up, you agree to our "
                : "بالتسجيل، أنت توافق على "}
              <Link to="/terms">
                {language === "en" ? "Terms of Service" : "شروط الخدمة"}
              </Link>
              {language === "en" ? " and " : " و "}
              <Link to="/privacy">
                {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
              </Link>
            </p>
          </div>

          <div className="auth-alternate">
            <p>
              {language === "en"
                ? "Already have an account?"
                : "هل لديك حساب بالفعل؟"}
              <Link to="/login">{getUIText("login", language)}</Link>
            </p>
          </div>
        </div>

        <div className="auth-info">
          <div className="auth-info-content">
            <h2>
              {language === "en"
                ? "Join the Art Community"
                : "انضم إلى مجتمع الفن"}
            </h2>
            <p>
              {language === "en"
                ? "Sign up to discover and purchase unique artworks from local Jordanian artists."
                : "اشترك لاكتشاف وشراء أعمال فنية فريدة من الفنانين الأردنيين المحليين."}
            </p>
            <div className="artist-register-info">
              <h3>
                {language === "en" ? "Are you an artist?" : "هل أنت فنان؟"}
              </h3>
              <p>
                {language === "en"
                  ? "Register as an artist to showcase and sell your art to a dedicated audience."
                  : "سجل كفنان لعرض وبيع فنك لجمهور مخصص."}
              </p>
              <ul className="auth-benefits">
                <li>
                  {language === "en"
                    ? "Create your own artist profile"
                    : "إنشاء ملف الفنان الخاص بك"}
                </li>
                <li>
                  {language === "en"
                    ? "Upload and manage your artwork listings"
                    : "تحميل وإدارة قوائم الأعمال الفنية الخاصة بك"}
                </li>
                <li>
                  {language === "en"
                    ? "Connect with art lovers in Amman and beyond"
                    : "تواصل مع محبي الفن في عمان وخارجها"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
