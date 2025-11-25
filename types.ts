
export interface POI {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  story: string;
  image: string;
  gps: [number, number];
  tags: string[];
}

export interface RouteInfo {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  description: string;
  image: string;
  pois: string[]; // array of POI IDs
}

export interface QAPair {
  id: string;
  keywords: string[];
  answer: string;
  poi?: string;
  image?: string;
}
