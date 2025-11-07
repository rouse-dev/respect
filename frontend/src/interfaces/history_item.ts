export default interface HistoryItem {
  change: number;
  reason: string;
  createdAt: string;
  lesson?: string;
  class: string;
}