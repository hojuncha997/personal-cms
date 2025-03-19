import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoryState {
    expandedCategories: number[];
    toggleCategory: (id: number) => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            expandedCategories: [],
            toggleCategory: (id) => set((state) => ({
                expandedCategories: state.expandedCategories.includes(id)
                    ? state.expandedCategories.filter((categoryId) => categoryId !== id)
                    : [...state.expandedCategories, id]
            }))
        }),
        {
            name: 'category-store'
        }
    )
); 