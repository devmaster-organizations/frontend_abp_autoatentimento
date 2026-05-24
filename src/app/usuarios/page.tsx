"use client";

import { useEffect, useState } from "react";
import ModalUsuario from "@/components/usuarios/ModalUsuario";
import { createUser, fetchUsers } from "@/services/api/users.service";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

// Definição da tipagem de Usuário seguindo os campos obrigatórios solicitados
export type UsuarioExemplo = {
  id: string;
  nome: string;
  email: string;
  perfil: "Administrador" | "Secretária";
  dataCadastro: string;
};

// Dados mockados iniciais para popular a tabela com o novo visual
const usuariosIniciais: UsuarioExemplo[] = [
  {
    id: "1",
    nome: "Ana Souza",
    email: "ana.secretaria@fatec.sp.gov.br",
    perfil: "Secretária",
    dataCadastro: "15/05/2026",
  },
  {
    id: "2",
    nome: "Carlos Eduardo",
    email: "carlos.adm@fatec.sp.gov.br",
    perfil: "Administrador",
    dataCadastro: "10/05/2026",
  },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioExemplo[]>(usuariosIniciais);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, isCheckingAccess } = useProtectedRoute({ allowedRoles: ["ADMIN"] });

  useEffect(() => {
    if (isCheckingAccess || !token) {
      return;
    }

    const loadUsers = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const apiUsers = await fetchUsers(token);
        setUsuarios(
          apiUsers.map((apiUser) => ({
            id: apiUser.id,
            nome: apiUser.name,
            email: apiUser.email,
            perfil: apiUser.role === "ADMIN" ? "Administrador" : "Secretária",
            dataCadastro: new Date(apiUser.createdAt).toLocaleDateString("pt-BR"),
          })),
        );
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Falha ao carregar usuarios.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [isCheckingAccess, token]);

  // Funções de gerenciamento (Prontas para integrar com o back-end depois)
  const handleDeletarUsuario = (id: string) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleEditarUsuario = (id: string) => {
    console.log("Editar o usuário de ID:", id);
    // Aqui você poderá abrir a modal passando os dados para edição
  };

  const handleCreateUsuario = async (payload: {
    nome: string;
    email: string;
    perfil: "Administrador" | "Secretária";
  }) => {
    if (!token) {
      throw new Error("Sessao expirada. Faca login novamente.");
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createUser(token, {
        name: payload.nome,
        email: payload.email,
        role: payload.perfil === "Administrador" ? "ADMIN" : "SECRETARIA",
      });

      setUsuarios((prev) => [
        {
          id: created.id,
          nome: created.name,
          email: created.email,
          perfil: created.role === "ADMIN" ? "Administrador" : "Secretária",
          dataCadastro: new Date(created.createdAt).toLocaleDateString("pt-BR"),
        },
        ...prev,
      ]);

      if (created.temporaryPassword) {
        alert(`Usuario criado. Senha temporaria: ${created.temporaryPassword}`);
      }
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : "Falha ao criar usuario.";
      setError(message);
      throw createError;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Verificando permissao...
      </main>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho superior com botão de inclusão */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Controle de Usuários
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gerencie as permissões de acesso ao painel da FATEC
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-[#15186d] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#1c2193] transition cursor-pointer"
          >
            + Incluir Novo Usuário
          </button>
        </div>

        {/* Tabela Refatorada com a Identidade Visual do Grupo */}
        {error ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>
        ) : null}

        <div className="overflow-x-auto rounded-3xl border border-white/70 bg-white/70 shadow-2xl shadow-slate-900/5 backdrop-blur">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-[#15186d] text-xs uppercase tracking-wider text-white">
              <tr>
                <th className="px-6 py-4 font-black">Data Cadastro</th>
                <th className="px-6 py-4 font-black">Nome</th>
                <th className="px-6 py-4 font-black">E-mail</th>
                <th className="px-6 py-4 font-black">Perfil</th>
                <th className="px-6 py-4 text-center font-black">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {usuarios.map((u) => (
                <tr key={u.id} className="transition hover:bg-white/50">
                  {/* Data Cadastro */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {u.dataCadastro}
                  </td>

                  {/* Nome */}
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-900">
                    {u.nome}
                  </td>

                  {/* E-mail */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {u.email}
                  </td>

                  {/* Perfil com Badge Estilizado */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        u.perfil === "Administrador"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {u.perfil}
                    </span>
                  </td>

                  {/* Botões de Alterar e Excluir */}
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditarUsuario(u.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      >
                        Alterar
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleDeletarUsuario(u.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 transition cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center font-medium text-slate-500">
                    Carregando usuarios...
                  </td>
                </tr>
              ) : null}

              {/* Estado vazio idêntico ao de vocês */}
              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center font-medium text-slate-500"
                  >
                    Nenhum usuário cadastrado no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Chamada para a modal que criamos anteriormente */}
        <ModalUsuario 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateUsuario}
          isSubmitting={isSubmitting}
        />
        
      </div>
    </div>
  );
}