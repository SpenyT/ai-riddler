import axios from 'axios';
import type { FileMetadata } from '@/types/fileTypes';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const getAllFiles = async (): Promise<FileMetadata[]> => {
  const response = await apiClient.get<FileMetadata[]>('/files/'); 
  return response.data;
};

export const uploadFile = async (
  file: File, 
  className: string
): Promise<FileMetadata> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("class_in_question", className);

  const response = await apiClient.post<FileMetadata>('/files/upload', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getFileDownloadUrl = (id: string): string => {
  return `${BASE_URL}/files/${id}/download`;
};