import { Library } from './Library';

export interface Book {
  author: string;
  available: boolean;
  city: string;
  copies: number;
  createdAt: Date;
  cdd: string;
  edition: string;
  id: string;
  idCutter: string;
  library?: Library
  libraryId: string;
  publisher: string;
  releaseDate: Date;
  title: string;
  tomo: number | null;
  updatedAt: Date | null;
  volume: number | null;
}