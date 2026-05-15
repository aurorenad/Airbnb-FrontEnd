import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MessageSquare, Plus, ShieldCheck, Search, Trash2, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createAdminUser, deleteUser, fetchUsers, updateUserAdminAccess, updateUserRole } from "../api/usersApi";
import type { UserRole } from "../../auth/types";
import { useAuth } from "../../auth/hooks/useAuth";

const P = "#e8441a";

const ManageUsersPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [adminForm, setAdminForm] = useState({ name: "", email: "", username: "", phone: "", password: "", isSuperAdmin: false });
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-users"], queryFn: fetchUsers });
  const isSuperAdmin = currentUser?.isSuperAdmin;

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRole(id, role),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update user role"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const adminAccessMutation = useMutation({
    mutationFn: ({ id, role, isSuperAdmin }: { id: string; role: UserRole; isSuperAdmin: boolean }) =>
      updateUserAdminAccess(id, role, isSuperAdmin),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin access updated");
    },
    onError: () => toast.error("Only a super admin can change admin access"),
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      setAdminForm({ name: "", email: "", username: "", phone: "", password: "", isSuperAdmin: false });
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin registered");
    },
    onError: () => toast.error("Failed to register admin"),
  });

  const users = useMemo(() => {
    const term = search.toLowerCase();
    return (data?.data ?? []).filter((user) =>
      `${user.name} ${user.email} ${user.username} ${user.role}`.toLowerCase().includes(term)
    );
  }, [data?.data, search]);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-sm font-semibold" style={{ color: P }}>Admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Approve guests as hosts and manage account roles.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      {isSuperAdmin && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            createAdminMutation.mutate(adminForm);
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 rounded-lg border border-black/5 bg-white dark:bg-slate-900 p-4"
        >
          {(["name", "email", "username", "phone", "password"] as const).map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={adminForm[field]}
              onChange={(event) => setAdminForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
              required
            />
          ))}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={adminForm.isSuperAdmin}
              onChange={(event) => setAdminForm((current) => ({ ...current, isSuperAdmin: event.target.checked }))}
            />
            Super
          </label>
          <button
            type="submit"
            disabled={createAdminMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white md:col-span-6"
            style={{ backgroundColor: P }}
          >
            <Plus className="w-4 h-4" /> Register Admin
          </button>
        </form>
      )}

      <div className="rounded-lg border border-black/5 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {isLoading && <div className="p-6 text-sm text-slate-500">Loading users...</div>}
        {isError && <div className="p-6 text-sm text-rose-500">Failed to load users.</div>}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                <tr>
                  {["User", "Phone", "Role", "Listings", "Authority", "Action"].map((heading) => (
                    <th key={heading} className="text-left font-semibold px-4 py-3">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: user.role === "ADMIN" ? "#475569" : P }}>
                        <ShieldCheck className="w-3 h-3" /> {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user._count?.listings ?? 0}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(event) => roleMutation.mutate({ id: user.id, role: event.target.value as UserRole })}
                        disabled={roleMutation.isPending || (user.role === "ADMIN" && !isSuperAdmin)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                      >
                        <option value="GUEST">Guest</option>
                        <option value="HOST">Host</option>
                        {!isSuperAdmin && user.role === "ADMIN" && <option value="ADMIN">Admin</option>}
                        {isSuperAdmin && <option value="ADMIN">Admin</option>}
                      </select>
                      {user.role === "ADMIN" && (
                        <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <input
                            type="checkbox"
                            checked={!!user.isSuperAdmin}
                            disabled={!isSuperAdmin || adminAccessMutation.isPending}
                            onChange={(event) => adminAccessMutation.mutate({ id: user.id, role: "ADMIN", isSuperAdmin: event.target.checked })}
                          />
                          Super admin
                        </label>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/messages?user=${user.id}`)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          aria-label={`Message ${user.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => roleMutation.mutate({ id: user.id, role: "HOST" })}
                          disabled={user.role === "HOST" || roleMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                          style={{ backgroundColor: P }}
                        >
                          <UserCog className="w-3 h-3" /> Make Host
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(user.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="p-6 text-sm text-slate-500">No users found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
