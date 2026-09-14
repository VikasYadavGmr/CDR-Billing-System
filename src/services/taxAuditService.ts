import type { RecordStatus, TaxAuditAction, TaxAuditLog, TaxRule } from '../types/tax';
import { mockTaxAuditLogs, nextTaxAuditId } from '../mock-data/taxAuditData';

const delay = <T,>(value: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export interface RecordAuditInput {
  rule: TaxRule;
  action: TaxAuditAction;
  oldRate?: number | null;
  newRate?: number | null;
  oldStatus?: RecordStatus | null;
  newStatus?: RecordStatus | null;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy: string;
  reason: string;
}

/**
 * Append-only journal of tax rule changes. Entries are never edited or removed,
 * which is what keeps historical invoices defensible after a rate change.
 */
export const taxAuditService = {
  getAuditLogs: async (): Promise<TaxAuditLog[]> => delay([...mockTaxAuditLogs]),

  getAuditLogsByRule: async (taxRuleId: string): Promise<TaxAuditLog[]> =>
    delay(mockTaxAuditLogs.filter((log) => log.taxRuleId === taxRuleId)),

  recordChange: async (input: RecordAuditInput): Promise<TaxAuditLog> => {
    const entry: TaxAuditLog = {
      auditId: nextTaxAuditId(),
      taxRuleId: input.rule.taxRuleId,
      taxRuleLabel: `${input.rule.countryName} — ${input.rule.taxName} (${input.rule.rate}%)`,
      action: input.action,
      oldRate: input.oldRate ?? null,
      newRate: input.newRate ?? null,
      oldStatus: input.oldStatus ?? null,
      newStatus: input.newStatus ?? null,
      oldValue: input.oldValue ?? null,
      newValue: input.newValue ?? null,
      changedBy: input.changedBy,
      changedAt: new Date().toISOString(),
      reason: input.reason,
    };
    mockTaxAuditLogs.unshift(entry);
    return entry;
  },
};
