import { UserModule } from 'types/auth';
import { create } from 'zustand';

interface BearState {
  modules: UserModule[];
  setModules: (modules: UserModule[]) => void;
}

const useBearStore = create<BearState>()((set) => ({
  modules: [],
  setModules: (modules) => set((state) => ({ modules: modules }))
}));

export default useBearStore;
