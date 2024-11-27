import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/config" className="text-blue-500 underline hover:text-blue-700">
            Edit Store Details
          </Link>
        </li>
        <li>
          <Link href="/admin/products" className="text-blue-500 underline hover:text-blue-700">
            Manage Products
          </Link>
        </li>
        <li>
          <Link href="/admin/theme" className="text-blue-500 underline hover:text-blue-700">
            Edit Theme Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
