import { create } from "zustand";
import { Group } from "../interfaces/group";

interface IGroupStore {
    currentGroup: Group | null;
    setCurrentGroup: (_: Group | null) => void;
    groups: Group[];
    setGroups: (_: Group[]) => void;
    exportGroup: Group | null,
    setExportGroup: (_: Group | null) => void;
    selectedGroup: Group | null,
    setSelectedGroup: (_: Group | null) => void;
}

const useGroupStore = create<IGroupStore>((set) => ({
    currentGroup: null,
    setCurrentGroup: (state: Group | null) => {set(() => ({currentGroup: state}))},
    groups: [],
    setGroups: (state: Group[]) => {set(() => ({groups: state}))},
    exportGroup: null,
    setExportGroup: (state: Group | null) => {set(() => ({exportGroup: state}))},
    selectedGroup: null,
    setSelectedGroup: (state: Group | null) => {set(() => ({selectedGroup: state}))},
}));

export default useGroupStore;