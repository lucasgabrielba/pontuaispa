export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  reference?: string | null;
  addressable_id: string;
  addressable_type: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Paginação
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

// Opções de select para formulários
export interface SelectOption {
  label: string;
  value: string;
}

// Uploads
export interface FileUploadResponse {
  file_path: string;
  status: string;
  message?: string;
}