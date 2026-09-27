// Conversation marker / bookmark utility.
export function markConversation(id: number, label: string) {
  localStorage.setItem(`conv:${id}:label`, label);
}
export function getMarker(id: number): string | null {
  return localStorage.getItem(`conv:${id}:label`);
}
