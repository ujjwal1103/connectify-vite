import { create } from 'zustand';

// Define a type for the modal state
interface ModalState {
  isModalOpen: boolean;
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

// Create the Zustand store with TypeScript
const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false, // Initial state
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })), // Toggles the modal
  openModal: () => set({ isModalOpen: true }), // Opens the modal
  closeModal: () => set({ isModalOpen: false }), // Closes the modal
}));

export default useModalStore;
