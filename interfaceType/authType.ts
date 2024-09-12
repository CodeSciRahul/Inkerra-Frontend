export interface signupResType {
  token: string;
  data: {
    userName: string;
    email: string;
    id: number;
  };
  message: string;
}

export interface loginResType {
  token: string;
  data: {
    userName: string;
    email: string;
    id: number;
  };
  message: string;
}
