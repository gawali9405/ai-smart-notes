import iconMap from "../lib/iconMap";
import { Sparkles } from "lucide-react";
import React from "react";

const IconBadge = ({ icon = "spark", size = 18, className = "" }) => {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <span
      className={`inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 backdrop-blur ${
        className || ""
      }`}
    >
      <IconComponent size={size} />
    </span>
  );
};

export default IconBadge;
