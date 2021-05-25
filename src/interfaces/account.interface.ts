export interface Account {
  accountNumber: number;
  accountBalance: number;
  accountBaseBalance: number;
  accountType: string;
  accountHolderId: string;
  accountActive: boolean;
  accountPendingClose: boolean;
  accountFrozen: boolean;
}
