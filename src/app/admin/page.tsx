"use client";

import { ChatNode } from "@/types/chat-node";
import NodeModal, { NodeModalPayload } from "@/components/admin/NodeModal";
import AdminShell from "@/components/admin/AdminShell";
import AdminHeader from "@/components/admin/AdminHeader";
import TreeNode from "@/components/admin/TreeNode";
import { useEffect, useMemo, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import {
    createNavigationNode,
    listNavigationNodes,
    NavigationNodeApi,
    updateNavigationNode,
} from "@/services/api/navigation.service";
import {
    fetchInquiryEmailConfig,
    updateInquiryEmailConfig,
    type InquiryEmailConfigApi,
} from "@/services/api/inquiries.service";

const slugify = (value: string): string =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 90);

const buildSlugForCreate = (title: string) => {
    const base = slugify(title) || "node";
    const suffix = Date.now().toString(36);
    return `${base}-${suffix}`;
};

type EmailConfigForm = {
    recipientEmail: string;
    ccEmail: string;
};

const emptyEmailConfigForm: EmailConfigForm = {
    recipientEmail: "",
    ccEmail: "",
};

const flattenNodes = (rows: NavigationNodeApi[]): NavigationNodeApi[] => {
    const byId = new Map<string, NavigationNodeApi>();

    const visit = (node: NavigationNodeApi) => {
        byId.set(String(node.id), node);
        node.children?.forEach(visit);
    };

    rows.forEach(visit);

    return [...byId.values()];
};

const mapToTree = (rows: NavigationNodeApi[]): ChatNode[] => {
    const flat = flattenNodes(rows);
    const byParent = new Map<string | null, ChatNode[]>();

    flat.forEach((node) => {
        const mapped: ChatNode = {
            id: String(node.id),
            parent_id: node.parentId ? String(node.parentId) : null,
            titulo_botao: node.title,
            conteudo_resposta: node.answerSummary ?? node.prompt ?? "",
            link_url: node.linkUrl,
            link_label: node.linkLabel,
            tipo_no: node.responseType === "LINK" ? "RESPOSTA" : "MENU",
            ordem: node.displayOrder,
            status: node.isActive,
            slug: node.slug,
            response_type: node.responseType,
            children: [],
        };

        const bucketKey = mapped.parent_id;
        const bucket = byParent.get(bucketKey) ?? [];
        bucket.push(mapped);
        byParent.set(bucketKey, bucket);
    });

    const build = (parentId: string | null): ChatNode[] => {
        const children = byParent.get(parentId) ?? [];
        const sorted = [...children].sort((a, b) => a.ordem - b.ordem);

        return sorted.map((node) => {
            const nodeChildren = build(node.id);
            return {
                ...node,
                tipo_no: nodeChildren.length > 0 ? "MENU" : "RESPOSTA",
                children: nodeChildren,
            };
        });
    };

    return build(null);
};




export default function AdminPage() {
    const { isCheckingAccess } = useProtectedRoute({ allowedRoles: ["ADMIN"] });
    const token = useAuthStore((state) => state.token);

    const [openMenuId, setOpenMenuId] =
        useState<string | null>(null);

    const [treeData, setTreeData] = useState<ChatNode[]>([]);
    const [isLoadingTree, setIsLoadingTree] = useState(true);
    const [requestError, setRequestError] = useState<string | null>(null);
    const [isSubmittingNode, setIsSubmittingNode] = useState(false);
    const [activeTab, setActiveTab] = useState<"tree" | "email-config">("tree");

    const [modalOpen, setModalOpen] = useState(false);

    const [modalMode, setModalMode] =
        useState<"create" | "edit">("create");

    const [selectedNode, setSelectedNode] =
        useState<ChatNode | null>(null);

    const [emailConfig, setEmailConfig] = useState<InquiryEmailConfigApi | null>(null);
    const [emailConfigForm, setEmailConfigForm] = useState<EmailConfigForm>(emptyEmailConfigForm);
    const [isLoadingEmailConfig, setIsLoadingEmailConfig] = useState(false);
    const [isSavingEmailConfig, setIsSavingEmailConfig] = useState(false);
    const [emailConfigError, setEmailConfigError] = useState<string | null>(null);
    const [emailConfigSuccess, setEmailConfigSuccess] = useState<string | null>(null);

    const selectedNodeChildrenCount = useMemo(
        () => (selectedNode?.children?.length ?? 0),
        [selectedNode],
    );

    const refreshTree = async () => {
        if (!token) {
            return;
        }

        setIsLoadingTree(true);
        setRequestError(null);

        try {
            const rows = await listNavigationNodes(token);
            setTreeData(mapToTree(rows));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao carregar nos.";
            setRequestError(message);
        } finally {
            setIsLoadingTree(false);
        }
    };

    useEffect(() => {
        void refreshTree();
    }, [token]);

    useEffect(() => {
        if (activeTab !== "email-config" || !token) {
            return;
        }

        const loadEmailConfig = async () => {
            setIsLoadingEmailConfig(true);
            setEmailConfigError(null);
            setEmailConfigSuccess(null);

            try {
                const config = await fetchInquiryEmailConfig(token);
                setEmailConfig(config);
                setEmailConfigForm({
                    recipientEmail: config.recipientEmail ?? "",
                    ccEmail: config.ccEmail ?? "",
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : "Falha ao carregar configuracao de email.";
                setEmailConfigError(message);
            } finally {
                setIsLoadingEmailConfig(false);
            }
        };

        void loadEmailConfig();
    }, [activeTab, token]);

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

    const toggleStatus = async (id: string) => {
        if (!token) {
            return;
        }

        const findById = (nodes: ChatNode[]): ChatNode | null => {
            for (const item of nodes) {
                if (item.id === id) {
                    return item;
                }

                if (item.children?.length) {
                    const found = findById(item.children);
                    if (found) {
                        return found;
                    }
                }
            }

            return null;
        };

        const currentNode = findById(treeData);
        if (!currentNode) {
            return;
        }

        try {
            await updateNavigationNode(token, id, {
                isActive: !currentNode.status,
            });
            await refreshTree();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao atualizar status.";
            setRequestError(message);
        }
    };

    const handleSubmitNode = async (payload: NodeModalPayload) => {
        if (!token) {
            throw new Error("Usuario nao autenticado.");
        }

        setIsSubmittingNode(true);
        setRequestError(null);

        try {
            if (modalMode === "create") {
                await createNavigationNode(token, {
                    parentId: selectedNode?.id ?? null,
                    title: payload.title,
                    slug: buildSlugForCreate(payload.title),
                    answerSummary: payload.answerSummary || null,
                    responseType: payload.linkUrl ? "LINK" : "TEXT",
                    linkUrl: payload.linkUrl || null,
                    linkLabel: payload.linkUrl ? "Acessar link" : null,
                    isActive: payload.isActive,
                    displayOrder: selectedNodeChildrenCount,
                });
            } else {
                if (!selectedNode) {
                    throw new Error("No selecionado para edicao nao encontrado.");
                }

                await updateNavigationNode(token, selectedNode.id, {
                    title: payload.title,
                    answerSummary: payload.answerSummary || null,
                    responseType: payload.linkUrl ? "LINK" : "TEXT",
                    linkUrl: payload.linkUrl || null,
                    linkLabel: payload.linkUrl ? "Acessar link" : null,
                    isActive: payload.isActive,
                });
            }

            await refreshTree();
            closeModal();
        } finally {
            setIsSubmittingNode(false);
        }
    };

    const handleSaveEmailConfig = async () => {
        if (!token) {
            return;
        }

        const recipientEmail = emailConfigForm.recipientEmail.trim().toLowerCase();
        const ccEmail = emailConfigForm.ccEmail.trim().toLowerCase();

        if (!recipientEmail) {
            setEmailConfigError("Informe o email destinatario.");
            return;
        }

        setIsSavingEmailConfig(true);
        setEmailConfigError(null);
        setEmailConfigSuccess(null);

        try {
            const updated = await updateInquiryEmailConfig(token, {
                recipientEmail,
                ccEmail: ccEmail || null,
            });

            setEmailConfig({
                configured: true,
                id: updated.id,
                recipientEmail: updated.recipientEmail,
                ccEmail: updated.ccEmail,
                updatedAt: updated.updatedAt,
                createdAt: updated.createdAt,
                isActive: updated.isActive,
            });
            setEmailConfigSuccess("Configuracao salva com sucesso.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao salvar configuracao de email.";
            setEmailConfigError(message);
        } finally {
            setIsSavingEmailConfig(false);
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
        <AdminShell>
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

                        <Link
                            href="/usuarios"
                            className="inline-flex items-center justify-center rounded-xl bg-[#15186d] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#1c2193]"
                        >
                            Cadastrar usuarios
                        </Link>

                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab("tree")}
                            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                                activeTab === "tree"
                                    ? "bg-[#15186d] text-white shadow-lg"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            Árvore de perguntas
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("email-config")}
                            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                                activeTab === "email-config"
                                    ? "bg-[#15186d] text-white shadow-lg"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            Configuração de email
                        </button>
                    </div>

                    {activeTab === "tree" ? (
                        <>
                            <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
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
                                            {isLoadingTree ? (
                                                <tr>
                                                    <td colSpan={4} className="px-5 py-8 text-center text-sm font-semibold text-slate-500">
                                                        Carregando arvore de nos...
                                                    </td>
                                                </tr>
                                            ) : null}

                                            {!isLoadingTree && requestError ? (
                                                <tr>
                                                    <td colSpan={4} className="px-5 py-8 text-center text-sm font-semibold text-red-600">
                                                        {requestError}
                                                    </td>
                                                </tr>
                                            ) : null}

                                            {!isLoadingTree && !requestError && treeData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-5 py-8 text-center text-sm font-semibold text-slate-500">
                                                        Nenhum no cadastrado.
                                                    </td>
                                                </tr>
                                            ) : null}

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
                        </>
                    ) : (
                        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
                                        Inquiries
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                                        Destinatário padrão para dúvidas
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Atualize o email que recebe as dúvidas enviadas pelo
                                        modal do frontend.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    <p className="font-bold text-slate-800">
                                        {isLoadingEmailConfig
                                            ? "Carregando configuração..."
                                            : emailConfig?.configured
                                                ? "Configuração ativa"
                                                : "Nenhuma configuração ativa"}
                                    </p>
                                    <p className="mt-1 text-xs">
                                        {emailConfig?.recipientEmail || "Defina um destinatário"}
                                    </p>
                                </div>
                            </div>

                            {emailConfigError ? (
                                <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                    {emailConfigError}
                                </p>
                            ) : null}

                            {emailConfigSuccess ? (
                                <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                    {emailConfigSuccess}
                                </p>
                            ) : null}

                            <div className="mt-6 grid gap-5">
                                <label className="grid gap-2 text-sm font-bold text-slate-700">
                                    Email destinatário
                                    <input
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15186d] focus:bg-white focus:ring-4 focus:ring-[#15186d]/10"
                                        type="email"
                                        value={emailConfigForm.recipientEmail}
                                        onChange={(event) =>
                                            setEmailConfigForm((current) => ({
                                                ...current,
                                                recipientEmail: event.target.value,
                                            }))
                                        }
                                        placeholder="secretaria@exemplo.com"
                                    />
                                </label>

                                <label className="grid gap-2 text-sm font-bold text-slate-700">
                                    Email em cópia
                                    <input
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15186d] focus:bg-white focus:ring-4 focus:ring-[#15186d]/10"
                                        type="email"
                                        value={emailConfigForm.ccEmail}
                                        onChange={(event) =>
                                            setEmailConfigForm((current) => ({
                                                ...current,
                                                ccEmail: event.target.value,
                                            }))
                                        }
                                        placeholder="copias@exemplo.com"
                                    />
                                </label>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmailConfigForm({
                                            recipientEmail: emailConfig?.recipientEmail ?? "",
                                            ccEmail: emailConfig?.ccEmail ?? "",
                                        });
                                        setEmailConfigError(null);
                                        setEmailConfigSuccess(null);
                                    }}
                                    className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    Reverter
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveEmailConfig}
                                    disabled={isSavingEmailConfig || isLoadingEmailConfig}
                                    className="rounded-2xl bg-gradient-to-r from-[#15186d] to-red-600 px-7 py-3 text-sm font-black text-white shadow-xl shadow-red-900/20 transition hover:-translate-y-0.5 hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSavingEmailConfig ? "Salvando..." : "Salvar configuração"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <NodeModal
                open={modalOpen}
                mode={modalMode}
                node={selectedNode}
                onClose={closeModal}
                onSubmit={handleSubmitNode}
                isSubmitting={isSubmittingNode}
            />
        </main>
        </AdminShell>
    );
}