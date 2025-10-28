export default async function sendRequest(url, method = 'GET', payload) {
  const options = { method };
  if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  try {
    const res = await fetch(`http://127.0.0.1:8000${url}`, options);
    if (res.ok) return res.json();
  } catch (err) {
    console.log(err, 'error in send-request');
    return err;
  }
}