import { db } from "@/lib/db";
import { parseAmount, parseId, splitExpense } from "@/lib/expenses";

function redirect(groupId: number | null, error?: string) {
  const query = new URLSearchParams();
  if (groupId !== null) query.set("group", String(groupId));
  if (error) query.set("error", error);
  return new Response(null, {
    status: 303,
    headers: { Location: query.size ? `/?${query}` : "/" },
  });
}

function readText(data: FormData, key: string, limit: number) {
  const value = data.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= limit ? trimmed : null;
}

export async function POST(request: Request) {
  let groupId: number | null = null;
  try {
    if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)(;|$)/i.test(
      request.headers.get("content-type") ?? "",
    )) return redirect(null, "Submit a SplitSmart form.");

    const data = await request.formData();
    const action = data.get("action");
    if (action === "group") {
      const name = readText(data, "name", 80);
      if (!name) return redirect(null, "Enter a group name of 1 to 80 characters.");
      const group = await db.group.create({ data: { name } });
      return redirect(group.id);
    }

    groupId = parseId(data.get("groupId"));
    if (groupId === null) return redirect(null, "Select a valid group.");
    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { members: { select: { id: true } } },
    });
    if (!group) return redirect(null, "The selected group could not be found.");

    if (action === "member") {
      const name = readText(data, "name", 80);
      if (!name) return redirect(groupId, "Enter a member name of 1 to 80 characters.");
      await db.member.create({ data: { groupId, name } });
      return redirect(groupId);
    }

    if (action !== "expense") return redirect(groupId, "Choose a valid action.");
    const description = readText(data, "description", 200);
    if (!description) return redirect(groupId, "Enter an expense description of 1 to 200 characters.");

    const amountCents = parseAmount(data.get("amount"));
    if (amountCents === null) {
      return redirect(groupId, "Enter an amount from $0.01 to $21,474,836.47 with up to two decimal places.");
    }

    const memberIds = new Set(group.members.map(({ id }) => id));
    const payerId = parseId(data.get("payerId"));
    if (payerId === null || !memberIds.has(payerId)) {
      return redirect(groupId, "Choose a payer from this group.");
    }

    const participantIds = new Set<number>();
    for (const value of data.getAll("participantIds")) {
      const id = parseId(value);
      if (id === null || !memberIds.has(id)) {
        return redirect(groupId, "Every participant must belong to this group.");
      }
      if (participantIds.has(id)) return redirect(groupId, "Select each participant only once.");
      participantIds.add(id);
    }
    if (participantIds.size === 0) return redirect(groupId, "Select at least one participant.");

    await db.expense.create({
      data: {
        groupId, payerId, description, amountCents,
        shares: { create: splitExpense(amountCents, [...participantIds]) },
      },
    });
    return redirect(groupId);
  } catch (error) {
    console.error("SplitSmart could not save the record", error);
    return redirect(groupId, "The record could not be saved. Try again.");
  }
}
