import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { AcademicCapIcon, ArrowRightIcon, EnvelopeIcon, LockClosedIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login, VALID_EMAILS } from "@/redux/slices/authSlice";

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
  { role: "Admin", email: "admin@test.com", desc: "Full org control" },
  { role: "Teacher", email: "teacher@test.com", desc: "Classes & grading" },
  { role: "Faculty", email: "faculty@test.com", desc: "Operations & records" },
  { role: "Student", email: "student@test.com", desc: "Learn & track" },
];

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [error, setError] = useState<string>("");

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

  const quick = (email: string) => {
    setValue("email", email);
    dispatch(login(email));
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden gradient-hero text-primary-foreground p-12">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xl">EduOne</p>
              <p className="text-xs opacity-80">Education ERP · LMS · SIS · CRM</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-auto space-y-6">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
            Run your entire campus<br />from one beautiful platform.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-lg opacity-90 max-w-md">
            Admissions, academics, attendance, exams, fees, payroll, HR, library, hostel — orchestrated end-to-end.
          </motion.p>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[["12k+", "Students"], ["480", "Courses"], ["98%", "Uptime"]].map(([v, l]) => (
              <div key={l} className="glass-card rounded-xl p-3 border-white/20">
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-xs opacity-80">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="font-bold text-lg">EduOne</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <SparklesIcon className="w-3.5 h-3.5" /> Demo workspace
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your EduOne workspace.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1.5">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input {...register("email")} placeholder="admin@test.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password <span className="text-muted-foreground font-normal">(optional in demo)</span></label>
              <div className="relative mt-1.5">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" {...register("password")} placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition inline-flex items-center justify-center gap-2">
              Sign in <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Quick demo</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK.map((q) => (
              <button key={q.email} onClick={() => quick(q.email)}
                className="text-left p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition group">
                <p className="font-semibold text-sm group-hover:text-primary">{q.role}</p>
                <p className="text-[11px] text-muted-foreground truncate">{q.email}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
