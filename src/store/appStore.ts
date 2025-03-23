import { create } from "zustand";

interface WindowState {
    id: number;
    title: string;
    visible: boolean;
    zIndex: number;
}

interface AppStore {
    windows: WindowState[];
    openApp: (title: string) => void;
    closeApp: (id: number) => void;
    minimizeApp: (id: number) => void;
    restoreApp: (id: number) => void;
    bringToFront: (id: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    windows: [],
    openApp: (title) =>
        set((state) => {
            const newId = Date.now();
            return {
                windows: [
                    ...state.windows,
                    { id: newId, title, visible: true, zIndex: newId },
                ],
            };
        }),
    closeApp: (id) =>
        set((state) => ({
            windows: state.windows.filter((window) => window.id !== id),
        })),
    minimizeApp: (id) =>
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, visible: false } : window
            ),
        })),
    restoreApp: (id) =>
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, visible: true } : window
            ),
        })),
    bringToFront: (id) =>
        set((state) => {
            const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex), 0);
            return {
                windows: state.windows.map((window) =>
                    window.id === id ? { ...window, zIndex: maxZIndex + 1 } : window
                ),
            };
        }),
}));