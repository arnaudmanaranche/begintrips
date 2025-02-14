import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface JourneyStore {
  checkList: {
    item: string
    isDone: boolean
    id: string
    isFavorite?: boolean
    isArchived?: boolean
  }[]
  toggleItem: (item: string) => void
  deleteItem: (item: string) => void
  addItem: (item: string, id: string) => void
  itemsChecked: number
  toggleFavorite: (item: string) => void
  archiveItem: (item: string) => void
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set) => ({
      checkList: [],
      toggleItem: (item) => {
        set((state) => {
          const itemToToggle = state.checkList.find((i) => i.item === item)
          if (!itemToToggle) return state
          return {
            ...state,
            itemsChecked: state.itemsChecked + (itemToToggle.isDone ? -1 : 1),
            checkList: state.checkList.map((i) => {
              if (i.item === item) {
                return { ...i, isDone: !i.isDone }
              }
              return i
            }),
          }
        })
      },
      deleteItem: (item) => {
        set((state) => {
          if (state.checkList.length === 1) {
            return {
              ...state,
              checkList: state.checkList.filter((i) => i.item !== item),
              itemsChecked: 0,
            }
          }

          return {
            ...state,
            checkList: state.checkList.filter((i) => i.item !== item),
            itemsChecked: state.checkList.filter((i) => i.isDone).length,
          }
        })
      },
      addItem: (item, id) => {
        set((state) => {
          return {
            ...state,
            checkList: [...state.checkList, { item, isDone: false, id }],
          }
        })
      },
      itemsChecked: 0,
      toggleFavorite: (item) => {
        set((state) => {
          return {
            ...state,
            checkList: state.checkList.map((i) => {
              if (i.item === item) {
                return { ...i, isFavorite: !i.isFavorite }
              }
              return i
            }),
          }
        })
      },
      archiveItem: (item) => {
        set((state) => {
          return {
            ...state,
            checkList: state.checkList.map((i) => {
              if (i.item === item) {
                return { ...i, isArchived: !i.isArchived }
              }
              return i
            }),
          }
        })
      },
    }),
    {
      name: 'journey',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
