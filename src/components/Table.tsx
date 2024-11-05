import { table } from "console";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

export default function Table() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
            <table className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <TableHeader />
                <tbody>
                    {tableRows.map((table) => (
                        <TableRow key={table.id} />
                    ))}
                </tbody>
            </table>
        </div>

    )
};

const tableRows = [
    {
        id: 0
    },
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    },
    {
        id: 4
    }
];