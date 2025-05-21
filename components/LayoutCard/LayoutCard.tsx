import React from "react";

interface LayoutCardProps {
  children: React.ReactNode;
  className?: string;
  header?: string;
}

const LayoutCard: React.FC<LayoutCardProps> = ({
  children,
  className = "",
  header = "",
}) => {
  return (
    <div
      className={`bg-white border-gray-200 dark:border-zinc-700 dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center justify-self-center m-2 ${className}`}
    >
      {header && (
        <span className="text-2xl font-semibold p-2 text-zinc-600 dark:text-zinc-400">
          {header}
        </span>
      )}
      {children}
    </div>
  );
};

export default LayoutCard;
