import api from "./api";

export async function uploadFile(file: File, folder = "green-rock"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data.url as string;
}

export async function uploadFiles(files: File[], folder = "green-rock"): Promise<string[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  formData.append("folder", folder);

  const res = await api.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return (res.data.data as { url: string }[]).map((r) => r.url);
}
