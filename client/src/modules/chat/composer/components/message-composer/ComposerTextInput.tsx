import type { ComposerSendHandler } from "@chat/composer/types/messageComposer"

interface ComposerTextInputProps {
  messageContent: string
  conversationId?: string
  onChange: (value: string) => void
  onSend: ComposerSendHandler
}

const ComposerTextInput = ({ messageContent, conversationId, onChange, onSend }: ComposerTextInputProps) => (
  <input
    type="text"
    placeholder="Type a message..."
    className="w-3/4 rounded-md border border-slate-200 p-3 text-sm focus:outline-none"
    value={messageContent}
    onChange={(event) => onChange(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        onSend({
          conversationId,
          messageContent,
          messageType: "text"
        })
      }
    }}
  />
)

export default ComposerTextInput
