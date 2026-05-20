export interface FileUploadResponse {
  id: number;
  originalName: string;
  size: number;
  downloadToken: string;
  downloadUrl: string;
  expiresAt: string;
}