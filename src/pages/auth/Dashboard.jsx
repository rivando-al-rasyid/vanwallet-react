export default function Dashboard() {
  return (
    <main className="grid grid-cols-6 min-w-2.5 min-h-auto ">
      <header className="col-span-6 border-b border-gray-300 bg-blue-500 min-h-16 text-white p-4">
        <h1>My Dashboard</h1>
      </header>

      <aside className="col-span-1 bg-gray-200 p-4 min-h-[calc(100vh-4rem)] ">
        <nav className="space-y-2">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#profile">Profile</a>
            </li>
            <li>
              <a href="#settings">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="p-4 col-span-5  bg-amber-400">
        <div className="grid">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to your dashboard!
          </h2>
          <p className="mb-4">
            Here you can manage your profile, view your activity, and adjust
            your settings.
          </p>
        </div>
      </section>
    </main>
  );
}
