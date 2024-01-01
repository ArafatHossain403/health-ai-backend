export interface ResponseModel {
  success: boolean;
  message: string;
  code: number;
}

export interface DiabetesHistory {
  id: number;
  user_id: number;
  pregnancies: number;
  glucose: number;
  s_bp: number;
  d_bp: number;
  mbp: number;
  skin_thickness: number;
  insulin: number;
  height: number;
  weight: number;
  bmi: number;
  age: number;
  outcome: number;
  created_at: Date;
  user: UserModel;
}

export interface UserModel {
  id: number;
  email: string;
  name: string;
  // password: string;
  mobile: string;
  address: string;
  gender: string;
  birth_date: Date;
  status: number;
}

export interface AdminModel {
  id: number;
  email: string;
  name: string;
  status: number;
}
