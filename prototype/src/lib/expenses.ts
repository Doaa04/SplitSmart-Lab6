const maxInt = 2_147_483_647;

export function parseId(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d{0,9}$/.test(value)) return null;
  const id = Number(value);
  return id <= maxInt ? id : null;
}

export function parseAmount(value: unknown) {
  if (typeof value !== "string") return null;
  const amount = /^(\d{1,8})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!amount) return null;
  const cents = Number(amount[1]) * 100 + Number((amount[2] ?? "").padEnd(2, "0"));
  return cents > 0 && cents <= maxInt ? cents : null;
}

export function splitExpense(cents: number, participantIds: number[]) {
  const share = Math.floor(cents / participantIds.length);
  const remainder = cents % participantIds.length;
  // Allocate extra cents to earlier-added members.
  return [...participantIds].sort((a, b) => a - b).map((memberId, index) => ({
    memberId,
    amountCents: share + Number(index < remainder),
  }));
}

type RecordedExpense = {
  payerId: number;
  amountCents: number;
  shares: { memberId: number; amountCents: number }[];
};

export function calculateBalances(members: { id: number }[], expenses: RecordedExpense[]) {
  const balances = new Map(members.map(({ id }) => [id, BigInt(0)]));
  for (const expense of expenses) {
    balances.set(expense.payerId, balances.get(expense.payerId)! + BigInt(expense.amountCents));
    for (const share of expense.shares) {
      balances.set(share.memberId, balances.get(share.memberId)! - BigInt(share.amountCents));
    }
  }
  return balances;
}

export function money(cents: number | bigint, signed = false) {
  const amount = BigInt(cents);
  const absolute = amount < 0 ? -amount : amount;
  const hundred = BigInt(100);
  const sign = amount < 0 ? "-" : signed && amount > 0 ? "+" : "";
  return `${sign}$${(absolute / hundred).toLocaleString("en-US")}.${String(absolute % hundred).padStart(2, "0")}`;
}
