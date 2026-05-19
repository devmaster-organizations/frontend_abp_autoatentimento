"use client";

import React, { useState } from "react";

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalUsuario({ isOpen, onClose }: ModalUsuarioProps) {
  // Estados para controlar os campos obrigatórios
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("Secretária");
  const [dataCadastro, setDataCadastro] = useState(
    new Date().toISOString().split("T")[0] // Define a data de hoje como padrão
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui futuramente vocês vão conectar com o Prisma/Backend
    const dadosUsuario = { nome, email, perfil, dataCadastro };
    console.log("Enviando para o banco:", dadosUsuario);
    
    // Limpa o formulário e fecha a modal
    setNome("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Container da Modal */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-slate-200">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3(id)">
          <h2 className="text-xl font-bold text-slate-800">Usuários do Sistema</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          
          {/* Campo Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Nome Completo *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do funcionário"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            />
          </div>

          {/* Campo E-mail */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">E-mail Corporativo *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@fatec.sp.gov.br"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            />
          </div>

          {/* Campo Perfil (Combobox) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Perfil de Acesso *</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="Administrador">Administrador</option>
              <option value="Secretária">Secretária</option>
            </select>
          </div>

          {/* Campo Data de Cadastro */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Data de Cadastro *</label>
            <input
              type="date"
              required
              value={dataCadastro}
              onChange={(e) => setDataCadastro(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            />
          </div>

          {/* Botões de Ação */}
          <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              Salvar Usuário
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}