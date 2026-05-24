"use client";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

interface Props {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    onCreate: () => void;
    onEdit: () => void;
}

export default function ActionMenu({
    open,
    onToggle,
    onClose,
    onCreate,
    onEdit,
}: Props) {

    return (
        <div className="relative" >
            <button
                onClick={onToggle}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15186d] text-white transition hover:bg-[#20258f]"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div
                    onMouseLeave={onClose}
                    className="absolute right-0 top-12 z-999 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <button
                        onClick={() => {
                            onCreate();
                            onClose();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
                    >    <Plus size={16} />
                        Incluir novo nó
                    </button>

                    <button
                        onClick={() => {
                            onEdit();
                            onClose();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
                    >    <Pencil size={16} />
                        Alterar
                    </button>

                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                        <Trash2 size={16} />
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}