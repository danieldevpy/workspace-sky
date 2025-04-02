import { WorkPage } from '@/app/(dashboard)/workspace/schema/WorkSpace';

export interface EmbedWorkPageModalProps {
  open: boolean;
  workpages: WorkPage[];
  handleClose: () => void;
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
  updatedUrls: Record<number, string>;
  handleUpdateUrl: (pageId: number, newUrl: string) => void;
}