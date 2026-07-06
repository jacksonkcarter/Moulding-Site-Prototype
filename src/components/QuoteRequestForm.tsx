"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import {
  APPLICATION_OPTIONS,
  ARCH_STYLES,
  DOORWAY_COMPONENTS,
  COMPONENTS_WITH_SIDES,
  type ApplicationOption,
  type ArchStyle,
  type DoorwayComponent,
  type QuoteItem,
  type DoorwayData,
  type ProfileEntry,
  type ContactInfo,
  CROWN_CURVATURES,
  CROWN_OSR_TIGHT_RADII_OPTIONS,
  type CrownCurvature,
  type CrownOsrTightRadiiOption,
} from "@/lib/quote-form-types";

import halfRoundDiagram from "../../Project_Info/Order-Form-Images/Half Round.png";
import halfRoundStrLegsDiagram from "../../Project_Info/Order-Form-Images/Half Round Str Legs.png";
import eyebrowWidthRiseImg from "../../Project_Info/Order-Form-Images/Eyebrow Width Rise.png";
import eyebrowRadiusLengthImg from "../../Project_Info/Order-Form-Images/Eyebrow Radius Length.png";
import archStyleEyebrowImg from "../../Project_Info/Order-Form-Images/Arc Style Eyebrow.png";
import archStyleEllipticalImg from "../../Project_Info/Order-Form-Images/Arch Style Elliptical.png";
import archStyleHalfRoundImg from "../../Project_Info/Order-Form-Images/Arch Style Half Round.png";
import archStyleRadiusCornersImg from "../../Project_Info/Order-Form-Images/Arch Style Radius Corners.png";
import archStyleGothicImg from "../../Project_Info/Order-Form-Images/Arch Style Gothic.png";
import archStyleStraightImg from "../../Project_Info/Order-Form-Images/Arch Style Straight.png";
import crownIsrImg from "../../Project_Info/Order-Form-Images/ISR.png";
import crownOsrImg from "../../Project_Info/Order-Form-Images/OSR.png";
import crownColumnWrapImg from "../../Project_Info/Order-Form-Images/Column Wrap.png";
import crownHalfRoundStrRadStrOsrImg from "../../Project_Info/Order-Form-Images/Half Round Str-Rad-Str OSR.png";
import crownQuarterRoundStrRadStrOsrImg from "../../Project_Info/Order-Form-Images/Quarter Round Str-Rad-Str OSR.png";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

/** Returns response-time message based on current time (client). */
function getResponseTimeMessage(): string {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const isWeekday = day >= 1 && day <= 5;
  const isBeforeNoon = hour < 12 || (hour === 12 && minute === 0);
  if (isWeekday && isBeforeNoon) return "...before 5 PM EST";
  return "...next business day";
}

type FormView =
  | { step: "list" }
  | { step: "application"; itemId: string }
  | { step: "doorway-arch"; itemId: string }
  | { step: "doorway-curved-wall"; itemId: string }
  | { step: "doorway-eyebrow-dimensions-choice"; itemId: string }
  | { step: "doorway-eyebrow-width-rise"; itemId: string }
  | { step: "doorway-eyebrow-radius-length"; itemId: string }
  | { step: "doorway-half-round-diameter"; itemId: string }
  | { step: "doorway-half-round-flex"; itemId: string }
  | { step: "doorway-half-round-legs"; itemId: string }
  | { step: "doorway-components"; itemId: string }
  | { step: "doorway-profiles"; itemId: string }
  | { step: "doorway-add-profile"; itemId: string; componentKey: string; componentOtherSpec?: string }
  | { step: "crown-curvature"; itemId: string }
  | { step: "crown-osr-tight-radii"; itemId: string }
  | { step: "contact"; itemIds: string[] };

type SummaryEntry = { view: FormView; label: string };

function getSummaryEntries(view: FormView, currentItem: QuoteItem | null): SummaryEntry[] {
  if (!currentItem || view.step === "list" || view.step === "contact") return [];
  if (view.step === "application") return [];
  const itemId = "itemId" in view ? view.itemId : "";
  const entries: SummaryEntry[] = [];

  const appLabel = currentItem.application + (currentItem.applicationOther ? ` — ${currentItem.applicationOther}` : "");
  entries.push({ view: { step: "application", itemId }, label: `Application: ${appLabel}` });

  if (currentItem.application !== "Doorway" || !currentItem.doorway) return entries;
  const d = currentItem.doorway;

  const archLabel = (d.archStyle ?? "") + (d.archStyleOther ? ` — ${d.archStyleOther}` : "");
  if (archLabel) {
    entries.push({ view: { step: "doorway-arch", itemId }, label: `Arch style: ${archLabel}` });
  }
  if (view.step === "doorway-arch") return entries;
  if (d.curvedWall === true || d.curvedWall === false) {
    entries.push({ view: { step: "doorway-curved-wall", itemId }, label: `Curved wall: ${d.curvedWall ? "Yes" : "No"}` });
  }
  if (view.step === "doorway-curved-wall") return entries;

  const isHalfRound = d.archStyle === "Half Round" && d.halfRound;
  if (isHalfRound) {
    if (d.halfRound.diameterIn) {
      entries.push({ view: { step: "doorway-half-round-diameter", itemId }, label: `Diameter: ${d.halfRound.diameterIn} in` });
    }
    if (view.step === "doorway-half-round-diameter") return entries;
    entries.push({ view: { step: "doorway-half-round-flex", itemId }, label: `Flex trim legs: ${d.halfRound.flexTrimLegs ? "Yes" : "No"}` });
    if (view.step === "doorway-half-round-flex") return entries;
    const hasStraightLegValue = d.halfRound.flexTrimLegs && d.halfRound.straightLegLengthIn != null && String(d.halfRound.straightLegLengthIn).trim() !== "";
    if (hasStraightLegValue) {
      entries.push({ view: { step: "doorway-half-round-legs", itemId }, label: `Straight leg length: ${d.halfRound.straightLegLengthIn!.trim()} in` });
    }
    if (view.step === "doorway-half-round-legs") return entries;
  }

  const isEyebrow = d.archStyle === "Eyebrow" && d.eyebrow;
  if (isEyebrow && d.eyebrow) {
    const e = d.eyebrow;
    if (e.dimensionType === "width-rise" && (e.widthIn || e.riseIn)) {
      entries.push({ view: { step: "doorway-eyebrow-width-rise", itemId }, label: `Eyebrow: Width ${e.widthIn ?? "—"} in, Rise ${e.riseIn ?? "—"} in` });
    } else if (e.dimensionType === "radius-length" && (e.radiusIn || e.lengthIn)) {
      entries.push({ view: { step: "doorway-eyebrow-radius-length", itemId }, label: `Eyebrow: Radius ${e.radiusIn ?? "—"} in, Length ${e.lengthIn ?? "—"} in` });
    }
    if (view.step === "doorway-eyebrow-dimensions-choice" || view.step === "doorway-eyebrow-width-rise" || view.step === "doorway-eyebrow-radius-length") return entries;
  }

  if (d.components.length > 0) {
    const compList = d.components.map((c) => (c === "Other" ? (d.componentOtherSpec || "Other") : c)).join(", ");
    entries.push({ view: { step: "doorway-components", itemId }, label: `Components: ${compList}` });
  }
  if (view.step === "doorway-components") return entries;
  if (view.step === "doorway-profiles" || view.step === "doorway-add-profile") return entries;

  return entries;
}

/** Returns display lines for an item's collapsible details (application, doorway, profiles with One/Both Sides). */
function getItemDetailLines(item: QuoteItem): string[] {
  const lines: string[] = [];
  const appLabel = item.application + (item.applicationOther ? ` — ${item.applicationOther}` : "");
  lines.push(`Application: ${appLabel}`);
  if (item.application === "Crown" && item.crown) {
    lines.push(`Crown curvature: ${item.crown.curvature}`);
    if (item.crown.tightRadiiScenarios && item.crown.tightRadiiScenarios.length > 0) {
      lines.push(`Tight radii: ${item.crown.tightRadiiScenarios.join(", ")}`);
    }
    return lines;
  }
  if (item.application !== "Doorway" || !item.doorway) return lines;
  const d = item.doorway;
  const archLabel = (d.archStyle ?? "") + (d.archStyleOther ? ` — ${d.archStyleOther}` : "");
  if (archLabel) lines.push(`Arch style: ${archLabel}`);
  if (d.curvedWall === true || d.curvedWall === false) {
    lines.push(`Curved wall: ${d.curvedWall ? "Yes" : "No"}`);
  }
  const isHalfRound = d.archStyle === "Half Round" && d.halfRound;
  if (isHalfRound && d.halfRound) {
    if (d.halfRound.diameterIn) lines.push(`Diameter: ${d.halfRound.diameterIn} in`);
    lines.push(`Flex trim legs: ${d.halfRound.flexTrimLegs ? "Yes" : "No"}`);
    const hasStraightLegValue = d.halfRound.flexTrimLegs && d.halfRound.straightLegLengthIn != null && String(d.halfRound.straightLegLengthIn).trim() !== "";
    if (hasStraightLegValue) lines.push(`Straight leg length: ${d.halfRound.straightLegLengthIn!.trim()} in`);
  }
  const isEyebrow = d.archStyle === "Eyebrow" && d.eyebrow;
  if (isEyebrow && d.eyebrow) {
    const e = d.eyebrow;
    if (e.dimensionType === "width-rise") lines.push(`Eyebrow: Width ${e.widthIn ?? "—"} in, Rise ${e.riseIn ?? "—"} in`);
    else if (e.dimensionType === "radius-length") lines.push(`Eyebrow: Radius ${e.radiusIn ?? "—"} in, Length ${e.lengthIn ?? "—"} in`);
  }
  if (d.components.length > 0) {
    const compList = d.components.map((c) => (c === "Other" ? (d.componentOtherSpec || "Other") : c)).join(", ");
    lines.push(`Components: ${compList}`);
  }
  d.profiles.forEach((p) => {
    const compLabel = p.componentKey === "Other" ? (p.componentOtherSpec || "Other") : p.componentKey;
    const finishStr = p.finish === "stained" ? `Stained${p.woodGrainSpecies ? ` (${p.woodGrainSpecies})` : ""}` : "Painted";
    let profileText = `${compLabel}: ${p.profilePartNumber || "—"} · ${p.thickness}" × ${p.width}" · ${finishStr}`;
    if (COMPONENTS_WITH_SIDES.includes(p.componentKey as DoorwayComponent)) {
      profileText += ` · ${p.sides === "both" ? "Both Sides" : "One Side"}`;
    }
    if (p.matchingWood != null && String(p.matchingWood).trim() !== "") {
      profileText += ` · Manufacturer: ${p.matchingWood.trim()}`;
    }
    lines.push(profileText);
  });
  return lines;
}

/** Returns detail lines with optional view for edit (when item is the current item). Only shows lines that are in the flow up to/including the current step (e.g. does not show "Flex trim legs" on the diameter step). */
function getItemDetailEntries(item: QuoteItem, itemId: string, currentStep: FormView["step"] | null): { label: string; view?: FormView }[] {
  const entries: { label: string; view?: FormView }[] = [];
  const isCurrent = item.id === itemId;
  const appLabel = item.application + (item.applicationOther ? ` — ${item.applicationOther}` : "");
  entries.push({ label: `Application: ${appLabel}`, view: isCurrent ? { step: "application", itemId } : undefined });
  if (item.application === "Crown" && item.crown) {
    entries.push({ label: `Crown curvature: ${item.crown.curvature}`, view: isCurrent ? { step: "crown-curvature", itemId } : undefined });
    if (item.crown.tightRadiiScenarios && item.crown.tightRadiiScenarios.length > 0) {
      entries.push({ label: `Tight radii: ${item.crown.tightRadiiScenarios.join(", ")}`, view: isCurrent ? { step: "crown-osr-tight-radii", itemId } : undefined });
    }
    return entries;
  }
  if (item.application !== "Doorway" || !item.doorway) return entries;
  const d = item.doorway;
  const archLabel = (d.archStyle ?? "") + (d.archStyleOther ? ` — ${d.archStyleOther}` : "");
  if (archLabel) entries.push({ label: `Arch style: ${archLabel}`, view: isCurrent ? { step: "doorway-arch", itemId } : undefined });
  if (d.curvedWall === true || d.curvedWall === false) {
    entries.push({ label: `Curved wall: ${d.curvedWall ? "Yes" : "No"}`, view: isCurrent ? { step: "doorway-curved-wall", itemId } : undefined });
  }
  const isHalfRound = d.archStyle === "Half Round" && d.halfRound;
  if (isHalfRound && d.halfRound) {
    const showDiameter = currentStep !== "doorway-curved-wall";
    if (showDiameter && d.halfRound.diameterIn) entries.push({ label: `Diameter: ${d.halfRound.diameterIn} in`, view: isCurrent ? { step: "doorway-half-round-diameter", itemId } : undefined });
    // Only show "Flex trim legs" after the user has left the flex-trim step (hide on curved-wall and half-round diameter/flex steps)
    const showFlexTrimLegs = currentStep !== "doorway-curved-wall" && currentStep !== "doorway-half-round-diameter" && currentStep !== "doorway-half-round-flex";
    if (showFlexTrimLegs) entries.push({ label: `Flex trim legs: ${d.halfRound.flexTrimLegs ? "Yes" : "No"}`, view: isCurrent ? { step: "doorway-half-round-flex", itemId } : undefined });
    const hasStraightLegValue = d.halfRound.flexTrimLegs && d.halfRound.straightLegLengthIn != null && String(d.halfRound.straightLegLengthIn).trim() !== "";
    const showStraightLegs = hasStraightLegValue && (currentStep === null || currentStep !== "doorway-half-round-legs");
    if (showStraightLegs) entries.push({ label: `Straight leg length: ${d.halfRound.straightLegLengthIn!.trim()} in`, view: isCurrent ? { step: "doorway-half-round-legs", itemId } : undefined });
  }
  const isEyebrow = d.archStyle === "Eyebrow" && d.eyebrow;
  if (isEyebrow && d.eyebrow) {
    const e = d.eyebrow;
    if (e.dimensionType === "width-rise") entries.push({ label: `Eyebrow: Width ${e.widthIn ?? "—"} in, Rise ${e.riseIn ?? "—"} in`, view: isCurrent ? { step: "doorway-eyebrow-width-rise", itemId } : undefined });
    else if (e.dimensionType === "radius-length") entries.push({ label: `Eyebrow: Radius ${e.radiusIn ?? "—"} in, Length ${e.lengthIn ?? "—"} in`, view: isCurrent ? { step: "doorway-eyebrow-radius-length", itemId } : undefined });
  }
  if (d.components.length > 0) {
    const compList = d.components.map((c) => (c === "Other" ? (d.componentOtherSpec || "Other") : c)).join(", ");
    entries.push({ label: `Components: ${compList}`, view: isCurrent ? { step: "doorway-components", itemId } : undefined });
  }
  d.profiles.forEach((p) => {
    const compLabel = p.componentKey === "Other" ? (p.componentOtherSpec || "Other") : p.componentKey;
    const finishStr = p.finish === "stained" ? `Stained${p.woodGrainSpecies ? ` (${p.woodGrainSpecies})` : ""}` : "Painted";
    let profileText = `${compLabel}: ${p.profilePartNumber || "—"} · ${p.thickness}" × ${p.width}" · ${finishStr}`;
    if (COMPONENTS_WITH_SIDES.includes(p.componentKey as DoorwayComponent)) {
      profileText += ` · ${p.sides === "both" ? "Both Sides" : "One Side"}`;
    }
    if (p.matchingWood != null && String(p.matchingWood).trim() !== "") {
      profileText += ` · Manufacturer: ${p.matchingWood.trim()}`;
    }
    entries.push({ label: profileText, view: isCurrent ? { step: "doorway-profiles", itemId } : undefined });
  });
  return entries;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}

function CollapsibleLinesList({
  lines,
  collapsedLines,
  onToggle,
  currentItemId,
  currentStep,
  onEdit,
}: {
  lines: QuoteItem[];
  collapsedLines: Set<number>;
  onToggle: (index: number) => void;
  currentItemId?: string | null;
  currentStep?: FormView["step"] | null;
  onEdit?: (view: FormView) => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-0.5">
        {lines.map((item, i) => {
          const isCollapsed = collapsedLines.has(i);
          const isCurrent = item.id === currentItemId;
          const detailEntries: { label: string; view?: FormView }[] = isCurrent
            ? getItemDetailEntries(item, item.id, currentStep ?? null)
            : getItemDetailLines(item).map((label) => ({ label }));
          return (
            <div key={item.id} className="border-b border-neutral-100 last:border-b-0 last:pb-0 pb-2">
              <button
                type="button"
                onClick={() => onToggle(i)}
                className="flex w-full items-center gap-2 py-1.5 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50 rounded"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" /> : <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500" />}
                Line {i + 1}
              </button>
              {!isCollapsed && detailEntries.length > 0 && (
                <div className="pl-6 flex flex-col gap-0.5 pt-0.5">
                  {detailEntries.map((entry, j) => (
                    <div key={j} className="flex items-center justify-between gap-2 text-sm text-neutral-700 py-0.5">
                      <span>{entry.label}</span>
                      {isCurrent && entry.view != null && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(entry.view!)}
                          className="flex shrink-0 rounded p-1 text-[#9f1b20] hover:bg-red-50 hover:text-[#8a171b]"
                          aria-label={`Edit ${entry.label}`}
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function FormStepLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export function QuoteRequestForm() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [currentItem, setCurrentItem] = useState<QuoteItem | null>(null);
  const [view, setView] = useState<FormView>({ step: "list" });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    business: "",
    location: "",
    yourName: "",
    email: "",
    phone: "",
    preferredMethod: "email",
    existingAccount: "no",
  });
  const [addingProfile, setAddingProfile] = useState<Partial<ProfileEntry>>({});
  const [applicationOtherDraft, setApplicationOtherDraft] = useState("");
  const [archStyleDraft, setArchStyleDraft] = useState<ArchStyle | null>(null);
  const [archStyleOtherDraft, setArchStyleOtherDraft] = useState("");
  const [curvedWallDraft, setCurvedWallDraft] = useState(false);
  const [componentSelections, setComponentSelections] = useState<DoorwayComponent[]>([]);
  const [componentOtherDraft, setComponentOtherDraft] = useState("");
  const [halfRoundDiameterDraft, setHalfRoundDiameterDraft] = useState("");
  const [straightLegLengthDraft, setStraightLegLengthDraft] = useState("");
  const [eyebrowWidthDraft, setEyebrowWidthDraft] = useState("");
  const [eyebrowRiseDraft, setEyebrowRiseDraft] = useState("");
  const [eyebrowRadiusDraft, setEyebrowRadiusDraft] = useState("");
  const [eyebrowLengthDraft, setEyebrowLengthDraft] = useState("");
  const [crownCurvatureDraft, setCrownCurvatureDraft] = useState<CrownCurvature | null>(null);
  const [crownOsrTightRadiiDraft, setCrownOsrTightRadiiDraft] = useState<CrownOsrTightRadiiOption[]>([]);
  const [collapsedLines, setCollapsedLines] = useState<Set<number>>(new Set());
  const prevStepRef = useRef<FormView["step"]>(view.step);

  useEffect(() => {
    if (view.step === "doorway-arch" && prevStepRef.current !== "doorway-arch" && currentItem?.doorway) {
      const d = currentItem.doorway;
      setArchStyleDraft(d.archStyle && d.archStyle !== "Curved Wall" ? d.archStyle : null);
      setCurvedWallDraft(d.curvedWall ?? (d.archStyle === "Curved Wall"));
      setArchStyleOtherDraft(d.archStyleOther ?? "");
    }
    prevStepRef.current = view.step;
  }, [view.step, currentItem?.id, currentItem?.doorway?.archStyle, currentItem?.doorway?.curvedWall, currentItem?.doorway?.archStyleOther]);

  const lines = (currentItem && view.step !== "application") ? [...items, currentItem] : items;
  const toggleLine = useCallback((i: number) => {
    setCollapsedLines((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  const updateCurrentItem = useCallback((updates: Partial<QuoteItem>) => {
    setCurrentItem((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const saveCurrentItemAndReturnToList = useCallback(() => {
    if (currentItem) {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === currentItem.id);
        const next = [...prev];
        if (idx >= 0) next[idx] = currentItem;
        else next.push(currentItem);
        return next;
      });
      setCurrentItem(null);
      setView({ step: "list" });
    }
  }, [currentItem]);

  const startNewItem = () => {
    const item: QuoteItem = {
      id: generateId(),
      application: "Doorway", // will show in lines only after user leaves application step
      applicationOther: undefined,
    };
    setCurrentItem(item);
    setView({ step: "application", itemId: item.id });
  };

  const setApplication = (app: ApplicationOption, other?: string) => {
    if (!currentItem) return;
    updateCurrentItem({ application: app, applicationOther: other });
    if (app === "Doorway") {
      setCurrentItem((prev) =>
        prev
          ? {
              ...prev,
              application: app,
              applicationOther: other,
              doorway: {
                archStyle: null,
                components: [],
                profiles: [],
              },
            }
          : null
      );
      setArchStyleDraft(null);
      setArchStyleOtherDraft("");
      setCurvedWallDraft(false);
      setView({ step: "doorway-arch", itemId: currentItem.id });
    } else if (app === "Crown") {
      setCurrentItem((prev) =>
        prev ? { ...prev, application: app, applicationOther: other } : null
      );
      setCrownCurvatureDraft(null);
      setCrownOsrTightRadiiDraft([]);
      setView({ step: "crown-curvature", itemId: currentItem.id });
    } else {
      setItems((prev) => [...prev, { ...currentItem, application: app, applicationOther: other }]);
      setCurrentItem(null);
      setView({ step: "list" });
    }
  };

  const setArchStyle = (style: ArchStyle, other?: string) => {
    if (!currentItem?.doorway) return;
    const doorway: DoorwayData = {
      ...currentItem.doorway,
      archStyle: style,
      archStyleOther: style === "Other" ? other : undefined,
    };
    updateCurrentItem({ doorway });
    if (style === "Half Round") {
      setCurrentItem((prev) =>
        prev?.doorway
          ? {
              ...prev,
              doorway: {
                ...prev.doorway,
                ...doorway,
                halfRound: { diameterIn: "", flexTrimLegs: false },
              },
            }
          : null
      );
    }
    setView({ step: "doorway-curved-wall", itemId: currentItem.id });
  };

  const setCurvedWallAndAdvance = (curvedWall: boolean) => {
    if (!currentItem?.doorway) return;
    setCurrentItem((prev) =>
      prev?.doorway ? { ...prev, doorway: { ...prev.doorway, curvedWall } } : null
    );
    setCurvedWallDraft(curvedWall);
    const style = currentItem.doorway.archStyle;
    if (style === "Half Round" && currentItem.doorway.halfRound) {
      setView({ step: "doorway-half-round-diameter", itemId: currentItem.id });
    } else if (style === "Eyebrow") {
      setView({ step: "doorway-eyebrow-dimensions-choice", itemId: currentItem.id });
    } else {
      setView({ step: "doorway-components", itemId: currentItem.id });
    }
  };

  const setHalfRoundDiameter = (diameterIn: string) => {
    if (!currentItem?.doorway?.halfRound) return;
    setCurrentItem((prev) =>
      prev?.doorway?.halfRound
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              halfRound: { ...prev.doorway.halfRound, diameterIn },
            },
          }
        : null
    );
    setView({ step: "doorway-half-round-flex", itemId: currentItem.id });
  };

  const setFlexTrimLegs = (yes: boolean) => {
    if (!currentItem?.doorway?.halfRound) return;
    setCurrentItem((prev) =>
      prev?.doorway?.halfRound
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              halfRound: {
                ...prev.doorway.halfRound,
                flexTrimLegs: yes,
                straightLegLengthIn: yes ? prev.doorway.halfRound.straightLegLengthIn : undefined,
              },
            },
          }
        : null
    );
    if (yes) setView({ step: "doorway-half-round-legs", itemId: currentItem.id });
    else setView({ step: "doorway-components", itemId: currentItem.id });
  };

  const setStraightLegLength = (lengthIn: string) => {
    if (!currentItem?.doorway?.halfRound) return;
    setCurrentItem((prev) =>
      prev?.doorway?.halfRound
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              halfRound: { ...prev.doorway.halfRound, straightLegLengthIn: lengthIn },
            },
          }
        : null
    );
    setView({ step: "doorway-components", itemId: currentItem.id });
  };

  const setEyebrowDimensionsChoice = (dimensionType: "width-rise" | "radius-length") => {
    if (!currentItem?.doorway) return;
    setCurrentItem((prev) =>
      prev?.doorway
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              eyebrow: dimensionType === "width-rise"
                ? { dimensionType: "width-rise", widthIn: "", riseIn: "" }
                : { dimensionType: "radius-length", radiusIn: "", lengthIn: "" },
            },
          }
        : null
    );
    setView({
      step: dimensionType === "width-rise" ? "doorway-eyebrow-width-rise" : "doorway-eyebrow-radius-length",
      itemId: currentItem.id,
    });
  };

  const setEyebrowWidthRise = (widthIn: string, riseIn: string) => {
    if (!currentItem?.doorway?.eyebrow) return;
    setCurrentItem((prev) =>
      prev?.doorway?.eyebrow
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              eyebrow: { ...prev.doorway.eyebrow!, dimensionType: "width-rise", widthIn, riseIn },
            },
          }
        : null
    );
    setView({ step: "doorway-components", itemId: currentItem.id });
  };

  const setEyebrowRadiusLength = (radiusIn: string, lengthIn: string) => {
    if (!currentItem?.doorway?.eyebrow) return;
    setCurrentItem((prev) =>
      prev?.doorway?.eyebrow
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              eyebrow: { ...prev.doorway.eyebrow!, dimensionType: "radius-length", radiusIn, lengthIn },
            },
          }
        : null
    );
    setView({ step: "doorway-components", itemId: currentItem.id });
  };

  const setDoorwayComponents = (components: DoorwayComponent[], otherSpec?: string) => {
    if (!currentItem?.doorway) return;
    setCurrentItem((prev) =>
      prev?.doorway
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              components,
              componentOtherSpec: otherSpec,
              profiles: prev.doorway.profiles.filter((p) =>
                components.includes(p.componentKey as DoorwayComponent)
              ),
            },
          }
        : null
    );
    setView({ step: "doorway-profiles", itemId: currentItem.id });
  };

  const openAddProfile = (componentKey: string, componentOtherSpec?: string) => {
    setAddingProfile({
      id: generateId(),
      componentKey,
      componentOtherSpec,
      profilePartNumber: "",
      thickness: "",
      width: "",
      matchingWood: "",
      finish: "painted",
      woodGrainSpecies: "",
      sides: "one",
    });
    setView({
      step: "doorway-add-profile",
      itemId: currentItem!.id,
      componentKey,
      componentOtherSpec,
    });
  };

  const saveProfile = () => {
    if (!currentItem?.doorway || !addingProfile.id) return;
    const entry: ProfileEntry = {
      id: addingProfile.id,
      componentKey: addingProfile.componentKey ?? "",
      componentOtherSpec: addingProfile.componentOtherSpec,
      profilePartNumber: addingProfile.profilePartNumber ?? "",
      thickness: addingProfile.thickness ?? "",
      width: addingProfile.width ?? "",
      matchingWood: addingProfile.matchingWood ?? "",
      finish: (addingProfile.finish as "painted" | "stained") ?? "painted",
      woodGrainSpecies: addingProfile.woodGrainSpecies ?? "",
      sides: (addingProfile.sides as "one" | "both") ?? "one",
    };
    setCurrentItem((prev) =>
      prev?.doorway
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              profiles: [...prev.doorway.profiles, entry],
            },
          }
        : null
    );
    setAddingProfile({});
    setView({ step: "doorway-profiles", itemId: currentItem.id });
  };

  const removeProfile = (profileId: string) => {
    setCurrentItem((prev) =>
      prev?.doorway
        ? {
            ...prev,
            doorway: {
              ...prev.doorway,
              profiles: prev.doorway.profiles.filter((p) => p.id !== profileId),
            },
          }
        : null
    );
  };

  const getArchSummary = (): string => {
    if (!currentItem?.doorway) return "";
    const d = currentItem.doorway;
    if (d.archStyle === "Half Round" && d.halfRound?.diameterIn) {
      return `${d.halfRound.diameterIn}" D Half Round Doorway`;
    }
    if (d.archStyle === "Eyebrow" && d.eyebrow) {
      const e = d.eyebrow;
      if (e.dimensionType === "width-rise" && (e.widthIn || e.riseIn)) return `Eyebrow: ${e.widthIn ?? '—'}" W × ${e.riseIn ?? '—'}" Rise`;
      if (e.dimensionType === "radius-length" && (e.radiusIn || e.lengthIn)) return `Eyebrow: ${e.radiusIn ?? '—'}" R × ${e.lengthIn ?? '—'}" L`;
    }
    return d.archStyle ? `${d.archStyle} Doorway` : "";
  };

  const goToContact = () => {
    setView({ step: "contact", itemIds: items.map((i) => i.id) });
  };

  const saveCrownAndReturnToList = (tightRadiiScenarios?: CrownOsrTightRadiiOption[]) => {
    if (!currentItem || crownCurvatureDraft === null) return;
    const crown: QuoteItem["crown"] = {
      curvature: crownCurvatureDraft,
      ...(tightRadiiScenarios && tightRadiiScenarios.length > 0 ? { tightRadiiScenarios } : {}),
    };
    const itemWithCrown: QuoteItem = { ...currentItem, crown };
    setItems((prev) => [...prev, itemWithCrown]);
    setCurrentItem(null);
    setCrownCurvatureDraft(null);
    setCrownOsrTightRadiiDraft([]);
    setView({ step: "list" });
  };

  const inputClass =
    "w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]";
  const labelClass = "block text-sm font-medium text-neutral-700";
  const btnPrimary =
    "rounded-full bg-[#9f1b20] px-4 py-2 text-sm font-medium text-white hover:bg-[#8a171b]";
  const btnSecondary =
    "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-[#9f1b20] hover:text-[#9f1b20]";
  const optionBtn =
    "w-full rounded border-2 border-neutral-300 px-4 py-3 text-left text-sm font-medium text-neutral-800 hover:border-[#9f1b20] hover:bg-red-50/50 focus:border-[#9f1b20]";

  // ——— List view ———
  if (view.step === "list") {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <div className="space-y-8">
        {items.length === 0 && (
          <p className="mb-8 text-neutral-600">
            Add one or more items, then complete your contact information. We’ll get back to you as soon as we can.
          </p>
        )}
        <div>
          {items.length === 0 && (
            <button type="button" onClick={startNewItem} className={btnPrimary}>
              Add New Item
            </button>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex gap-3">
            <button type="button" onClick={startNewItem} className={btnSecondary}>
              Add Another Item
            </button>
            <button type="button" onClick={goToContact} className={btnPrimary}>
              Continue to contact info
            </button>
          </div>
        )}
        </div>
      </div>
    );
  }

  // ——— Step 1: Application ———
  if (view.step === "application" && currentItem) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Select the application for this item</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {APPLICATION_OPTIONS.map((app) => (
            <button
              key={app}
              type="button"
              onClick={() => {
                if (app === "Other") updateCurrentItem({ application: "Other" });
                else setApplication(app);
              }}
              className={optionBtn}
            >
              {app}
            </button>
          ))}
        </div>
        {currentItem.application === "Other" && (
          <div>
            <label className={labelClass}>Please specify</label>
            <input
              type="text"
              value={applicationOtherDraft}
              onChange={(e) => setApplicationOtherDraft(e.target.value)}
              placeholder="Please specify"
              className={inputClass}
            />
            <button type="button" onClick={() => setApplication("Other", applicationOtherDraft)} className={`mt-3 ${btnPrimary}`}>
              Next
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { setCurrentItem(null); setView({ step: "list" }); setApplicationOtherDraft(""); }}
            className={btnSecondary}
          >
            Back
          </button>
        </div>
      </FormStepLayout>
      </div>
    );
  }

  // ——— Crown: curvature ———
  if (view.step === "crown-curvature" && currentItem) {
    const crownOptions: { value: CrownCurvature; img: { src: string } }[] = [
      { value: "ISR (Concave)", img: crownIsrImg },
      { value: "OSR (Convex)", img: crownOsrImg },
    ];
    const onCurvatureSelect = (opt: CrownCurvature) => {
      setCrownCurvatureDraft(opt);
      if (opt === "OSR (Convex)") setView({ step: "crown-osr-tight-radii", itemId: currentItem.id });
      else saveCrownAndReturnToList();
    };
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Select the crown curvature</h2>
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {crownOptions.map((opt) => {
              const isSelected = crownCurvatureDraft === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex flex-col cursor-pointer items-center justify-end rounded-lg border-2 p-4 transition-colors min-h-[200px] ${
                    isSelected ? "border-[#9f1b20] bg-red-50/50" : "border-neutral-300 bg-white hover:border-[#9f1b20] hover:bg-red-50/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="crownCurvature"
                    checked={isSelected}
                    onChange={() => onCurvatureSelect(opt.value)}
                    className="sr-only"
                  />
                  <img src={opt.img.src} alt={opt.value} className="w-full flex-1 object-contain min-h-0 max-h-32" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">{opt.value}</span>
                </label>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "application", itemId: currentItem.id })} className={btnSecondary}>
              Back
            </button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // ——— Crown: OSR tight radii (when OSR selected) ———
  if (view.step === "crown-osr-tight-radii" && currentItem) {
    const osrTightRadiiOptions: { value: CrownOsrTightRadiiOption; img: { src: string }; labelLines: string[] }[] = [
      { value: "Column Wrap", img: crownColumnWrapImg, labelLines: ["Column Wrap"] },
      { value: "Half Round Straight/Radius/Straight", img: crownHalfRoundStrRadStrOsrImg, labelLines: ["Half Round", "Straight/Radius/Straight"] },
      { value: "Quarter Round Straight/Radius/Straight", img: crownQuarterRoundStrRadStrOsrImg, labelLines: ["Quarter Round", "Straight/Radius/Straight"] },
    ];
    const onTightRadiiSelect = (opt: CrownOsrTightRadiiOption) => {
      const nextSelection = crownOsrTightRadiiDraft.includes(opt)
        ? crownOsrTightRadiiDraft.filter((o) => o !== opt)
        : [...crownOsrTightRadiiDraft, opt];
      setCrownOsrTightRadiiDraft(nextSelection);
      saveCrownAndReturnToList(nextSelection);
    };
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Please select if any of the following tight radii scenarios apply:</h2>
          <div className="grid grid-cols-3 gap-4 max-w-4xl">
            {osrTightRadiiOptions.map((opt) => {
              const isSelected = crownOsrTightRadiiDraft.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex flex-col cursor-pointer items-center justify-end rounded-lg border-2 p-4 transition-colors min-h-[200px] ${
                    isSelected ? "border-[#9f1b20] bg-red-50/50" : "border-neutral-300 bg-white hover:border-[#9f1b20] hover:bg-red-50/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onTightRadiiSelect(opt.value)}
                    className="sr-only"
                  />
                  <img src={opt.img.src} alt={opt.value} className="w-full flex-1 object-contain min-h-0 max-h-32" />
                  <span className="text-sm font-medium text-neutral-800 mt-2 text-center">
                    {opt.labelLines.map((line, i) => (
                      <span key={i}>{line}{i < opt.labelLines.length - 1 ? <br /> : null}</span>
                    ))}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "crown-curvature", itemId: currentItem.id })} className={btnSecondary}>
              Back
            </button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // ——— Doorway: Arch style ———
  if (view.step === "doorway-arch" && currentItem?.doorway) {
    const archStyleImages: Partial<Record<string, { src: string }>> = {
      "Half Round": archStyleHalfRoundImg,
      Eyebrow: archStyleEyebrowImg,
      Elliptical: archStyleEllipticalImg,
      "Radius Corners": archStyleRadiusCornersImg,
      Gothic: archStyleGothicImg,
      Straight: archStyleStraightImg,
    };
    const archGridOrder: ArchStyle[] = [
      "Half Round",
      "Eyebrow",
      "Elliptical",
      "Radius Corners",
      "Gothic",
      "Straight",
    ];
    const onArchSelect = (style: ArchStyle) => {
      if (style === "Other") {
        setArchStyleDraft("Other");
        return;
      }
      setArchStyle(style);
    };
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Select the doorway arch style</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3 w-full">
            {archGridOrder.map((style) => {
              const img = archStyleImages[style];
              const isSelected = archStyleDraft === style;
              return (
                <label
                  key={style}
                  className={`flex flex-col cursor-pointer items-center justify-end rounded-lg border-2 p-3 transition-colors aspect-square min-h-36 ${
                    isSelected ? "border-[#9f1b20] bg-red-50/50" : "border-neutral-300 bg-white hover:border-[#9f1b20] hover:bg-red-50/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="archStyle"
                    checked={isSelected}
                    onChange={() => onArchSelect(style)}
                    className="sr-only"
                  />
                  {img ? (
                    <>
                      <img src={img.src} alt={style} className="w-full flex-1 object-contain min-h-0" />
                      <span className="text-sm font-medium text-neutral-800 mt-1">{style}</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-neutral-800 flex-1 flex items-center justify-center">{style}</span>
                  )}
                </label>
              );
            })}
          </div>
          <div className="w-full">
            <label
              className={`flex cursor-pointer items-center justify-center rounded-full border-2 p-3 transition-colors h-12 w-full ${
                archStyleDraft === "Other" ? "border-[#9f1b20] bg-red-50/50" : "border-neutral-300 bg-white hover:border-[#9f1b20] hover:bg-red-50/30"
              }`}
            >
              <input
                type="radio"
                name="archStyle"
                checked={archStyleDraft === "Other"}
                onChange={() => setArchStyleDraft("Other")}
                className="sr-only"
              />
              <span className="text-sm font-medium text-neutral-800">Other</span>
            </label>
          </div>
          {archStyleDraft === "Other" && (
            <>
              <input
                type="text"
                placeholder="Please specify"
                value={archStyleOtherDraft}
                onChange={(e) => setArchStyleOtherDraft(e.target.value)}
                className={inputClass}
              />
              <button type="button" onClick={() => setArchStyle("Other", archStyleOtherDraft)} className={btnPrimary}>
                Next
              </button>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => { setCurrentItem(null); setView({ step: "list" }); setArchStyleDraft(null); setArchStyleOtherDraft(""); setCurvedWallDraft(false); }} className={btnSecondary}>
            Back
          </button>
        </div>
      </FormStepLayout>
      </div>
    );
  }

  // ——— Doorway: Curved wall (after arch style) ———
  if (view.step === "doorway-curved-wall" && currentItem?.doorway) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Is this being installed on a curved wall?</h2>
          <div className="flex gap-4">
            <button type="button" onClick={() => setCurvedWallAndAdvance(true)} className={optionBtn}>
              Yes
            </button>
            <button type="button" onClick={() => setCurvedWallAndAdvance(false)} className={optionBtn}>
              No
            </button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "doorway-arch", itemId: currentItem.id })} className={btnSecondary}>
              Back
            </button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // Eyebrow: which dimensions to provide
  if (view.step === "doorway-eyebrow-dimensions-choice" && currentItem?.doorway) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Which dimensions would you like to provide?</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setEyebrowDimensionsChoice("width-rise")} className={optionBtn}>
              Width & Rise
            </button>
            <button type="button" onClick={() => setEyebrowDimensionsChoice("radius-length")} className={optionBtn}>
              Radius & Length
            </button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "doorway-curved-wall", itemId: currentItem.id })} className={btnSecondary}>Back</button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // Eyebrow: Width & Rise
  if (view.step === "doorway-eyebrow-width-rise" && currentItem?.doorway?.eyebrow) {
    const e = currentItem.doorway.eyebrow;
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Enter width and rise (in)</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex w-full max-w-2xl justify-center">
              <img src={eyebrowWidthRiseImg.src} alt="Eyebrow width and rise" className="max-h-80 w-auto object-contain sm:max-h-96" />
              {/* Width at bottom center — moved down 3/16" */}
              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1" style={{ bottom: "calc(1rem - 0.1875in)" }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Width"
                  value={eyebrowWidthDraft || (e.widthIn ?? "")}
                  onChange={(e) => setEyebrowWidthDraft(e.target.value)}
                  className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                />
                <span className="text-sm text-neutral-500">in</span>
              </div>
              {/* Height (Rise) in the middle — moved up 0.2" */}
              <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1" style={{ top: "calc(50% - 0.2in)" }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Height"
                  value={eyebrowRiseDraft || (e.riseIn ?? "")}
                  onChange={(e) => setEyebrowRiseDraft(e.target.value)}
                  className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                />
                <span className="text-sm text-neutral-500">in</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "doorway-eyebrow-dimensions-choice", itemId: currentItem.id })} className={btnSecondary}>Back</button>
            <button
              type="button"
              onClick={() => {
                const w = eyebrowWidthDraft || (e.widthIn ?? "");
                const r = eyebrowRiseDraft || (e.riseIn ?? "");
                setEyebrowWidthRise(w, r);
                setEyebrowWidthDraft("");
                setEyebrowRiseDraft("");
              }}
              className={btnPrimary}
            >
              Next
            </button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // Eyebrow: Radius & Length
  if (view.step === "doorway-eyebrow-radius-length" && currentItem?.doorway?.eyebrow) {
    const e = currentItem.doorway.eyebrow;
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
        <FormStepLayout>
          <h2 className="text-xl font-medium text-neutral-900">Enter radius and length (in)</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex w-full max-w-2xl justify-center">
              <img src={eyebrowRadiusLengthImg.src} alt="Eyebrow radius and length" className="max-h-80 w-auto object-contain sm:max-h-96" />
              {/* Radius at middle bottom — moved down 3/16" */}
              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1" style={{ bottom: "calc(25% - 0.1875in)" }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Radius"
                  value={eyebrowRadiusDraft || (e.radiusIn ?? "")}
                  onChange={(e) => setEyebrowRadiusDraft(e.target.value)}
                  className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                />
                <span className="text-sm text-neutral-500">in</span>
              </div>
              {/* Length at middle top — moved up 7/16" */}
              <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1" style={{ top: "calc(30% - 0.4375in)" }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Length"
                  value={eyebrowLengthDraft || (e.lengthIn ?? "")}
                  onChange={(e) => setEyebrowLengthDraft(e.target.value)}
                  className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
                />
                <span className="text-sm text-neutral-500">in</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView({ step: "doorway-eyebrow-dimensions-choice", itemId: currentItem.id })} className={btnSecondary}>Back</button>
            <button
              type="button"
              onClick={() => {
                const rad = eyebrowRadiusDraft || (e.radiusIn ?? "");
                const len = eyebrowLengthDraft || (e.lengthIn ?? "");
                setEyebrowRadiusLength(rad, len);
                setEyebrowRadiusDraft("");
                setEyebrowLengthDraft("");
              }}
              className={btnPrimary}
            >
              Next
            </button>
          </div>
        </FormStepLayout>
      </div>
    );
  }

  // Half Round: diameter
  if (view.step === "doorway-half-round-diameter" && currentItem?.doorway?.halfRound) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Enter half round diameter (in)</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex w-full max-w-2xl justify-center">
            <img src={halfRoundDiagram.src} alt="Half round diameter" className="max-h-80 w-auto object-contain sm:max-h-96" />
            {/* Position diameter input between the dimension lines at bottom of diagram */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
              <input
                key="half-round-diameter-input"
                type="text"
                inputMode="decimal"
                placeholder="Diameter"
                value={halfRoundDiameterDraft || currentItem.doorway.halfRound.diameterIn}
                onChange={(e) => setHalfRoundDiameterDraft(e.target.value)}
                className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
              />
              <span className="text-sm text-neutral-500">in</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "doorway-curved-wall", itemId: currentItem.id })} className={btnSecondary}>Back</button>
          <button type="button" onClick={() => { const val = halfRoundDiameterDraft || currentItem.doorway.halfRound.diameterIn; setHalfRoundDiameter(val); setHalfRoundDiameterDraft(""); }} className={btnPrimary}>Next</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "doorway-half-round-flex" && currentItem?.doorway?.halfRound) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Would you like to order the straight legs in flex trim?</h2>
        <div className="flex gap-3">
          <button type="button" onClick={() => setFlexTrimLegs(true)} className={optionBtn}>Yes</button>
          <button type="button" onClick={() => setFlexTrimLegs(false)} className={optionBtn}>No</button>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "doorway-half-round-diameter", itemId: currentItem.id })} className={btnSecondary}>Back</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "doorway-half-round-legs" && currentItem?.doorway?.halfRound) {
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Enter the straight leg length (in)</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex w-full max-w-2xl justify-center">
            <img src={halfRoundStrLegsDiagram.src} alt="Straight leg length" className="max-h-80 w-auto object-contain sm:max-h-96" />
            {/* Input to the left of the vertical dimension line; offset right 1.375in, down 0.3125in for 23.5" screen */}
            <div className="absolute left-[1.375in] top-[calc(58%+0.3125in)] flex -translate-y-1/2 items-center gap-1">
              <input
                key="half-round-str-legs-input"
                type="text"
                inputMode="decimal"
                placeholder="Length"
                value={straightLegLengthDraft || (currentItem.doorway.halfRound.straightLegLengthIn ?? "")}
                onChange={(e) => setStraightLegLengthDraft(e.target.value)}
                className="w-20 rounded border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm text-neutral-900 shadow-sm focus:border-[#9f1b20] focus:outline-none focus:ring-1 focus:ring-[#9f1b20]"
              />
              <span className="text-sm text-neutral-500">in</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "doorway-half-round-flex", itemId: currentItem.id })} className={btnSecondary}>Back</button>
          <button type="button" onClick={() => { setStraightLegLength(straightLegLengthDraft || (currentItem.doorway.halfRound?.straightLegLengthIn ?? "")); setStraightLegLengthDraft(""); }} className={btnPrimary}>Next</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "doorway-components" && currentItem?.doorway) {
    const selected = currentItem.doorway.components.length > 0 ? currentItem.doorway.components : componentSelections;
    const toggle = (c: DoorwayComponent) => {
      if (currentItem.doorway!.components.length > 0) {
        const next = currentItem.doorway.components.includes(c) ? currentItem.doorway.components.filter((x) => x !== c) : [...currentItem.doorway.components, c];
        setCurrentItem((prev) => prev?.doorway ? { ...prev, doorway: { ...prev.doorway, components: next } } : null);
      } else setComponentSelections((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
    };
    const hasOther = (currentItem.doorway.components.length > 0 && currentItem.doorway.components.includes("Other")) || componentSelections.includes("Other");
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Select components needed for this doorway</h2>
        <div className="space-y-2">
          {DOORWAY_COMPONENTS.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={currentItem.doorway!.components.length > 0 ? currentItem.doorway!.components.includes(c) : componentSelections.includes(c)} onChange={() => toggle(c)} className="h-4 w-4 rounded border-neutral-400 text-[#9f1b20] focus:ring-[#9f1b20]" />
              <span className="text-neutral-800">{c}</span>
            </label>
          ))}
          {hasOther && (
            <div className="ml-6 mt-2">
              <label className={labelClass}>Please specify</label>
              <input type="text" value={currentItem.doorway.componentOtherSpec ?? componentOtherDraft} onChange={(e) => { if (currentItem.doorway!.components.length > 0) setCurrentItem((prev) => prev?.doorway ? { ...prev, doorway: { ...prev.doorway, componentOtherSpec: e.target.value } } : null); else setComponentOtherDraft(e.target.value); }} placeholder="Please specify" className={inputClass} />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setComponentSelections([]);
              setComponentOtherDraft("");
              const d = currentItem.doorway!;
              if (d.archStyle === "Half Round" && d.halfRound) {
                if (d.halfRound.flexTrimLegs) setView({ step: "doorway-half-round-legs", itemId: currentItem.id });
                else setView({ step: "doorway-half-round-flex", itemId: currentItem.id });
              } else if (d.archStyle === "Eyebrow" && d.eyebrow) {
                setView({ step: d.eyebrow.dimensionType === "width-rise" ? "doorway-eyebrow-width-rise" : "doorway-eyebrow-radius-length", itemId: currentItem.id });
              } else setView({ step: "doorway-curved-wall", itemId: currentItem.id });
            }}
            className={btnSecondary}
          >
            Back
          </button>
          <button type="button" onClick={() => { const comps = currentItem.doorway!.components.length > 0 ? currentItem.doorway!.components : componentSelections; setDoorwayComponents(comps, currentItem.doorway!.componentOtherSpec ?? componentOtherDraft); setComponentSelections([]); setComponentOtherDraft(""); }} disabled={selected.length === 0} className={btnPrimary}>Next</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "doorway-profiles" && currentItem?.doorway) {
    const summary = getArchSummary();
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        {summary && <p className="text-lg font-medium text-neutral-900">{summary}</p>}
        <div className="space-y-4">
          {currentItem.doorway.components.map((comp) => {
            const profilesForComp = currentItem.doorway!.profiles.filter((p) => p.componentKey === comp);
            const label = comp === "Other" ? (currentItem.doorway.componentOtherSpec || "Other") : comp;
            return (
              <div key={comp} className="rounded border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-neutral-800">{label}</span>
                  <button type="button" onClick={() => openAddProfile(comp, currentItem.doorway?.componentOtherSpec)} className="text-sm text-[#9f1b20] hover:underline">Add Profile</button>
                </div>
                <ul className="mt-2 space-y-2">
                  {profilesForComp.map((p) => (
                    <li key={p.id} className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm">
                      <span>{p.profilePartNumber || "—"} · {p.thickness}" × {p.width}" · {p.finish === "stained" ? "Stained" : "Painted"}</span>
                      <button type="button" onClick={() => removeProfile(p.id)} className="text-red-600 hover:underline">Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "doorway-components", itemId: currentItem.id })} className={btnSecondary}>Back</button>
          <button type="button" onClick={saveCurrentItemAndReturnToList} className={btnPrimary}>Next</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "doorway-add-profile" && currentItem?.doorway) {
    const showSides = COMPONENTS_WITH_SIDES.includes(view.componentKey as DoorwayComponent);
    return (
      <div className="space-y-6">
        {lines.length > 0 && <CollapsibleLinesList lines={lines} collapsedLines={collapsedLines} onToggle={toggleLine} currentItemId={currentItem?.id} currentStep={view.step} onEdit={setView} />}
      <FormStepLayout>
        <h2 className="text-xl font-medium text-neutral-900">Add profile — {view.componentKey === "Other" ? (view.componentOtherSpec || "Other") : view.componentKey}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Profile/Part Number</label><input type="text" value={addingProfile.profilePartNumber ?? ""} onChange={(e) => setAddingProfile((p) => ({ ...p, profilePartNumber: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Matching Wood Manufacturer (if applicable)</label><input type="text" value={addingProfile.matchingWood ?? ""} onChange={(e) => setAddingProfile((p) => ({ ...p, matchingWood: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Thickness (in)</label><input type="text" value={addingProfile.thickness ?? ""} onChange={(e) => setAddingProfile((p) => ({ ...p, thickness: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Width (in)</label><input type="text" value={addingProfile.width ?? ""} onChange={(e) => setAddingProfile((p) => ({ ...p, width: e.target.value }))} className={inputClass} /></div>
        </div>
        <div>
          <span className={labelClass}>Finish</span>
          <div className="mt-1 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="finish" checked={(addingProfile.finish ?? "painted") === "painted"} onChange={() => setAddingProfile((p) => ({ ...p, finish: "painted" }))} className="h-4 w-4 text-[#9f1b20]" /><span>Painted</span></label>
            <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="finish" checked={(addingProfile.finish ?? "painted") === "stained"} onChange={() => setAddingProfile((p) => ({ ...p, finish: "stained" }))} className="h-4 w-4 text-[#9f1b20]" /><span>Stained</span></label>
          </div>
        </div>
        {(addingProfile.finish ?? "painted") === "stained" && (
          <div><label className={labelClass}>Wood Grain/Species</label><input type="text" value={addingProfile.woodGrainSpecies ?? ""} onChange={(e) => setAddingProfile((p) => ({ ...p, woodGrainSpecies: e.target.value }))} className={inputClass} /></div>
        )}
        {showSides && (
          <div>
            <span className={labelClass}>Sides of Doorway/Wall</span>
            <div className="mt-1 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="sides" checked={(addingProfile.sides ?? "one") === "one"} onChange={() => setAddingProfile((p) => ({ ...p, sides: "one" }))} className="h-4 w-4 text-[#9f1b20]" /><span>One Side</span></label>
              <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="sides" checked={(addingProfile.sides ?? "one") === "both"} onChange={() => setAddingProfile((p) => ({ ...p, sides: "both" }))} className="h-4 w-4 text-[#9f1b20]" /><span>Both Sides</span></label>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "doorway-profiles", itemId: currentItem.id })} className={btnSecondary}>Cancel</button>
          <button type="button" onClick={saveProfile} className={btnPrimary}>Add Profile</button>
        </div>
      </FormStepLayout>
      </div>
    );
  }
  if (view.step === "contact") {
    const responseMsg = getResponseTimeMessage();
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-neutral-900">Please fill out your info and we will get back to you {responseMsg}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Business</label><input type="text" value={contactInfo.business} onChange={(e) => setContactInfo((c) => ({ ...c, business: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Location</label><input type="text" value={contactInfo.location} onChange={(e) => setContactInfo((c) => ({ ...c, location: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Your Name</label><input type="text" value={contactInfo.yourName} onChange={(e) => setContactInfo((c) => ({ ...c, yourName: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Email</label><input type="email" value={contactInfo.email} onChange={(e) => setContactInfo((c) => ({ ...c, email: e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>Phone Number</label><input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo((c) => ({ ...c, phone: e.target.value }))} className={inputClass} /></div>
        </div>
        <div>
          <span className={labelClass}>Preferred Method of Communication</span>
          <div className="mt-1 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="pref" checked={contactInfo.preferredMethod === "email"} onChange={() => setContactInfo((c) => ({ ...c, preferredMethod: "email" }))} className="h-4 w-4 text-[#9f1b20]" /><span>Email</span></label>
            <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="pref" checked={contactInfo.preferredMethod === "phone"} onChange={() => setContactInfo((c) => ({ ...c, preferredMethod: "phone" }))} className="h-4 w-4 text-[#9f1b20]" /><span>Phone</span></label>
          </div>
        </div>
        <div>
          <span className={labelClass}>Do you have an existing account with us?</span>
          <div className="mt-1 flex gap-4">
            <button type="button" onClick={() => setContactInfo((c) => ({ ...c, existingAccount: "yes" }))} className={contactInfo.existingAccount === "yes" ? btnPrimary : btnSecondary}>Yes</button>
            <button type="button" onClick={() => setContactInfo((c) => ({ ...c, existingAccount: "no" }))} className={contactInfo.existingAccount === "no" ? btnPrimary : btnSecondary}>No</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setView({ step: "list" })} className={btnSecondary}>Back</button>
          <button type="button" onClick={() => alert("Quote request submitted. (Form submission not yet connected to a backend.)")} className={btnPrimary}>Submit</button>
        </div>
      </div>
    );
  }
  return null;
}