import { useState, useEffect } from "react";
import { useAccount, useReadContract, useContract, useSendTransaction } from "@starknet-react/core";
import { student_contract_abi } from "../abis/student_contract_abi";
import { StudentData, NewStudentData } from "../types";
import toast from "react-hot-toast";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default function Table() {
  const [studentContractData, setStudentContractData] = useState<StudentData[]>([]);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState<boolean>(false);
  const [newStudentData, setNewStudentData] = useState<NewStudentData>({
    age: "",
    fname: String(""),
    lname: String(""),
    phone_number: "",
    is_active: Boolean(true)
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    phone_number: "",
    age: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewStudentData({
      ...newStudentData,
      [name]: value,
    });

    switch (name) {
      case "fname":
        if (value.length > 31) {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name} cannot exceed 31 characters.`,
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        break;

      case "lname":
        if (value.length > 31) {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name} cannot exceed 31 characters.`,
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        break;

      case "age":
        if (!/^\d+$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be a positive integer.",
          }));
        } else if (parseInt(value) <= 0) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be greater than 0.",
          }));
        }
        else if (BigInt(value) > BigInt("18446744073709551615")) {
          setErrors((prev) => ({
            ...prev,
            age: "Age cannot exceed the maximum value of u64.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, age: "" }));
        }
        break;

      case "phone_number":
        if (!/^\d{10}$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            phone_number: "Phone number must be exactly 10 digits.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, phone_number: "" }));
        }
        break;

      default:
        break;
    }
  };


  const { data: allStudentsData, error: getStudentsError, isLoading: isLoadingAllStudents } = useReadContract({
    abi: student_contract_abi,
    functionName: "get_all_students",
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
    args: [],
    refetchInterval: 5000
  });


  const { contract } = useContract({
    abi: student_contract_abi,
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
  });

  const { address } = useAccount();

  const { send: sendAddNewStudent, status: addNewStudentStatus, error: addNewStudentError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("add_student", [
          newStudentData.fname && newStudentData.fname.length <= 31 ? newStudentData.fname : "null",
          newStudentData.lname && newStudentData.lname.length <= 31 ? newStudentData.lname : "null",
          newStudentData.phone_number ? BigInt(newStudentData.phone_number) : BigInt(1),
          newStudentData.age ? BigInt(newStudentData.age) : BigInt(1),
          newStudentData.is_active
        ])]
        : undefined,
  });

  let isValid = true;

  const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { fname: "", lname: "", phone_number: "", age: "" };

    if (newStudentData.fname.length > 31) {
      isValid = false;
      newErrors.fname = "First name cannot exceed 31 characters.";
    }

    if (newStudentData.lname.length > 31) {
      isValid = false;
      newErrors.lname = "Last name cannot exceed 31 characters.";
    }

    if (!/^\d+$/.test(newStudentData.age)) {
      isValid = false;
      newErrors.age = "Age must be a positive integer.";
    } else if (BigInt(newStudentData.age) > BigInt("18446744073709551615")) {
      isValid = false;
      newErrors.age = "Age cannot exceed the maximum value of u64.";
    }

    if (!/^\d{10}$/.test(newStudentData.phone_number)) {
      isValid = false;
      newErrors.phone_number = "Phone number must be exactly 10 digits.";
    }

    setErrors(newErrors);

    if (!isValid) return;

    setIsNewStudentModalOpen(false);


    await sendAddNewStudent();
    const errorMessage = addNewStudentError?.message?.toString() || "An unexpected error occurred";

    switch (addNewStudentStatus) {
      case "pending":
        toast.loading("Adding new student");
        break;

      case "error":
        toast.error(errorMessage);
        break;

      case "idle":
        toast.error("Transaction is idle.");
        break;

      case "success":
        toast.success("New student added successfully.");
        break;


      default:
        console.log("Status of the transaction: ", addNewStudentStatus);
        break;
    }
  };

  useEffect(() => {
    if (!isLoadingAllStudents) {
      toast.loading("Fetching data");
    }

    if (getStudentsError) {
      toast.error("Error occurred fetching contract data. Please refresh the page.");
      return;
    }
    if (allStudentsData) {
      const typedData = allStudentsData.map(student => ({
        id: BigInt(student.id),
        age: BigInt(student.age),
        fname: BigInt(student.fname),
        lname: BigInt(student.lname),
        phone_number: BigInt(student.phone_number),
        is_active: student.is_active
      }));
      setStudentContractData(typedData);
      toast.dismiss();
    }
  }, [allStudentsData, getStudentsError, isLoadingAllStudents]);

  const isFormValid =
    newStudentData.fname.length <= 31 &&
    newStudentData.lname.length <= 31 &&
    /^\d+$/.test(newStudentData.age) && parseInt(newStudentData.age) > 0 &&
    BigInt(newStudentData.age) <= BigInt("18446744073709551615") &&
    /^\d{10}$/.test(newStudentData.phone_number) &&
    Object.values(errors).every((error) => error === "");

  return (
    <>
      <div className="flex flex-col items-center w-full justify-center min-h-screen p-4 sm:p-8">
        <div className="flex py-4 ml-auto">
          <button
            className="bg-blue-700 text-white p-3 mx-2 rounded-md hover:bg-blue-600"
            onClick={() => setIsNewStudentModalOpen(true)}
          >
            Add New Student
          </button>
        </div>

        {studentContractData.length === 0 ? (
          <h2 className="font-semibold">No student records to show.</h2>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full rounded-lg shadow-lg border-collapse border border-gray-200">
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
        )}
      </div>

      {isNewStudentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
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
                {errors.fname && (
                  <p className="text-red-500 text-sm">{errors.fname}</p>
                )}
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
                {errors.lname && (
                  <p className="text-red-500 text-sm">{errors.lname}</p>
                )}
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
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
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
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number}</p>
                )}
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
                  className={`px-4 py-2 rounded text-white ${isFormValid
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-300 cursor-not-allowed"
                    }`}
                  disabled={!isFormValid}
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
