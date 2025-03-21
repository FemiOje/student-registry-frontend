export interface HeaderProps {
    address?: string | undefined;
    openModal: () => void;
    disconnectWallet: () => Promise<void>;
}

export interface StudentData {
    id: bigint;
    age: bigint;
    fname: bigint;
    lname: bigint;
    phone_number: bigint;
    is_active: boolean;
}

// From form to add new student
export interface NewStudentData {
  age: string,
  fname: string,
  lname: string,
  phone_number: string,
  is_active: boolean
}

export interface TableRowProps {
    age: bigint;
    fname: bigint;
    id: bigint;
    is_active: boolean;
    lname: bigint;
    phone_number: bigint;
}
