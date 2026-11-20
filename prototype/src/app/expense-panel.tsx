import { money } from "@/lib/expenses";

type Member = { id: number; name: string };
type Expense = {
  id: number;
  description: string;
  amountCents: number;
  payer: Member;
  shares: { memberId: number; member: Member; amountCents: number }[];
};

export function ExpenseForm({ groupId, members }: { groupId: number; members: Member[] }) {
  return (
    <section className="panel">
      <h2>Record an expense</h2>
      {members.length === 0 ? <p>Add a member to record an expense.</p> : (
        <form action="/records" method="post" className="stack">
          <input type="hidden" name="action" value="expense" />
          <input type="hidden" name="groupId" value={groupId} />
          <label>Description<input name="description" required maxLength={200} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>Amount (USD)<input name="amount" inputMode="decimal" placeholder="0.00" required /></label>
            <label>Paid by
              <select name="payerId" defaultValue="" required>
                <option value="" disabled>Select a payer</option>
                {members.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
          </div>
          <fieldset>
            <legend>Split between</legend>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map(({ id, name }) => (
                <label className="participant" key={id}>
                  <input type="checkbox" name="participantIds" value={id} /> {name}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit">Record expense</button>
        </form>
      )}
    </section>
  );
}

export function ExpenseHistory({ expenses }: { expenses: Expense[] }) {
  return (
    <section className="panel">
      <h2>Expense history</h2>
      {expenses.length === 0 ? <p>No expenses recorded yet.</p> : (
        <ul className="divided">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div className="flex justify-between gap-3">
                <strong className="min-w-0 break-words">{expense.description}</strong>
                <strong className="tabular-nums">{money(expense.amountCents)}</strong>
              </div>
              <p className="mt-1">Paid by {expense.payer.name}</p>
              <ul className="flex flex-wrap gap-2 mt-2" aria-label="Participant shares">
                {expense.shares.map((share) => (
                  <li className="share" key={share.memberId}>{share.member.name} {money(share.amountCents)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
