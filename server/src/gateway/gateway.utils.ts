// Gateway utility functions for managing socket connections, caching, and queues

// ============== CONFIG ==============
export const GATEWAY_CONFIG = {
  MAX_CACHE_SIZE: 1000, // Max conversations to cache
  CACHE_TTL_MS: 30 * 60 * 1000, // 30 minutes TTL
  CLEANUP_PERCENTAGE: 0.2, // Remove oldest 20% when cache is full
} as const

// ============== MAPS ==============
// Map to store userId -> socketId
export const userSocketMap = new Map<string, string>()

// Cache for conversations with TTL (conversationKey -> { data: conversation, timestamp: number })
export const conversationCache = new Map<string, { data: any; timestamp: number }>()

// Queue for messages per conversation (conversationId -> array of message operations)
export const messageQueue = new Map<
  string,
  Array<{ messageData: any; fileData?: any; resolve: Function; reject: Function }>
>()

// Map to track if a conversation is currently being processed
export const processingMap = new Map<string, boolean>()

// ============== HELPER FUNCTIONS ==============

/**
 * Generate a unique key for private conversations
 * Sorts sender and recipient IDs to ensure A->B and B->A use the same key
 */
export function getPrivateConversationKey(sender: string, recipient: string): string {
  const ids = [sender, recipient].sort()
  return `private:${ids[0]}:${ids[1]}`
}

/**
 * Check if cache entry has expired based on TTL
 */
export function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > GATEWAY_CONFIG.CACHE_TTL_MS
}

/**
 * Clean old entries from cache when it exceeds max size
 * Removes oldest entries based on timestamp
 */
export function cleanCacheIfNeeded(): void {
  if (conversationCache.size >= GATEWAY_CONFIG.MAX_CACHE_SIZE) {
    const entriesToRemove = Math.floor(GATEWAY_CONFIG.MAX_CACHE_SIZE * GATEWAY_CONFIG.CLEANUP_PERCENTAGE)
    const sortedEntries = [...conversationCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)

    for (let i = 0; i < entriesToRemove; i++) {
      conversationCache.delete(sortedEntries[i][0])
    }
  }
}

/**
 * Get cached conversation if it exists and is not expired
 */
export function getCachedConversation(conversationKey: string): any | null {
  const cached = conversationCache.get(conversationKey)
  if (cached && !isCacheExpired(cached.timestamp)) {
    return cached.data
  }
  return null
}

/**
 * Set cached conversation with timestamp
 */
export function setCachedConversation(conversationKey: string, data: any): void {
  cleanCacheIfNeeded()
  conversationCache.set(conversationKey, { data, timestamp: Date.now() })
}

/**
 * Add message to queue for a conversation
 */
export function addToMessageQueue(conversationKey: string, messageData: any, fileData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!messageQueue.has(conversationKey)) {
      messageQueue.set(conversationKey, [])
    }
    messageQueue.get(conversationKey).push({ messageData, fileData, resolve, reject })
  })
}

/**
 * Get next message from queue
 */
export function getNextFromQueue(
  conversationKey: string,
): { messageData: any; fileData?: any; resolve: Function; reject: Function } | undefined {
  const queue = messageQueue.get(conversationKey)
  return queue?.shift()
}

/**
 * Check if queue has messages for a conversation
 */
export function hasQueuedMessages(conversationKey: string): boolean {
  const queue = messageQueue.get(conversationKey)
  return !!(queue && queue.length > 0)
}

/**
 * Clear queue for a conversation
 */
export function clearQueue(conversationKey: string): void {
  messageQueue.delete(conversationKey)
}

/**
 * Check if a conversation is currently being processed
 */
export function isProcessing(conversationKey: string): boolean {
  return processingMap.get(conversationKey) ?? false
}

/**
 * Mark conversation as processing or finished
 */
export function setProcessing(conversationKey: string, processing: boolean): void {
  if (processing) {
    processingMap.set(conversationKey, true)
  } else {
    processingMap.delete(conversationKey)
  }
}

/**
 * Get socket ID for a user
 */
export function getUserSocketId(userId: string): string | undefined {
  return userSocketMap.get(userId)
}

/**
 * Set socket ID for a user
 */
export function setUserSocket(userId: string, socketId: string): void {
  userSocketMap.set(userId, socketId)
}

/**
 * Remove user socket mapping
 */
export function removeUserSocket(userId: string): void {
  userSocketMap.delete(userId)
}

/**
 * Remove socket and get user ID if found
 */
export function removeSocketUser(socketId: string): string | null {
  for (const [userId, sId] of userSocketMap.entries()) {
    if (sId === socketId) {
      userSocketMap.delete(userId)
      return userId
    }
  }
  return null
}

/**
 * Check if user is online
 */
export function isUserOnline(userId: string): boolean {
  return userSocketMap.has(userId)
}
