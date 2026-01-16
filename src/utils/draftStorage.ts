import type { IResumeData, TemplateId } from '@/types/resume';
import type { IDraft } from '@/types/auth';

const DRAFTS_STORAGE_KEY = 'resume-builder-drafts';
const DRAFT_EXPIRY_DAYS = 30;

const getDraftsKey = (userId: string | null): string => {
  return userId ? `${DRAFTS_STORAGE_KEY}-${userId}` : DRAFTS_STORAGE_KEY;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const getDrafts = (userId: string | null): IDraft[] => {
  const key = getDraftsKey(userId);
  const stored = localStorage.getItem(key);

  if (!stored) return [];

  try {
    const drafts: IDraft[] = JSON.parse(stored);
    const now = new Date();

    // Filter out expired drafts
    const validDrafts = drafts.filter(draft => {
      const expiresAt = new Date(draft.expiresAt);
      return expiresAt > now;
    });

    // If some drafts were removed, update storage
    if (validDrafts.length !== drafts.length) {
      localStorage.setItem(key, JSON.stringify(validDrafts));
    }

    return validDrafts;
  } catch {
    return [];
  }
};

export const saveDraft = (
  userId: string | null,
  name: string,
  templateId: TemplateId,
  data: IResumeData
): IDraft => {
  const drafts = getDrafts(userId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const newDraft: IDraft = {
    id: generateId(),
    name: name || 'Untitled Draft',
    templateId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    data,
  };

  drafts.unshift(newDraft);

  const key = getDraftsKey(userId);
  localStorage.setItem(key, JSON.stringify(drafts));

  return newDraft;
};

export const updateDraft = (
  userId: string | null,
  draftId: string,
  data: IResumeData,
  name?: string
): IDraft | null => {
  const drafts = getDrafts(userId);
  const index = drafts.findIndex(d => d.id === draftId);

  if (index === -1) return null;

  // Update the draft and refresh expiry
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  drafts[index] = {
    ...drafts[index],
    data,
    expiresAt: expiresAt.toISOString(),
    ...(name && { name }),
  };

  const key = getDraftsKey(userId);
  localStorage.setItem(key, JSON.stringify(drafts));

  return drafts[index];
};

export const getDraftById = (userId: string | null, draftId: string): IDraft | null => {
  const drafts = getDrafts(userId);
  return drafts.find(d => d.id === draftId) || null;
};

export const deleteDraft = (userId: string | null, draftId: string): boolean => {
  const drafts = getDrafts(userId);
  const filtered = drafts.filter(d => d.id !== draftId);

  if (filtered.length === drafts.length) return false;

  const key = getDraftsKey(userId);
  localStorage.setItem(key, JSON.stringify(filtered));

  return true;
};

export const clearExpiredDrafts = (userId: string | null): void => {
  // getDrafts already filters expired drafts
  getDrafts(userId);
};
