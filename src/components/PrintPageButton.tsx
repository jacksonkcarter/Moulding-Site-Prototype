"use client";

type PrintPageButtonProps = {
  className?: string;
  /** Document title used while printing (also affects default PDF name). */
  printDocumentTitle?: string;
};

export function PrintPageButton({
  className = "",
  printDocumentTitle = "Flex Trim™ Installation Guide",
}: PrintPageButtonProps) {
  function handlePrint() {
    const previousTitle = document.title;
    document.title = printDocumentTitle;

    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover ${className}`}
    >
      Print this page
    </button>
  );
}
