import { apiRequest } from "./http";

/** Uploads through the server proxy so the ImgBB API key stays private. */
export async function uploadMenuImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await apiRequest<{ url: string }>("/api/uploads/image", {
    method: "POST",
    body: form,
  });
  return res.data!.url;
}
