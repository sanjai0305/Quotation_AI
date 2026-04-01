export default function Topbar({ goToCreate }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 border-b">
      
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your quotations and track performance
        </p>
      </div>

      <button
        onClick={goToCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + New Quotation
      </button>
    </div>
  );
}