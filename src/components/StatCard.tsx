import clsx from "clsx";
import Image from "next/image";
import React from "react";

type TStatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
};
function StatCard({ type, count = 0, label, icon }: TStatCardProps) {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt={label}
          className="size-8 w-fit"
        />
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default StatCard;
