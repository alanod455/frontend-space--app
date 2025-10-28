import sendRequest from "./sendRequest";
const url = "/sessions/"

export async function index() {
    return sendRequest(url)
}

export function show(sessionId) {
    return sendRequest(`${url}${sessionId}/`);
}

export async function create(sessionData) {
  return sendRequest(url, 'POST', sessionData);
}

