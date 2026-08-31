export type ModalType =
  | 'settings'
  | 'victory'
  | 'confirmExit'
  | 'help'
  | null;

export interface UIState {
  activeModal: ModalType;
  hoveredTile: number | null;
  resolutionMessage: string | null;
  canEndTurn: boolean;
}
