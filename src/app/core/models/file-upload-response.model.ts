export interface FileUploadResponse {
  id: number;
  originalName: string;
  downloadToken: string;
  downloadUrl: string;
  expiresAt: string;
}
