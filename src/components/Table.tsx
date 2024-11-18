import { useState, useEffect } from "react";
import { useAccount, useContract, useReadContract, useSendTransaction } from "@starknet-react/core";
import { student_contract_abi } from "../abis/student_contract_abi";
import toast from "react-hot-toast";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

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
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState<boolean>(false);
  const [newStudentData, setNewStudentData] = useState({
    age: Number(16),
    fname: String("firstname"),
    lname: String("lastname"),
    phone_number: Number(8012223333),
    is_active: Boolean(true)
  });


  const { data: allStudentsData, error: getStudentsError, isLoading: isLoadingAllStudents } = useReadContract({
    abi: student_contract_abi,
    functionName: "get_all_students",
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
    args: [],
    refetchInterval: 15000
  });

  const { address } = useAccount();

  const { contract } = useContract({
    abi: student_contract_abi,
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
  });

  const { send: sendAddNewStudent, status: addNewStudentStatus, error: addNewStudentError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("add_student", [newStudentData.fname, newStudentData.lname, newStudentData.phone_number, newStudentData.age, newStudentData.is_active])]
        : undefined,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudentData({
      ...newStudentData,
      [name]: value,
    });
  };

  const handleAddNewStudent = async () => {
    await sendAddNewStudent();
    const errorMessage = addNewStudentError?.message?.toString() || "An unexpected error occurred";

    switch (addNewStudentStatus) {
      case "pending":
        toast.loading("Adding new student");
        break;

      case "error":
        toast.error(errorMessage);
        break;

      case "success":
        toast.success("New student added successfully.");
        break;

      default:
        break;
    }
    setIsNewStudentModalOpen(false);
  };

  useEffect(() => {
    toast.loading("Fetching data");
    if (!isLoadingAllStudents) {
      toast.dismiss();
    }

    if (getStudentsError) {
      toast.error("Error occurred fetching contract data. Please refresh the page.");
      return;
    }
    if (allStudentsData) {
      setStudentContractData(allStudentsData);
    }
  }, [allStudentsData, getStudentsError, isLoadingAllStudents]);

  return (
    <>
      <div className="flex flex-col items-center w-fit m-auto justify-center min-h-screen p-4 sm:p-8">
        <div className="flex py-4 ml-auto">
          <button className="bg-blue-700 text-white p-3 mx-2 rounded-md hover:bg-blue-600" onClick={() => setIsNewStudentModalOpen(true)}>Add New Student</button>
          {/* <button className="bg-blue-700 text-white p-3 mx-2 rounded-md hover:bg-blue-600">Refresh</button> */}
        </div>

        <table className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <TableHeader />
          <tbody>
            {studentContractData?.map((item) => (
              <TableRow
                key={item.id.toString()}
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

      {/* Add New Student Modal */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleAddNewStudent}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={newStudentData.fname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={newStudentData.lname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  name="age"
                  value={newStudentData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={newStudentData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsNewStudentModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
