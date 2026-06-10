import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login, VALID_EMAILS } from "@/redux/slices/authSlice";
import illustration from "@/assets/login-illustration.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · EduOne ERP" },
      { name: "description", content: "Sign in to your EduOne education ERP workspace." },
    ],
  }),
  component: LoginPage,
});

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

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { email: "", password: "" },
  });

  useEffect(() => { if (user) navigate({ to: "/app/dashboard" }); }, [user, navigate]);

  const onSubmit = (data: FormData) => {
    const email = data.email.toLowerCase().trim();
    if (!VALID_EMAILS.includes(email)) { setError(`Use one of: ${VALID_EMAILS.join(", ")}`); return; }
    setError(""); dispatch(login(email)); navigate({ to: "/app/dashboard" });
  };
  const quick = (email: string) => { setValue("email", email); dispatch(login(email)); navigate({ to: "/app/dashboard" }); };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, oklch(0.78 0.14 250 / 0.55), transparent 55%), radial-gradient(circle at 80% 70%, oklch(0.72 0.13 188 / 0.45), transparent 50%), linear-gradient(135deg, oklch(0.585 0.214 263), oklch(0.45 0.18 270))",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}
        className="w-full max-w-5xl grid md:grid-cols-2 bg-card rounded-3xl shadow-2xl overflow-hidden border border-white/30">
        {/* Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-elegant">
              <AcademicCapIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="font-bold text-lg">EduOne</p>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-muted-foreground mt-2">Login to your Education ERP Dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input {...register("email")} placeholder="Enter email"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-border bg-muted/40 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative mt-2">
                <input type={showPwd ? "text" : "password"} {...register("password")} placeholder="Enter Password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-muted/40 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                <button type="button" onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit"
              className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition">
              Login
            </button>

            <button type="button" className="text-sm font-semibold text-primary hover:underline">Forgot Password?</button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Quick demo access</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK.map((q) => (
              <button key={q.email} onClick={() => quick(q.email)}
                className="text-left p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition group">
                <p className="font-semibold text-sm group-hover:text-primary">{q.role}</p>
                <p className="text-[11px] text-muted-foreground truncate">{q.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center p-10 relative"
          style={{ background: "linear-gradient(135deg, oklch(0.95 0.04 250), oklch(0.92 0.06 200))" }}>
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.14 250 / 0.6), transparent 60%)" }} />
          <img src={illustration} alt="Team collaboration" className="relative max-w-full max-h-[420px] object-contain drop-shadow-xl"
            width={1024} height={1024} />
        </div>
      </motion.div>
    </div>
  );
}
