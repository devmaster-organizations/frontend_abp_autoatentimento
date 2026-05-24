"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
  // aqui você pode validar depois
  if (email && password) {
    router.push("/chat"); // 👈 sua rota do chatbot
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        
        {/* LADO ESQUERDO - FORM */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          
          {/* TAG */}
          <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">
            LOGIN
          </span>

          {/* TÍTULO */}
          <h1 className="text-3xl font-bold mt-4">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Acesse sua conta para continuar
          </p>

          {/* INPUT EMAIL */}
          <div className="mt-8">
            <label className="text-sm text-gray-600">E-mail ou usuário</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mt-1 bg-white">
              <Mail size={18} className="text-gray-400" />
              <input
  className="ml-2 w-full outline-none focus:outline-none focus:ring-0"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
            </div>
          </div>

          {/* INPUT SENHA */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Senha</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mt-1">
              <Lock size={18} className="text-gray-400" />
              <input
  type={showPassword ? "text" : "password"}
  className="ml-2 w-full outline-none"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
              <Eye
                size={18}
                className="text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* OPÇÕES */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" />
              Lembrar-me
            </label>

            <a className="text-blue-600 hover:underline" href="#">
              Esqueci minha senha
            </a>
          </div>

          {/* BOTÃO */}
          <button
  onClick={handleLogin}
  className="mt-6 bg-red-600 hover:bg-red-700 shadow-md text-white py-3 rounded-xl font-semibold transition"
>
  Entrar
</button>

          {/* FOOTER */}
          <p className="text-sm text-gray-500 mt-6">
            Não tem uma conta?{" "}
            <a className="text-blue-600 hover:underline" href="#">
              Entre em contato com a administração.
            </a>
          </p>
        </div>

        {/* LADO DIREITO - IMAGEM */}
    <div className="hidden lg:block w-1/2 relative">
  <Image
    src="/logo-fatec.png"
    alt="Fatec Jacareí"
    fill
    sizes="50vw"
    priority
    className="object-cover"
  />

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/40 flex flex-col justify-between text-white p-10">
    
    {/* TOPO */}
    <div className="text-left">
      <h2 className="text-5xl font-bold tracking-tight">
        Fatec <span className="text-red-400">Jacareí</span>
      </h2>
    </div>

    {/* BASE */}
    <div className="text-left">
      <p className="text-xl font-semibold tracking-tight max-w-md">
        Ensino Público, Gratuito e de Qualidade
      </p>
    </div>

  </div>
</div>
</div>
</div>
  );
}