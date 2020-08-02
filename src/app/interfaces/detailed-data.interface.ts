import { ArtObject } from './artObject.interface';

export interface DetailedData {
  artObject?: ArtObject;
  artObjectPage?: {
    objectNumber: string;
  };
}
