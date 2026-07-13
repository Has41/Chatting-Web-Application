export interface GroupModalState {
  searchQuery: string
  selectedIds: string[]
}

export type GroupModalAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_SELECTED_ID"; payload: string }
  | { type: "CLEAR_SELECTION" }

export const initialGroupModalState: GroupModalState = {
  searchQuery: "",
  selectedIds: []
}

export const groupModalReducer = (state: GroupModalState, action: GroupModalAction): GroupModalState => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "TOGGLE_SELECTED_ID":
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter((id) => id !== action.payload)
          : [...state.selectedIds, action.payload]
      }
    case "CLEAR_SELECTION":
      return { ...state, selectedIds: [] }
    default:
      return state
  }
}
