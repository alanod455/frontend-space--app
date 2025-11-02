import sendRequest from './sendRequest';

const BASE_URL = '/sessions';

export async function getTasks(sessionId) {
  return sendRequest(`${BASE_URL}/${sessionId}/tasks/`);
}

export async function createTask(sessionId, taskData) {
  return sendRequest(`${BASE_URL}/${sessionId}/tasks/`, 'POST', taskData);
}

export async function updateTask(sessionId, taskId, taskData) {
  return sendRequest(`${BASE_URL}/${sessionId}/tasks/${taskId}/`, 'PUT', taskData);
}

export async function deleteTask(sessionId, taskId) {
  return sendRequest(`${BASE_URL}/${sessionId}/tasks/${taskId}/`, 'DELETE');
}