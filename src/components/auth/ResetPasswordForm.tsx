"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { resetPassword } from "@/services/api/auth.service";

type ResetPasswordFormProps = {
  email: string;
};

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError("Informe o token de recuperação.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token.trim(), newPassword);
      alert("Senha redefinida com sucesso. Faça login novamente.");
      router.push("/login");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Falha ao redefinir senha.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 px-6 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#15186d] text-white">
            <KeyRound size={20} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Recuperação de senha
            </p>
            <h1 className="text-2xl font-black text-slate-900">Redefinir senha</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-600">
          Informe o token enviado por e-mail. Em ambiente de desenvolvimento, o token também aparece nos logs do backend.
        </p>

        {email ? (
          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="mr-2 inline-flex items-center gap-2 font-semibold text-slate-500">
              <Mail size={16} /> E-mail:
            </span>
            {email}
          </div>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Cole aqui o token recebido"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#15186d]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Nova senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#15186d]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Confirmar nova senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repita a nova senha"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#15186d]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#15186d] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#1c2193] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
