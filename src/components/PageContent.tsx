import { ReactNode } from "react";

type PageContentProps = {
  title?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export function PageContent({ title, children, fullWidth }: PageContentProps) {
  return (
    <main className="min-h-screen">
      <div className={`px-4 pt-5 pb-12 sm:px-6 ${fullWidth ? "w-full" : "mx-auto max-w-4xl"}`}>
        {title ? (
          <h1 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 text-center">
            {title}
          </h1>
        ) : null}
        <div className={title ? "mt-8 prose prose-neutral max-w-none" : "prose prose-neutral max-w-none"}>
          {children}
        </div>
      </div>
    </main>
  );
}
