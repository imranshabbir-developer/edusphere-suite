import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { EnvelopeIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ModalGradientShell, modalBackdropClass, modalFieldClass } from "@/components/ui/ModalGradientShell";

export function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail("");
    setError("");
    setSent(false);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[60]">
      <DialogBackdrop transition className={modalBackdropClass} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-[22rem] bg-transparent data-[closed]:scale-95 data-[closed]:opacity-0 transition duration-200"
        >
          <ModalGradientShell>
            <div className="relative p-5 sm:p-6">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-4 pr-6">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-elegant mb-3">
                  {sent ? (
                    <CheckCircleIcon className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <EnvelopeIcon className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  {sent ? "Check your inbox" : "Forgot your password?"}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {sent
                    ? "If an account is linked to that email, you'll receive password reset instructions shortly."
                    : "No worries — enter your registered email and we'll send you a link to reset your password."}
                </p>
              </div>

              {sent ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:shadow-glow transition"
                >
                  Back to login
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="forgot-email" className="text-sm font-semibold">
                      Email address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="you@school.edu"
                      autoComplete="email"
                      className={`mt-1.5 ${modalFieldClass}`}
                    />
                    {error && <p className="text-xs text-danger mt-1">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:shadow-glow transition disabled:opacity-70"
                  >
                    {loading ? "Sending…" : "Send reset link"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </ModalGradientShell>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
