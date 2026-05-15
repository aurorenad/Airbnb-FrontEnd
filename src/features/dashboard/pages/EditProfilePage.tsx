import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Camera, Save } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { updateUserProfile, uploadAvatar } from "../api/usersApi";

const P = "#e8441a";
const BG = "#f7f3ef";

const EditProfilePage = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "", phone: "", email: "",
        description: "",
        facebook: "", twitter: "", instagram: "", linkedin: "",
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        setForm((current) => ({
            ...current,
            name: user.name,
            phone: user.phone,
            email: user.email,
            description: user.bio ?? "",
        }));
        setAvatar(user.avatar);
    }, [user]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("Please log in first.");
            let updated = await updateUserProfile(user.id, {
                name: form.name,
                phone: form.phone,
                email: form.email,
                bio: form.description,
            });
            if (avatarFile) {
                updated = await uploadAvatar(user.id, avatarFile);
            }
            return updated;
        },
        onSuccess: () => {
            setSaved(true);
            toast.success("Profile updated");
            setTimeout(() => setSaved(false), 2500);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        },
    });

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate();
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

    return (
        <div className="max-w-4xl mx-auto py-6">
            {/* Cover + avatar */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-black/5 shadow-sm" style={{ backgroundColor: BG }}>
                <div className="relative h-40 bg-gradient-to-r from-orange-400 to-rose-400">
                    <label className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-lg cursor-pointer transition">
                        <Camera className="w-3.5 h-3.5" /> Upload header
                        <input type="file" accept="image/*" className="hidden" />
                    </label>
                </div>
                <div className="px-6 pb-5 flex items-end gap-4 -mt-10">
                    <label className="relative cursor-pointer group">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-md">
                            {avatar
                                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">A</div>
                            }
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                    <div className="pb-2">
                        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            {form.name || "Your Name"}
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                        </h2>
                        <p className="text-slate-400 text-xs">{form.email || "your@email.com"}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Details */}
                <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: BG }}>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: P }} />
                        <h3 className="font-bold text-slate-900">Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Name <span style={{ color: P }}>*</span></label>
                            <input type="text" value={form.name} onChange={set("name")} placeholder="Name" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Phone <span style={{ color: P }}>*</span></label>
                            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="(123) 456-789" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Email Address <span style={{ color: P }}>*</span></label>
                            <input type="email" value={form.email} onChange={set("email")} placeholder="example@email.com" className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Description <span style={{ color: P }}>*</span></label>
                        <textarea value={form.description} onChange={set("description")} rows={4}
                            placeholder="Please enter up to 4000 characters."
                            className={`${inputClass} resize-none`} maxLength={4000} />
                    </div>
                </div>

                {/* Social */}
                <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: BG }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Facebook Page <span className="text-slate-400">(optional)</span></label>
                            <input type="url" value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Twitter profile <span className="text-slate-400">(optional)</span></label>
                            <input type="url" value={form.twitter} onChange={set("twitter")} placeholder="https://twitter.com" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Instagram profile <span className="text-slate-400">(optional)</span></label>
                            <input type="url" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn page <span className="text-slate-400">(optional)</span></label>
                            <input type="url" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com" className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="rounded-2xl border border-black/5 shadow-sm p-6" style={{ backgroundColor: BG }}>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: P }} />
                        <h3 className="font-bold text-slate-900">Change Password</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Current Password <span style={{ color: P }}>*</span></label>
                            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">New Password <span style={{ color: P }}>*</span></label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Confirm Password <span style={{ color: P }}>*</span></label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit"
                        className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                        style={{ backgroundColor: P }}>
                        <Save className="w-4 h-4" />
                        {saveMutation.isPending ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;
