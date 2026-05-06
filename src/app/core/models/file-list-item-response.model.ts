export interface FileListItemResponse {
  id: number;
  originalName: string;
  contentType: string;
  size: number;
  downloadToken: string;
  downloadUrl: string;
  expiresAt: string;
  createdAt: string;
}
