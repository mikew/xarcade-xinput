const queryParams = new URLSearchParams(window.location.search)

export const API_URL = queryParams.get('API_URL') || ''
