"use client";

import { ChatNode } from "@/types/chat-node";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import ActionMenu from "./ActionMenu";
import StatusBadge from "./StatusBadge";


interface Props {
    node: ChatNode;
    level?: number;
    onToggleStatus: (id: number) => void;
    onCreateNode: (node: ChatNode) => void;
    onEditNode: (node: ChatNode) => void;
    openMenuId: number | null;
    setOpenMenuId: (id: number | null) => void;
}

export default function TreeNode({
    node,
    level = 0,
    onToggleStatus,
    onCreateNode,
    onEditNode,
    openMenuId,
    setOpenMenuId,
}: Props) {
    const [open, setOpen] = useState(true);

    const hasChildren = node.children && node.children.length > 0;

    return (
        <>
            <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                    <div
                        className="flex items-center gap-3"
                        style={{ paddingLeft: `${level * 24}px` }}
                    >
                        {hasChildren ? (
                            <button
                                onClick={() => setOpen(!open)}
                                className="text-slate-500 transition hover:text-[#15186d]"
                            >
                                {open ? (
                                    <ChevronDown size={18} />
                                ) : (
                                    <ChevronRight size={18} />
                                )}
                            </button>
                        ) : (
                            <div className="w-[18px]" />
                        )}

                        <div>
                            <p className="font-semibold text-slate-800">
                                {node.titulo_botao}
                            </p>

                            {node.conteudo_resposta && (
                                <p className="mt-1 text-sm text-slate-500">
                                    {node.conteudo_resposta}
                                </p>
                            )}
                        </div>
                    </div>
                </td>

                <td className="px-5 py-4 text-center">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold
            ${node.tipo_no === "MENU"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                    >
                        {node.tipo_no}
                    </span>
                </td>


                <td className="px-5 py-4 text-center">
                    <StatusBadge active={node.status} onToggle={() => onToggleStatus(node.id)} />
                </td>

                <td className="px-5 py-4 text-center">
                    <ActionMenu
                        open={openMenuId === node.id}
                        onToggle={() =>
                            setOpenMenuId(
                                openMenuId === node.id ? null : node.id
                            )
                        }
                        onClose={() => setOpenMenuId(null)}
                        onCreate={() => onCreateNode(node)}
                        onEdit={() => onEditNode(node)}
                    />
                </td>
            </tr>

            {
                open &&
                node.children?.map((child) => (
                    <TreeNode
                        key={child.id}
                        node={child}
                        level={level + 1}
                        onToggleStatus={onToggleStatus}
                        onCreateNode={onCreateNode}
                        onEditNode={onEditNode}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                    />
                ))
            }
        </>
    );
}