import React, { useEffect, useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import api from "../lib/api";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.data.user);  
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel flex items-center justify-center rounded-3xl p-10">
        <p className="text-white/70">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-rose-300">
        Unable to load user profile
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header className="glass-panel rounded-3xl p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-white/60">
          Manage your personal information
        </p>
      </header>

      <section className="glass-panel space-y-6 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
            <User size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-white/60">{user.role.toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <ProfileField icon={Mail} label="Email" value={user.email} />
          <ProfileField icon={Shield} label="Role" value={user.role} />
        </div>
      </section>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <Icon size={18} className="text-indigo-300" />
    <div>
      <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

export default Profile;
