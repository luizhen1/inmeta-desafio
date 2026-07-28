export class DocumentVersion {
  version: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  sentAt: Date;
  sentBy: string;

  constructor(
    version: number,
    isActive: boolean,
    sentBy: string,
    metadata?: Record<string, any>,
    sentAt?: Date,
  ) {
    this.version = version;
    this.isActive = isActive;
    this.sentBy = sentBy;
    this.metadata = metadata ?? {};
    this.sentAt = sentAt ?? new Date();
  }
}