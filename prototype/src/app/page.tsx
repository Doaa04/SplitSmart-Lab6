import Link from "next/link";
import { db } from "@/lib/db";
import { calculateBalances, money, parseId } from "@/lib/expenses";
import { ExpenseForm, ExpenseHistory } from "./expense-panel";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ group?: string | string[]; error?: string | string[] }>;
}) {
  const { group: selection, error } = await searchParams;
  const groups = await db.group.findMany({ orderBy: { id: "asc" } });
  const selectedId = selection === undefined ? groups[0]?.id : parseId(selection);
  const group = selectedId ? await db.group.findUnique({
    where: { id: selectedId },
    include: {
      members: { orderBy: { id: "asc" } },
      expenses: {
        orderBy: { id: "desc" },
        include: {
          payer: true,
          shares: { orderBy: { memberId: "asc" }, include: { member: true } },
        },
      },
    },
  }) : null;
  const balances = group && calculateBalances(group.members, group.expenses);

  return (
    <>
      <header className="brand"><div className="shell">SplitSmart</div></header>
      <main className="shell py-8">
        {typeof error === "string" && <p className="notice" role="alert">{error}</p>}
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="panel self-start">
            <h2>Groups</h2>
            {groups.length > 0 && (
              <nav aria-label="Groups" className="group-list">
                {groups.map(({ id, name }) => (
                  <Link key={id} href={`/?group=${id}`} aria-current={id === group?.id ? "page" : undefined}>
                    {name}
                  </Link>
                ))}
              </nav>
            )}
            <form action="/records" method="post" className="stack">
              <input type="hidden" name="action" value="group" />
              <label>Group name<input name="name" required maxLength={80} /></label>
              <button type="submit">Create group</button>
            </form>
          </aside>

          {group && balances ? (
            <div className="space-y-6">
              <h1>{group.name}</h1>
              <div className="grid gap-6 md:grid-cols-2">
                <section className="panel">
                  <h2>Members</h2>
                  {group.members.length > 0 && (
                    <ul className="divided mb-4">
                      {group.members.map(({ id, name }) => <li key={id}>{name}</li>)}
                    </ul>
                  )}
                  <form action="/records" method="post" className="stack">
                    <input type="hidden" name="action" value="member" />
                    <input type="hidden" name="groupId" value={group.id} />
                    <label>Member name<input name="name" required maxLength={80} /></label>
                    <button type="submit">Add member</button>
                  </form>
                </section>
                <section className="panel">
                  <h2>Balances</h2>
                  {group.members.length === 0 ? <p>Balances appear when you add members.</p> : (
                    <ul className="divided">
                      {group.members.map(({ id, name }) => {
                        const balance = balances.get(id)!;
                        return (
                          <li key={id} className="flex justify-between gap-3">
                            <span className="min-w-0 break-words">{name}</span>
                            <span className="text-right">
                              <strong className="tabular-nums">{money(balance, true)}</strong>
                              <span className="balance-status">{balance > 0 ? "Should receive" : balance < 0 ? "Owes" : "Settled"}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              </div>
              <ExpenseForm groupId={group.id} members={group.members} />
              <ExpenseHistory expenses={group.expenses} />
            </div>
          ) : (
            <section className="panel self-start">
              <h1>{groups.length ? "Select a group" : "Create your first group"}</h1>
              {selection !== undefined && <p className="mt-2">The selected group could not be found.</p>}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
