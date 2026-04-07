import { useState } from "react";

import LoginHeadline from "../../components/LoginHeadline";
import Brand from "../../components/Brand";
import PinInput from "../../components/PinInput";
import LoginSubtext from "../../components/LoginSubtext";
import Submit from "../../components/Submit";
export default function LoginPin() {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white xl:rounded-r-[60px] shadow-2xl z-20">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title={"Enter Your Pin 👋"}
            text={"Please save your pin because this so important."}
          />
        </div>
        <PinInput pin={pin} onChange={setPin} />
        <LoginSubtext
          text={"Forgot Your Pin?"}
          linklabel={"reset"}
          link={"#"}
        />
        <Submit name={"submit"} />
      </section>
      <aside className="flex flex-col-reverse items-center ">
        <img
          src={"/img/person.png"}
          alt="illustration"
          loading="lazy"
          className="w-3/5 h-auto drop-shadow-2xl"
        />
      </aside>
    </main>
  );
}
