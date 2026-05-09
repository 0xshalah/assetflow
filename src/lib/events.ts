/**
 * Custom event bus for cross-component communication.
 * Used by kbar actions to trigger UI state changes (e.g., opening sheets).
 */

export const EVENTS = {
  OPEN_ADD_ITEM_SHEET: 'assetflow:open-add-item-sheet',
  OPEN_NEW_LOAN_SHEET: 'assetflow:open-new-loan-sheet'
} as const;

export function emitEvent(event: (typeof EVENTS)[keyof typeof EVENTS]) {
  window.dispatchEvent(new CustomEvent(event));
}

export function onEvent(event: (typeof EVENTS)[keyof typeof EVENTS], handler: () => void) {
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}
