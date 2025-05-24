export interface Resturant {
  id: number;
  country_id: string;
  city_id: string;
  area_id: string;
  address_en: string;
  address_ar: string;
  address_tr: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  email: string;
  logo:
    | {
        path: string;
        url: string;
      }
    | string;
  latitude: string;
  longitude: string;
  facebook_url: string;
  instagram_url: string;
  phone: string;
  contact_number: string;
  is_available: boolean;
  start_time: string;
  end_time: string;
}
export interface Permission {
  id: string;
  name: string;
  guard: string;
}
