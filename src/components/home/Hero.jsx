import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

// Constants
const AVATAR_IDS = [21, 22, 23, 24];
const USER_COUNT = "4.6 M";
const ICON_SIZE = 18;

export default function Hero() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-10 lg:pt-14">
        <h1 className="mx-auto max-w-5xl text-center text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-6xl">
          Experience the Future of Digital Payments with e-wallet
        </h1>

        <div className="mt-8 grid items-center gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
          {/* Phone Mockup Section */}
          <PhoneMockup />

          {/* Content Section */}
          <ContentSection />
        </div>
      </div>
    </header>
  );
}

function PhoneMockup() {
  return (
    <div className="relative flex justify-center lg:justify-start">
      <div className="relative w-fit">
        <img
          src={phoneBigImage}
          alt="Main app screen"
          className="relative z-10 w-40 drop-shadow-2xl sm:w-48 md:w-52 lg:w-72"
        />
        <img
          src={phoneSmallImage}
          alt="Secondary app screen"
          className="absolute bottom-0 -right-6 z-20 w-28 drop-shadow-2xl sm:w-36 md:w-40 lg:w-52 lg:-right-10"
        />
      </div>
    </div>
  );
}

function ContentSection() {
  return (
    <div className="max-w-xl lg:ml-auto">
      <Description />
      <DownloadButtons />
      <UserStats />
    </div>
  );
}

function Description() {
  return (
    <p className="mb-6 max-w-md text-sm leading-6 text-white/80 sm:text-base sm:leading-7 lg:mb-8 lg:text-lg">
      Simplify Your Life with Secure and Convenient Mobile Payments
    </p>
  );
}

function DownloadButtons() {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-10">
      <PlayStoreButton />
      <AppStoreButton />
    </div>
  );
}

function PlayStoreButton() {
  return (
    <button className="flex w-full min-w-42.5 items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition hover:bg-gray-100 sm:w-auto">
      <FontAwesomeIcon icon={faGooglePlay} height={ICON_SIZE} width={ICON_SIZE} />
      <span>Play Store</span>
    </button>
  );
}

function AppStoreButton() {
  return (
    <button className="flex w-full min-w-42.5 items-center justify-center gap-3 rounded-lg border border-white/50 px-6 py-3 font-medium text-white transition hover:bg-white/10 sm:w-auto">
      <FontAwesomeIcon icon={faApple} height={ICON_SIZE} width={ICON_SIZE} />
      <span>App Store</span>
    </button>
  );
}

function UserStats() {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="text-3xl font-semibold leading-none sm:text-4xl lg:text-5xl">{USER_COUNT}</div>
      <div>
        <UserAvatars />
        <UserDescription />
      </div>
    </div>
  );
}

function UserAvatars() {
  return (
    <div className="mb-2 flex -space-x-2 sm:-space-x-3">
      {AVATAR_IDS.map((id) => (
        <img
          key={id}
          src={`https://i.pravatar.cc/100?img=${id}`}
          alt="User avatar"
          className="h-8 w-8 rounded-full border-2 border-blue-600 object-cover sm:h-10 sm:w-10"
        />
      ))}
    </div>
  );
}

function UserDescription() {
  return (
    <p className="max-w-xs text-xs leading-5 text-white/80 sm:text-sm sm:leading-6">
      Around the world, we already have over {USER_COUNT.toLowerCase()} happy users
    </p>
  );
}
