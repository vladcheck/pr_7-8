export interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  submitPassword: string;
}

export type ReducerAction = {
  type: "SET_VALUE";
  field: keyof FormState;
  value: FormState[keyof FormState];
};
