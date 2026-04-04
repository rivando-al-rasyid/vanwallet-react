import React from "react";

export default function LoginImage({ img }) {
  return (
    <aside className="hidden lg:flex flex-col items-center justify-center h-full p-20 bg-[radial-gradient(circle,_#3868fd_0%,_transparent_100%)]bg-opacity-90">
      <img
        src={img}
        alt="3D Illustration"
        className="relative z-10 w-4/5 h-auto object-contain drop-shadow-2xl"
      />
    </aside>
  );
}
