import { useEffect, useMemo, useReducer } from "react"
import { initialGroupModalState, groupModalReducer } from "@chat/conversations/state/groupModalState"
import { useCreateGroupConversationMutation, useGroupModalDataQuery } from "@chat/conversations/queries/groupModalQueries"
import { filterGroupModalData } from "@chat/conversations/utils/groupModal"

export const useGroupModal = ({ onClose }: { onClose: () => void }) => {
  const [state, dispatch] = useReducer(groupModalReducer, initialGroupModalState)
  const { data, error } = useGroupModalDataQuery()
  const createGroupMutation = useCreateGroupConversationMutation()
  const selectedIdSet = useMemo(() => new Set(state.selectedIds), [state.selectedIds])
  const filteredData = useMemo(() => filterGroupModalData(data, state.searchQuery), [data, state.searchQuery])

  useEffect(() => {
    if (!error) return
    console.error("Error fetching data:", error)
  }, [error])

  const createGroup = () => {
    if (state.selectedIds.length < 2) return
    createGroupMutation.mutate(
      { participants: state.selectedIds },
      {
        onSuccess: () => {
          onClose()
        },
        onError: (error: unknown) => {
          console.error("Error creating group:", error)
        }
      }
    )
  }

  return {
    state,
    data,
    selectedIdSet,
    filteredData,
    status: {
      isCreatingGroup: createGroupMutation.isPending
    },
    handlers: {
      setSearchQuery: (value: string) => dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
      toggleSelectedId: (value: string) => dispatch({ type: "TOGGLE_SELECTED_ID", payload: value }),
      createGroup
    }
  }
}
