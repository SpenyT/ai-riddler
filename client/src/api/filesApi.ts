import type { AxiosInstance } from "axios";
import type { FileMetadata } from "@/types/fileTypes";

export function createFilesApi(apiClient: AxiosInstance) {
  return {
    getAllFiles: async (): Promise<FileMetadata[]> => {
      const response = await apiClient.get<FileMetadata[]>("/files/");
      return response.data;
    },
    
    uploadFile: async (file: File, className: string): Promise<FileMetadata> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class_in_question", className);

      const response = await apiClient.post<FileMetadata>(
        "/files/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, }
      );

      return response.data;
    },

    getFileDownloadUrl: (id: string): string => {
      return `/files/${id}/download`;
    },
  };
}
