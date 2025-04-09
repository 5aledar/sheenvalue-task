export interface Role {
  id: number;
  name?: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  permissions?: string[] | Permission[];
  guard: string;
}
export interface Permission {
  id: string;
  name: string;
  guard: string;
}
