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
export interface Area {
  id: number;
  city_id: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  created_at: string;
  updated_at: string;
  city?: City;
}

export interface Driver {
  id: number;
  country_id: number;
  city_id: number;
  area_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  phone_number: string;
  email: string;
  nationality: string;
  national_id: string;
  vehicle_type: 'CAR' | 'MOTORCYCLE' | 'BICYCLE';
  plate_number: string;
  has_driving_license: number;
  has_worked_before: number;
  notes: string;
  profile_image: string | null;
  vehicle_image: string | null;
  max_capacity: string;
  vehicle_max_distance: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_available: number;
  starting_work_at: Date;
  finishing_work_at: Date;
  is_application_locked: number;
  country: Country;
  city: City;
  area: Area;
  password: string;
  password_confirmation: string;
}
