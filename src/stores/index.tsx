import {create} from 'zustand';

type Store = {
    mensagem: string;
    setMensagem: (mensagem: string) => void;
}

export const useStore = create<Store>((set) => ({
    mensagem: '',
    setMensagem: (mensagem) => set({mensagem}),
}));