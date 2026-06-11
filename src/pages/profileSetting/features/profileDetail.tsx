
import { useAppSelector } from "@/store/store";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";



const TABS = ["Personal", "Education", "Documents", "Settings", "Password", "Notifications"];

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const [tab, setTab] = useState("Personal");
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, email: user?.email, phone: "+1 555 0100", bio: "Education enthusiast." } });

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <img src={user?.avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-background shadow-elegant" />
            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border border-border"><CameraIcon className="w-3.5 h-3.5" /></button>
          </div>
          <div className="text-primary-foreground">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="opacity-90 capitalize">{user?.role} · {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-thin border-b border-border">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(() => {})} className="glass-card rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {tab === "Personal" && (
          <>
            <Field label="Full name" {...register("name")} />
            <Field label="Email" type="email" {...register("email")} />
            <Field label="Phone" {...register("phone")} />
            <Field label="Bio" className="md:col-span-2" {...register("bio")} />
          </>
        )}
        {tab === "Education" && (
          <>
            <Field label="Highest Qualification" defaultValue="M.Sc Computer Science" />
            <Field label="Institution" defaultValue="MIT" />
            <Field label="Graduation Year" defaultValue="2018" />
            <Field label="Specialization" defaultValue="Artificial Intelligence" />
          </>
        )}
        {tab === "Documents" && (
          <div className="md:col-span-2 space-y-2">
            {["ID Proof", "Resume", "Photograph", "Address Proof"].map((d) => (
              <div key={d} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm">{d}</span>
                <button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Upload</button>
              </div>
            ))}
          </div>
        )}
        {tab === "Settings" && <Field label="Time zone" defaultValue="UTC-05:00 Eastern Time" />}
        {tab === "Password" && (
          <>
            <Field label="Current password" type="password" />
            <Field label="New password" type="password" />
          </>
        )}
        {tab === "Notifications" && (
          <div className="md:col-span-2 space-y-2">
            {["Email notifications", "SMS notifications", "Push notifications", "Weekly digest"].map((d) => (
              <label key={d} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm">{d}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </div>
        )}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">Save changes</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="text-xs font-medium">{label}</label>
      <input {...props} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
    </div>
  );
}
