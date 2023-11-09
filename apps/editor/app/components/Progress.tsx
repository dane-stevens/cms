import { useEffect, useState } from "react";

export function Progress({ percentage }: { percentage: number }) {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  useEffect(() => {
    setCurrentPercentage(percentage);
  }, []);
  return (
    <div className="app-flex app-gap-2 app-items-center">
      <div className="app-h-[4px] app-rounded-full app-overflow-hidden app-bg-white/10 app-w-full">
        <div
          className="app-bg-green-600 app-h-full app-rounded-full app-transition-all app-duration-500"
          style={{ width: `${currentPercentage}%` }}
        />
      </div>
      {percentage}%
    </div>
  );
}
