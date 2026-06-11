import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { login, VALID_EMAILS } from "@/store/slices/authSlice";
import { LoginAnimation } from "@/components/LoginAnimation";
import { LoginFloatingIcons } from "@/components/LoginFloatingIcons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const QUICK = [
  { role: "Admin", email: "admin@test.com" },
  { role: "Teacher", email: "teacher@test.com" },
  { role: "Faculty", email: "faculty@test.com" },
  { role: "Student", email: "student@test.com" },
];

const inputClass =
  "mt-1.5 w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-border bg-muted/40 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm sm:text-base";

function LoginCredits({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center text-[11px] sm:text-xs text-muted-foreground leading-relaxed ${className}`}>
      <p>Designed & Developed By</p>
      <p className="font-semibold text-foreground/80">Future Visions Technologies</p>
      <p className="font-medium text-foreground/70">Muhammad Imran Shabbir</p>
    </div>
  );
}

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [demoRole, setDemoRole] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => { if (user) navigate({ to: "/app/dashboard" }); }, [user, navigate]);

  const onSubmit = (data: FormData) => {
    const email = data.email.toLowerCase().trim();
    if (!VALID_EMAILS.includes(email)) {
      setError(`Use one of: ${VALID_EMAILS.join(", ")}`);
      return;
    }
    setError("");
    dispatch(login(email));
    navigate({ to: "/app/dashboard" });
  };

  const onDemoRoleChange = (email: string) => {
    setDemoRole(email);
    if (email) setValue("email", email);
  };

  return (
    <div
      className="relative min-h-screen min-h-[100dvh] flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, oklch(0.78 0.14 250 / 0.55), transparent 55%), radial-gradient(circle at 80% 70%, oklch(0.72 0.13 188 / 0.45), transparent 50%), linear-gradient(135deg, oklch(0.585 0.214 263), oklch(0.45 0.18 270))",
      }}
    >
      <LoginFloatingIcons />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[440px] sm:max-w-xl md:max-w-4xl lg:max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/30"
      >
        {/* Mobile / tablet illustration */}
        <div
          className="md:hidden flex flex-col items-center justify-center px-4 pt-6 pb-4 sm:px-6 sm:pt-8 relative order-first"
          style={{ background: "linear-gradient(135deg, oklch(0.95 0.04 250), oklch(0.92 0.06 200))" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.14 250 / 0.6), transparent 60%)" }}
          />
          <LoginAnimation className="relative w-full max-w-[280px] sm:max-w-[320px] h-[200px] sm:h-[240px]" />
        </div>

        {/* Form */}
        <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 flex flex-col justify-center order-last md:order-none">
          <div className="text-center mb-5 sm:mb-6">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg gradient-primary flex items-center justify-center shadow-elegant">
                <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <p className="font-bold text-base sm:text-lg">EduOne</p>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2 px-2">
              Login to your Education ERP Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input {...register("email")} placeholder="Enter email" autoComplete="email" className={inputClass} />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPwd ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground touch-manipulation"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Quick demo access</label>
              <select
                value={demoRole}
                onChange={(e) => onDemoRoleChange(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a role</option>
                {QUICK.map((q) => (
                  <option key={q.email} value={q.email}>
                    {q.role} — {q.email}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-lg gradient-primary text-primary-foreground text-sm sm:text-base font-semibold shadow-elegant hover:shadow-glow transition touch-manipulation"
            >
              Login
            </button>

            <div className="flex justify-center sm:justify-start">
              <button type="button" className="text-xs sm:text-sm font-semibold text-primary hover:underline touch-manipulation">
                Forgot Password?
              </button>
            </div>
          </form>

          <LoginCredits className="md:hidden mt-6 pt-4 border-t border-border/60" />
        </div>

        {/* Desktop illustration */}
        <div
          className="hidden md:flex flex-col items-center justify-center px-4 py-6 lg:py-8 relative"
          style={{ background: "linear-gradient(135deg, oklch(0.95 0.04 250), oklch(0.92 0.06 200))" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.14 250 / 0.6), transparent 60%)" }}
          />
          <LoginAnimation className="relative w-full max-w-[340px] lg:max-w-[380px] h-[300px] lg:h-[380px]" />
          <LoginCredits className="relative mt-4" />
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
