export interface ArtObject {
  objectNumber: string;
  title: string;
  webImage: {
    url: string;
  };
  description?: string;
  dating?: {
    presentingDate: string;
  };
  principalOrFirstMaker?: string;
  principalMaker?: string;
  longTitle: string;
}
