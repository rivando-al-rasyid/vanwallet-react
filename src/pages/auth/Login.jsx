export default function Login() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden">
      {/* The "Form Side":
        On desktop, spans 5 columns. We make it flex/center so the form
        is perfectly positioned within its section.
      */}
      <section className="col-span-1 md:col-span-5 bg-white flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative">
        {/*
          Top Left Logo/Text:
          Tailwind v4 streamlined positioning: `absolute top-10 left-10`.
        */}
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b5c7ff] flex items-center justify-center p-1.5">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-[#3366ff]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"
                opacity=".5"
              />
              <path d="M21,12a1,1,0,0,1-1,1H18a3,3,0,0,0-3,3v2a1,1,0,0,1-2,0V16a5,5,0,0,1,5-5h2A1,1,0,0,1,21,12Z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800">E-Wallet</span>
        </div>

        {/* Main Content Container:
          We limit max-width so the form content itself (text, buttons, inputs)
          never gets too stretched, matching the design.
        */}
        <div className="w-full max-w-[420px]">
          <RegisterForm />
        </div>
      </section>

      {/* The "Wallet Image Side":
        Spans the other 7 columns.
      */}
      <aside className="col-span-1 md:col-span-7 h-full">
        <WalletAside />
      </aside>
    </main>
  );
}
