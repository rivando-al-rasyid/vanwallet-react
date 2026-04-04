import logoImg from "../assets/img/logo.png";

function Brand() {
  return (
    <div className="flex gap-4 items-center">
      <div className="p-2 bg-[#6379F415] rounded-lg group-hover:bg-[#6379F4] transition-colors">
        <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
      </div>
      <h1 className="text-2xl font-bold text-[#6379F4] tracking-tight">
        E-Wallet
      </h1>
    </div>
  );
}

export default Brand;
