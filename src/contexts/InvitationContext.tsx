'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export type ToneType = 'FORMAL' | 'WARM' | 'MODERN' | 'CLASSIC' | 'CASUAL' | 'ROMANTIC';
export type FrameType = 'CLASSIC' | 'FLORAL' | 'MINIMAL' | 'ROMANTIC';
export type ThreeDStatus = 'IDLE' | 'SUBMITTED' | 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED' | 'CANCELED';

export interface PersonInfo {
  name: string;
  fatherName: string;
  motherName: string;
}

export interface WeddingInfo {
  hallName: string;
  address: string;
  date: string;
  time: string;
}

export interface InvitationData {
  groom: PersonInfo;
  bride: PersonInfo;
  wedding: WeddingInfo;
  extraMessage: string;
  additionalRequest: string;
  tone: ToneType | null;
  frame: FrameType | null;
  assets: {
    styleImages: File[];
    userImages: File[];
  };
  design: {
    result2dImageUrls: string[];
  };
  threeD: {
    status: ThreeDStatus;
    invitationId: string | null;
    assets: Record<string, string> | null;
    result2dImageUrls: string[];
    error: string | null;
    startedAt: number | null;
    mainImages: File[];
    referenceImages: File[];
  };
}

export const initialInvitationData: InvitationData = {
  groom: { name: '', fatherName: '', motherName: '' },
  bride: { name: '', fatherName: '', motherName: '' },
  wedding: { hallName: '', address: '', date: '', time: '' },
  extraMessage: '',
  additionalRequest: '',
  tone: null,
  frame: null,
  assets: { styleImages: [], userImages: [] },
  design: { result2dImageUrls: [] },
  threeD: {
    status: 'IDLE',
    invitationId: null,
    assets: null,
    result2dImageUrls: [],
    error: null,
    startedAt: null,
    mainImages: [],
    referenceImages: [],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function setByPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  const next: any = Array.isArray(obj) ? [...obj] : { ...obj }; // eslint-disable-line
  let cur: any = next; // eslint-disable-line
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const prevVal = cur[k];
    cur[k] = Array.isArray(prevVal) ? [...prevVal] : { ...(prevVal ?? {}) };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}

function is3DDone(status: string | undefined) {
  return String(status ?? '').toUpperCase() === 'COMPLETED';
}
function isFailed(status: string | undefined) {
  const v = String(status ?? '').toUpperCase();
  return v.includes('FAILED') || v.includes('ERROR');
}

// ── Context ────────────────────────────────────────────────────────────────
interface InvitationActions {
  updateField: (path: string, value: unknown) => void;
  patchData: (partial: Partial<InvitationData>) => void;
  setStyleImages: (files: File[]) => void;
  setUserImages: (files: File[]) => void;
  setDesignResultImages: (urls: string[]) => void;
  setThreeDMainImage: (file: File | null) => void;
  setThreeDReferenceImages: (files: File[]) => void;
  resetDesignStage: () => void;
  stopThreeDPolling: (reason?: string) => void;
}

type InvitationContextValue = { data: InvitationData } & InvitationActions;

const InvitationContext = createContext<InvitationContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────
export function InvitationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<InvitationData>(initialInvitationData);
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopThreeDPolling = useCallback((reason = 'CANCELED') => {
    if (pollTimerRef.current) { clearTimeout(pollTimerRef.current); pollTimerRef.current = null; }
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    setData((prev) => {
      const cur = prev?.threeD?.status;
      if (cur === 'DONE' || cur === 'FAILED') return prev;
      return setByPath(prev as unknown as Record<string, unknown>, 'threeD', {
        ...prev.threeD,
        status: reason,
        error: reason === 'CANCELED' ? '사용자에 의해 취소되었습니다.' : prev.threeD?.error,
      }) as unknown as InvitationData;
    });
  }, []);

  const setThreeDMainImage = useCallback((file: File | null) => {
    setData((prev) => setByPath(prev as unknown as Record<string, unknown>, 'threeD.mainImages', file ? [file] : []) as unknown as InvitationData);
  }, []);

  const setThreeDReferenceImages = useCallback((files: File[]) => {
    const safe = Array.isArray(files) ? files.filter(Boolean).slice(0, 2) : [];
    setData((prev) => setByPath(prev as unknown as Record<string, unknown>, 'threeD.referenceImages', safe) as unknown as InvitationData);
  }, []);

  const setDesignResultImages = useCallback((urls: string[] = []) => {
    const safe = Array.isArray(urls) ? urls.filter(Boolean) : [];
    setData((prev) => setByPath(prev as unknown as Record<string, unknown>, 'design.result2dImageUrls', safe) as unknown as InvitationData);
  }, []);

  const resetDesignStage = useCallback(() => {
    setData((prev) => ({
      ...prev,
      assets: { ...prev.assets, styleImages: [] },
      design: { ...initialInvitationData.design },
      threeD: {
        ...initialInvitationData.threeD,
        mainImages: prev.threeD?.mainImages ?? [],
        referenceImages: prev.threeD?.referenceImages ?? [],
      },
    }));
  }, []);

  useEffect(() => { return () => stopThreeDPolling('CANCELED'); }, [stopThreeDPolling]);

  const actions = useMemo<InvitationActions>(() => ({
    updateField: (path, value) =>
      setData((prev) => setByPath(prev as unknown as Record<string, unknown>, path, value) as unknown as InvitationData),
    patchData: (partial) => setData((prev) => ({ ...prev, ...partial })),
    setStyleImages: (files) =>
      setData((prev) => setByPath(prev as unknown as Record<string, unknown>, 'assets.styleImages', files) as unknown as InvitationData),
    setUserImages: (files) =>
      setData((prev) => setByPath(prev as unknown as Record<string, unknown>, 'assets.userImages', files) as unknown as InvitationData),
    setDesignResultImages,
    setThreeDMainImage,
    setThreeDReferenceImages,
    resetDesignStage,
    stopThreeDPolling,
  }), [setDesignResultImages, setThreeDMainImage, setThreeDReferenceImages, resetDesignStage, stopThreeDPolling]);

  return (
    <InvitationContext.Provider value={{ data, ...actions }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error('useInvitation must be used within InvitationProvider');
  return ctx;
}
