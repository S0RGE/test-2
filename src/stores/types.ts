export interface IUser {
  login: string;
  password: string | null;
  recordType: RECORD_TYPE;
  mark?: string[];
}

export interface IUserWithStringMark extends Omit<IUser, "mark"> {
  mark?: string;
}

export enum RECORD_TYPE {
  LDAP = "LDAP",
  LOCAL = "Локальная",
}
