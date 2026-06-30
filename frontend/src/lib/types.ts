export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  categories: string[];
  coverUrl?: string;
  description?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
