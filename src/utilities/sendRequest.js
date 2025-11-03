export default async function sendRequest(url, method = 'GET', payload) {
  const token = localStorage.getItem('token');

  const options = { method };
  if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  const authExcluded = ['/users/login/', '/users/signup/'];
  if (token && !authExcluded.includes(url)) {
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`http://127.0.0.1:8000${url}`, options);
    const data = await res.json();

    if (!res.ok) return data;
    return data;
  } catch (err) {
    console.log(err, "error in send-request");
    throw new Error(err);
  }
}