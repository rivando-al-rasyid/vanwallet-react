import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";

export default function Login() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      {/* LEFT FORM SECTION */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white xl:rounded-r-[60px] shadow-2xl z-20">
        <div className="w-full max-w-175">
          {/* Logo & Brand */}
          <Brand />
          {/* Headline and Description */}
          <LoginHeadline
            title={"Hello Welcome Back 👋"}
            text={
              "Fill out the form correctly or you can login with several options."
            }
          />
          <SocialLogin />
          {/* Registration Form */}
          <form className="space-y-6">
            <Input
              label="Email"
              type="email"
              icon={faEnvelope}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              icon={faLock}
              placeholder="Enter Your Password"
            />
            <Submit name={"login"} />
          </form>
          <LoginSubtext
            text={"Not Have An Account? "}
            link={"/Register"}
            linklabel={"Register"}
          />
        </div>
      </section>
      {/* RIGHT 3D IMAGE SECTION */}
      <LoginImage img="../../../src/assets/img/3d-hand-phone.png" />
    </main>
  );
}
