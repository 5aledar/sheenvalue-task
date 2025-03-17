export interface Country {
  id: number;
  name: string;
  currency: string;
  code: string;
  created_at: string;
  updated_at: string;
}
export interface City {
  id: number;
  country_id: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  created_at: string;
  updated_at: string;
  country?: Country;
}
