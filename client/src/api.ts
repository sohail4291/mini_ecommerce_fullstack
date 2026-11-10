// One helper for every backend call; attaches the token
export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {

  const res = await fetch("http://localhost:4000/api" + path, { method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + (localStorage.getItem("token") ?? "") },
    body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}
