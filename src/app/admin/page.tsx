"use client";

import { ChatNode } from "@/types/chat-node";
import NodeModal from "@/components/admin/NodeModal";
import AdminHeader from "@/components/admin/AdminHeader";
import TreeNode from "@/components/admin/TreeNode";
import { mockTree } from "@/data/mockTree";
import { useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";




export default function AdminPage() {
    const { isCheckingAccess } = useProtectedRoute({ allowedRoles: ["ADMIN"] });

    const [openMenuId, setOpenMenuId] =
        useState<number | null>(null);

    const [treeData, setTreeData] = useState(mockTree);

    const [modalOpen, setModalOpen] = useState(false);

    const [modalMode, setModalMode] =
        useState<"create" | "edit">("create");

    const [selectedNode, setSelectedNode] =
        useState<ChatNode | null>(null);

    const openCreateModal = (node: ChatNode) => {
        setSelectedNode(node);
        setModalMode("create");
        setModalOpen(true);
    };

    const openEditModal = (node: ChatNode) => {
        setSelectedNode(node);
        setModalMode("edit");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedNode(null);
    };

    const toggleStatus = (id: number) => {
        const updateNodes = (nodes: typeof treeData): typeof treeData => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        status: !node.status,
                    };
                }

                if (node.children) {
                    return {
                        ...node,
                        children: updateNodes(node.children),
                    };
                }

                return node;
            });
        };

        setTreeData(updateNodes(treeData));
    };

    if (isCheckingAccess) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
                Verificando permissao...
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/70 to-rose-50 text-slate-900">
            <div className="pointer-events-none absolute -left-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-rose-500/25 blur-3xl" />

            <AdminHeader />

            <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
                <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-600">
                                Painel Administrativo
                            </p>

                            <h1 className="mt-3 text-3xl font-black text-slate-900">
                                Árvore de perguntas e respostas
                            </h1>

                            <p className="mt-3 max-w-2xl text-slate-500">
                                Gerencie toda a estrutura do chatbot da secretaria.
                                Adicione novos fluxos, respostas e organize os nós
                                dinamicamente.
                            </p>
                        </div>

                    </div>

                    <div className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
                        <div className="overflow-x-auto overflow-y-visible">
                            <table className="w-full">
                                <thead className="bg-[#15186d] text-white">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
                                            Descrição do Nó
                                        </th>

                                        <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                            Tipo
                                        </th>

                                        <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wide">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {treeData.map((node) => (
                                        <TreeNode
                                            key={node.id}
                                            node={node}
                                            onToggleStatus={toggleStatus}
                                            onCreateNode={openCreateModal}
                                            onEditNode={openEditModal}
                                            openMenuId={openMenuId}
                                            setOpenMenuId={setOpenMenuId}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
                            <p className="text-sm font-black uppercase tracking-wide text-indigo-700">
                                MENU
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Nós do tipo MENU possuem filhos e continuam o fluxo
                                do atendimento.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
                            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
                                RESPOSTA
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Nós do tipo RESPOSTA representam o final do fluxo.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6">
                            <p className="text-sm font-black uppercase tracking-wide text-rose-700">
                                STATUS
                            </p>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                O administrador pode ativar ou desativar nós sem
                                excluir informações do banco.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <NodeModal
                open={modalOpen}
                mode={modalMode}
                node={selectedNode}
                onClose={closeModal}
            />
        </main>
    );
}