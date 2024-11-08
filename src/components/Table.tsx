import { useState, useEffect } from "react";
import { useReadContract } from "@starknet-react/core";
import { student_contract_abi } from "../abis/student_contract_abi";
import toast from "react-hot-toast";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

// Define the type for student data based on your contract's data structure
interface StudentData {
  id: bigint;
  age: bigint;
  fname: bigint;
  lname: bigint;
  phone_number: bigint;
  is_active: boolean;
}

export default function Table() {
  const [studentContractData, setStudentContractData] = useState<StudentData[]>([]);

  const { data, error } = useReadContract({
    abi: student_contract_abi,
    functionName: "get_all_students",
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
    args: [],
  });

  useEffect(() => {
    if (error) {
      toast.error("Error occurred fetching contract data. Please refresh the page.");
      return;
    }
    if (data) {
      console.log("Data: ", data);
      setStudentContractData(data);
    }
  }, [data, error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <table className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <TableHeader />
        <tbody>
          {studentContractData?.map((item) => (
            <TableRow
              key={item.id.toString()} // Convert BigInt ID to string for unique key
              id={item.id}
              age={item.age}
              fname={item.fname}
              lname={item.lname}
              phone_number={item.phone_number}
              is_active={item.is_active}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
