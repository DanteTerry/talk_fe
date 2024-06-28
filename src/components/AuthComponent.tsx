import React from "react";

function AuthComponent({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div>
      <div className="flex h-screen w-full font-inter">
        <div className={`hidden lg:block lg:w-3/5 ${className}`}></div>
        <div className="flex w-full flex-col items-center justify-center dark:bg-[#0E1013] lg:w-2/5">
          <div className="flex flex-col gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
