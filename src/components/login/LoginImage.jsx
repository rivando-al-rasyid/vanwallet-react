import { memo } from "react";

/**
 * Sidebar illustration for login/register/PIN screens.
 * @param {object} props
 * @param {string} props.img - Image source URL.
 * @param {string} [props.alt="Login illustration"] - Accessible description of the image.
 */
const LoginImage = memo(function LoginImage({
  img,
  alt = "Login illustration",
}) {
  return (
    <aside
      className="hidden lg:flex flex-col items-center justify-center h-full p-20 bg-[radial-gradient(circle,#3868fd_0%,transparent_100%)] bg-opacity-90"
      aria-label="Decorative sidebar"
    >
      <img
        src={img}
        alt={alt}
        loading="lazy"
        className="w-4/5 h-auto object-contain drop-shadow-2xl"
      />
    </aside>
  );
});

export default LoginImage;
