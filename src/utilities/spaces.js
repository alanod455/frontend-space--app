import sendRequest from "./sendRequest";

export function sessionSpace(sessionId) {
    return sendRequest(`/sessions/${sessionId}/spaces/`)
}