export interface signupResType {
  message: string;
}

export interface loginResType {
  token: string;
  data: {
  id: string;
  userName: string;
  email: string;
  bio?: string;
  name?: string;
  address?: string;
  profile_pic?: string;
  background_pic?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  other?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  };
  message: string;
}
