export interface FileMetadata {
  _id: string;
  filename: string;
  file_type: string;
  size: number;
  date_uploaded: string;
  relevant_date: string;
  class_in_question: string;
  file_hash: string;
}


export interface FileResponse {
  message: string;
  data: FileMetadata[];
}