import { UserRole } from "@root-shared/types/User";

export interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  submitPassword: string;
  roles: UserRole[];
}

export type ReducerAction = {
  [K in keyof FormState]: {
    type: "SET_VALUE";
    field: K;
    value: FormState[K];
  };
}[keyof FormState];
