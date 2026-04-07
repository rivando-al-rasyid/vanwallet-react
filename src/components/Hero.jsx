import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";

// Constants
const AVATAR_IDS = [21, 22, 23, 24];
const USER_COUNT = "4.6 M";
const ICON_SIZE = 18;

export default function Hero() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10 lg:pt-14">
        <h1 className="mx-auto max-w-5xl text-center text-4xl font-semibold leading-tight tracking-tight lg:text-6xl">
          Experience the Future of Digital Payments with e-wallet
        </h1>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
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
          src="/img/phonebig.png"
          alt="Main app screen"
          className="relative z-10 w-52 drop-shadow-2xl sm:w-60 lg:w-72"
        />
        <img
          src="/img/phonesmall.png"
          alt="Secondary app screen"
          className="absolute bottom-0 -right-10 z-20 w-36 drop-shadow-2xl sm:w-44 lg:w-52"
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
    <p className="mb-8 max-w-md text-base leading-7 text-white/80 lg:text-lg">
      Simplify Your Life with Secure and Convenient Mobile Payments
    </p>
  );
}

function DownloadButtons() {
  return (
    <div className="mb-10 flex flex-wrap gap-4">
      <PlayStoreButton />
      <AppStoreButton />
    </div>
  );
}

function PlayStoreButton() {
  return (
    <button className="flex min-w-42.5 items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition hover:bg-gray-100">
      <FontAwesomeIcon icon={faGooglePlay} height={ICON_SIZE} width={ICON_SIZE} />
      <span>Play Store</span>
    </button>
  );
}

function AppStoreButton() {
  return (
    <button className="flex min-w-42.5 items-center justify-center gap-3 rounded-lg border border-white/50 px-6 py-3 font-medium text-white transition hover:bg-white/10">
      <FontAwesomeIcon icon={faApple} height={ICON_SIZE} width={ICON_SIZE} />
      <span>App Store</span>
    </button>
  );
}

function UserStats() {
  return (
    <div className="flex items-center gap-5">
      <div className="text-5xl font-semibold leading-none">{USER_COUNT}</div>
      <div>
        <UserAvatars />
        <UserDescription />
      </div>
    </div>
  );
}

function UserAvatars() {
  return (
    <div className="mb-2 flex -space-x-3">
      {AVATAR_IDS.map((id) => (
        <img
          key={id}
          src={`https://i.pravatar.cc/100?img=${id}`}
          alt="User avatar"
          className="h-10 w-10 rounded-full border-2 border-blue-600 object-cover"
        />
      ))}
    </div>
  );
}

function UserDescription() {
  return (
    <p className="max-w-xs text-sm leading-6 text-white/80">
      Around the world, we already have over {USER_COUNT.toLowerCase()} happy users
    </p>
  );
}
