
export interface Book {
  id: string;
  title: string;
  author?: string;
  content: string;
  importedAt: number;
  coverColor: string;
}

export interface PDFProcessResult {
  title: string;
  content: string;
}

export enum AppView {
  LIBRARY = 'LIBRARY',
  READER = 'READER',
  IMPORTER = 'IMPORTER'
}
