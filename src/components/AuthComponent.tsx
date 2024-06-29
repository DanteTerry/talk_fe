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
      <div className={`${className} flex h-screen w-full font-inter`}>
        <div className={`bg-fight hidden lg:block lg:w-3/5 ${className}`}></div>
        <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-[#0E1013] lg:w-2/5 lg:rounded-bl-3xl lg:rounded-tl-3xl">
          <div className="flex max-w-[500px] flex-col gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
