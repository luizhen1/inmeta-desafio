export interface DashboardStats {
  completionPercentage: number;
  mostPendingDocumentTypes: {
    documentTypeName: string;
    pendingCount: number;
  }[];
  latestUploads: {
    documentId: string;
    employeeName: string;
    documentTypeName: string;
    sentAt: Date;
    status: string;
  }[];
}

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
}