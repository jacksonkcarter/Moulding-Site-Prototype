"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { PdfPageSelector, type PdfPageSelectorHandle } from "@/components/PdfPageSelector";
import { BusyLabel, LoadingState } from "@/components/LoadingSpinner";
import type { PdfCropExport, PdfSelectionRect } from "@/lib/pdf-selection";
import type { ProfileCompareOverlayHandle } from "@/components/ProfileCompareOverlay";

const ProfileCompareOverlay = dynamic(
  () =>
    import("@/components/ProfileCompareOverlay").then((mod) => ({
      default: mod.ProfileCompareOverlay,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
        <LoadingState size="md" />
      </div>
    ),
  },
);

type ProfileCheckerViewProps = {
  profileName: string;
  /** Destination for the back link (stock item or select profile detail). */
  backHref: string;
  backLabel?: string;
  /** Reference outline PDF for comparison - carried through the flow, not shown as page décor. */
  referenceOutlinePdfUrl: string | null;
};

type Step = "intro" | "upload" | "select" | "compare";

const STEPS = [
  "Trace your exact profile on a piece of paper and scan that paper using a scanner (or an accurate smart-device scanning tool) or upload a 1:1 scale PDF drawing of your profile.",
  "Highlight & select your profile.",
  "Drag the profile over our drawing. Rotate and flip it if needed.",
  "Verify whether or not it matches, and done!",
] as const;

const MIN_SELECTION_PX = 12;

const actionButtonClass =
  "inline-flex w-full items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-red-50 active:bg-primary active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const iconActionButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-white text-primary transition-colors hover:bg-red-50 active:bg-primary active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const primaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-50";
const actionButtonInlineClass =
  "inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white";
const primaryButtonInlineClass =
  "inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50";

function IconRotateLeft({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function IconRotateRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function IconFlipHorizontal({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M12 20v2" />
      <path d="M12 14v2" />
      <path d="M12 8v2" />
      <path d="M12 2v2" />
    </svg>
  );
}

function IconFlipVertical({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
      <path d="M20 12h2" />
      <path d="M14 12h2" />
      <path d="M8 12h2" />
      <path d="M2 12h2" />
    </svg>
  );
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function ProfileCheckerView({
  profileName,
  backHref,
  backLabel = "← Back to stock item",
  referenceOutlinePdfUrl,
}: ProfileCheckerViewProps) {
  const [step, setStep] = useState<Step>("intro");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selection, setSelection] = useState<PdfSelectionRect | null>(null);
  const [cropExport, setCropExport] = useState<PdfCropExport | null>(null);
  const [exportingCrop, setExportingCrop] = useState(false);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hideBoundingBox, setHideBoundingBox] = useState(false);
  const [exportBusy, setExportBusy] = useState<"print" | "save" | null>(null);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectorRef = useRef<PdfPageSelectorHandle>(null);
  const compareOverlayRef = useRef<ProfileCompareOverlayHandle>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const isFullHeightStep = step === "select" || step === "compare";

  useEffect(() => {
    if (!isFullHeightStep) {
      setViewportHeight(null);
      return;
    }

    function updateHeight() {
      const main = mainRef.current;
      if (!main) return;
      const top = main.getBoundingClientRect().top;
      setViewportHeight(Math.max(320, window.innerHeight - top));
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    document.body.style.overflow = "hidden";

    const header = document.querySelector("header");
    const observer = new ResizeObserver(updateHeight);
    if (header) observer.observe(header);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
      document.body.style.overflow = "";
    };
  }, [isFullHeightStep]);

  function acceptFile(file: File | null | undefined) {
    if (!file) return;
    if (!isPdfFile(file)) {
      setUploadError("Please upload a PDF file.");
      setUploadFile(null);
      setSelection(null);
      setCropExport(null);
      return;
    }
    setUploadError(null);
    setUploadFile(file);
    setSelection(null);
    setCropExport(null);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
    setHideBoundingBox(false);
    if (step === "select" || step === "compare") setStep("upload");
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    acceptFile(e.dataTransfer.files[0]);
  }

  function clearUpload() {
    setUploadFile(null);
    setSelection(null);
    setCropExport(null);
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
    setHideBoundingBox(false);
    setUploadError(null);
    setStep("upload");
  }

  async function goToCompare() {
    if (!referenceOutlinePdfUrl || exportingCrop) return;

    setExportingCrop(true);
    try {
      const crop =
        (await selectorRef.current?.exportCropAsync()) ??
        selectorRef.current?.exportCrop();
      if (!crop) return;
      setCropExport(crop);
      setFlipH(false);
      setFlipV(false);
      setRotation(0);
      setHideBoundingBox(false);
      setStep("compare");
    } finally {
      setExportingCrop(false);
    }
  }

  async function handlePrintComposite() {
    if (exportBusy) return;
    setExportBusy("print");
    try {
      await compareOverlayRef.current?.printComposite();
    } finally {
      setExportBusy(null);
    }
  }

  async function handleSaveComposite() {
    if (exportBusy) return;
    setExportBusy("save");
    try {
      const safeName = profileName.replace(/[^\w\-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "profile";
      await compareOverlayRef.current?.saveCompositePdf(`${safeName}-match-compare.pdf`);
    } finally {
      setExportBusy(null);
    }
  }

  const hasValidSelection =
    selection != null &&
    selection.width >= MIN_SELECTION_PX &&
    selection.height >= MIN_SELECTION_PX;

  return (
    <main
      ref={mainRef}
      className={isFullHeightStep ? "overflow-hidden" : "min-h-screen"}
      style={
        isFullHeightStep && viewportHeight != null
          ? { height: viewportHeight, maxHeight: viewportHeight }
          : undefined
      }
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => {
          acceptFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {isFullHeightStep ? (
        <div className="flex h-full min-h-0 gap-4 px-4 pb-3 pt-6 sm:gap-6 sm:px-6 sm:pt-8">
          <aside className="flex w-full max-w-xs shrink-0 flex-col gap-4 overflow-y-auto sm:max-w-sm">
            <Link
              href={backHref}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium leading-normal text-primary hover:underline"
            >
              {backLabel}
            </Link>

            <h1 className="text-2xl font-medium tracking-tight text-neutral-900">{profileName}</h1>

            {step === "select" && uploadFile ? (
              <>
                <p className="text-sm leading-snug text-neutral-600">
                  Click and drag to draw a box around your profile in the PDF. It doesn&apos;t have
                  to be exact, as long as the entire profile falls within the bounding box.
                </p>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={clearUpload} className={actionButtonClass}>
                    Select a different PDF
                  </button>
                  <button
                    type="button"
                    disabled={!hasValidSelection || exportingCrop}
                    onClick={() => void goToCompare()}
                    className={primaryButtonClass}
                    data-busy-managed
                  >
                    <BusyLabel busy={exportingCrop} idle="Next" busyText="Preparing…" />
                  </button>
                </div>
              </>
            ) : null}

            {step === "compare" && cropExport && referenceOutlinePdfUrl ? (
              <>
                <p className="text-sm leading-snug text-neutral-600">
                  Drag your profile over our outline. Use the handle above the selection to rotate
                  it.
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-sm font-medium text-neutral-700">
                        Rotate:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRotation((value) => value - 90)}
                          className={iconActionButtonClass}
                          aria-label="Rotate left"
                          title="Rotate left"
                        >
                          <IconRotateLeft />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRotation((value) => value + 90)}
                          className={iconActionButtonClass}
                          aria-label="Rotate right"
                          title="Rotate right"
                        >
                          <IconRotateRight />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-sm font-medium text-neutral-700">
                        Flip:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFlipH((value) => !value)}
                          className={iconActionButtonClass}
                          aria-label="Flip horizontally"
                          title="Flip horizontally"
                          aria-pressed={flipH}
                        >
                          <IconFlipHorizontal />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFlipV((value) => !value)}
                          className={iconActionButtonClass}
                          aria-label="Flip vertically"
                          title="Flip vertically"
                          aria-pressed={flipV}
                        >
                          <IconFlipVertical />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHideBoundingBox((value) => !value)}
                    className={actionButtonClass}
                    aria-pressed={hideBoundingBox}
                  >
                    Hide bounding box
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => void handlePrintComposite()}
                      className={`${actionButtonClass} disabled:cursor-wait disabled:opacity-50`}
                      disabled={exportBusy != null}
                    >
                      <BusyLabel busy={exportBusy === "print"} idle="Print" busyText="Preparing…" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaveComposite()}
                      className={`${actionButtonClass} disabled:cursor-wait disabled:opacity-50`}
                      disabled={exportBusy != null}
                    >
                      <BusyLabel busy={exportBusy === "save"} idle="Save PDF" busyText="Saving…" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("select")}
                    className={actionButtonClass}
                  >
                    Reselect area
                  </button>
                </div>
              </>
            ) : null}
          </aside>

          <div className="min-h-0 min-w-0 flex-1">
            {step === "select" && uploadFile ? (
              <PdfPageSelector
                ref={selectorRef}
                key={`${uploadFile.name}-${uploadFile.size}-${uploadFile.lastModified}`}
                file={uploadFile}
                selection={selection}
                onSelectionChange={setSelection}
                minSelectionPx={MIN_SELECTION_PX}
                className="h-full min-h-0"
              />
            ) : null}

            {step === "compare" && cropExport && referenceOutlinePdfUrl ? (
              <ProfileCompareOverlay
                ref={compareOverlayRef}
                key={cropExport.imageUrl}
                referenceOutlinePdfUrl={referenceOutlinePdfUrl}
                cropImageUrl={cropExport.imageUrl}
                cropWidthPts={cropExport.widthPts}
                cropHeightPts={cropExport.heightPts}
                flipH={flipH}
                flipV={flipV}
                rotation={rotation}
                onRotationChange={setRotation}
                hideBoundingBox={hideBoundingBox}
                className="h-full min-h-0"
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-5 sm:px-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {backLabel}
          </Link>

          <h1 className="mt-8 text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
            {profileName}
          </h1>

          {!referenceOutlinePdfUrl ? (
            <p className="mt-4 text-sm text-primary">
              Outline PDF is not available for this profile yet.
            </p>
          ) : null}

          {step === "intro" ? (
            <div className="mt-6 space-y-6">
              <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Our profile checker allows you to compare your rigid moulding to our flexible
                profiles.
              </p>
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                {STEPS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setStep("upload")}
                disabled={!referenceOutlinePdfUrl}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start
              </button>
            </div>
          ) : null}

          {step === "upload" ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Upload a 1:1 scale PDF of your moulding profile to compare against our drawing.
              </p>

              {!uploadFile ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setDragOver(false);
                  }}
                  onDrop={onDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragOver
                      ? "border-primary bg-red-50/60"
                      : "border-neutral-300 bg-neutral-50 hover:border-primary/50 hover:bg-red-50/30"
                  }`}
                >
                  <svg
                    className="mb-3 h-10 w-10 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium text-neutral-800">Drag and drop your PDF here</p>
                  <p className="mt-1 text-sm text-neutral-500">or click to browse</p>
                </div>
              ) : (
                <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
                  Selected file:{" "}
                  <span className="font-medium text-neutral-900">{uploadFile.name}</span>
                </p>
              )}

              {uploadError ? <p className="text-sm text-primary">{uploadError}</p> : null}

              {uploadFile ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={actionButtonInlineClass}
                  >
                    Select a different PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelection(null);
                      setStep("select");
                    }}
                    className={primaryButtonInlineClass}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}
