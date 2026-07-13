import type { FileType } from "@chat/attachments/types/attachments"

export interface AttachmentPickerState {
  type: FileType | null
  requestId: number
}

export const initialAttachmentPickerState: AttachmentPickerState = {
  type: null,
  requestId: 0
}

export const attachmentPickerReducer = (state: AttachmentPickerState, type: FileType): AttachmentPickerState => ({
  type,
  requestId: state.requestId + 1
})
