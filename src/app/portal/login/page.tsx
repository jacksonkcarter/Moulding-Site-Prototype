import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm -mt-[100px]">
        <h1 className="mb-2 text-center text-3xl font-medium tracking-tight text-neutral-900">
          Customer portal
        </h1>
        <p className="mb-8 text-center text-sm font-medium text-neutral-500">Coming soon</p>
        <form className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-400">
              Email or username
            </label>
            <input
              id="email"
              type="text"
              disabled
              autoComplete="username"
              className="w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-neutral-400 placeholder:text-neutral-300"
              placeholder="Enter email or username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              disabled
              autoComplete="current-password"
              className="w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-neutral-400 placeholder:text-neutral-300"
              placeholder="Enter password"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-neutral-300 py-2.5 text-sm font-semibold text-neutral-500"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="text-primary hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
