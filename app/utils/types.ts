export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  isPinned?: boolean;
  // Add any other properties your Note type might have
}
export interface Notes {
  title: string;
  content: string;
  // Add any other properties your Note type might have
}
