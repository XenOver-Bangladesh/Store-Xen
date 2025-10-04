// Z-Index Constants for consistent layering
// Higher numbers appear above lower numbers

export const Z_INDEX = {
  // Base content layers
  CONTENT: 1,
  
  // Navigation layers
  SIDEBAR: 30,
  HEADER: 50,
  
  // Dropdown and overlay layers
  DROPDOWN: 9999,
  MOBILE_OVERLAY: 40,
  
  // Modal layers (highest priority)
  MODAL_OVERLAY: 10000,
  MODAL_CONTENT: 10001,
  
  // Toast/notification layers (if needed in future)
  TOAST: 10002,
  
  // Emergency/error overlays (highest)
  EMERGENCY: 99999
}

export default Z_INDEX
