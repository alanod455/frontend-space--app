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

export async function update(id, data) {
  return sendRequest(`${url}${id}/`, 'PUT', data);
}

export async function deleteSession(sessionId) {
  return sendRequest(`${url}${sessionId}/`, "DELETE");
}
