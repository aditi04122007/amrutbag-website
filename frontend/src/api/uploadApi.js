import api from "./api";

export const uploadImage = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const res = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.imageUrl;
};