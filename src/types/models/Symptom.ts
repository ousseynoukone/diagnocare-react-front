export interface SymptomItem {
  id: string;
  label: string;
}

export interface MLSymptomsMetadata {
  count: number;
  en: SymptomItem[];
  fr: SymptomItem[];
}

export interface MLFeaturesMetadataResponse {
  symptoms: MLSymptomsMetadata;
  features: any;
  languages: string[];
}
