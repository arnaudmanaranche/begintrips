import { ExpenseCategoryEnum } from "@/types/expense";

export function ExpenseLabel({
  expenseCategory,
}: {
  expenseCategory: ExpenseCategoryEnum;
}) {
  switch (expenseCategory) {
    case "transport":
      return (
        <div className="bg-blue-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Transport</p>
        </div>
      );
    case "hotel":
      return (
        <div className="bg-green-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Hotel</p>
        </div>
      );
    case "events":
      return (
        <div className="bg-yellow-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Events</p>
        </div>
      );
    case "musuem":
      return (
        <div className="bg-red-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Museum</p>
        </div>
      );
    case "concert":
      return (
        <div className="bg-purple-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Concert</p>
        </div>
      );
    case "restaurant":
      return (
        <div className="bg-pink-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Restaurant</p>
        </div>
      );
    case "sport":
      return (
        <div className="bg-orange-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Sport</p>
        </div>
      );
    default:
      return (
        <div className="bg-gray-500 text-white rounded-2xl p-2 flex justify-center items-center text-sm">
          <p>Unknown</p>
        </div>
      );
  }
}
