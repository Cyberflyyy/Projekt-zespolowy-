import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/database";
import { formatRelative } from "@/lib/utils/format";
import { blockUserAction, unblockUserAction } from "./actions";

const ROLE_TONE = {
  student: "neutral",
  tutor: "blue",
  admin: "purple",
} as const;

export default async function AdminUsersPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const { data: users } = await db
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div>
      <PageHeader
        eyebrow="Moderacja"
        title="Użytkownicy"
        description={`${users?.length ?? 0} kont łącznie`}
      />

      <Table>
        <THead>
          <tr>
            <Th>Użytkownik</Th>
            <Th>E-mail</Th>
            <Th>Rola</Th>
            <Th>Dołączył</Th>
            <Th>Status</Th>
            <Th></Th>
          </tr>
        </THead>
        <TBody>
          {(users ?? []).length === 0 ? (
            <tr>
              <Td colSpan={6}>
                <EmptyState title="Brak użytkowników" />
              </Td>
            </tr>
          ) : (
            (users ?? []).map((u) => (
              <Tr key={u.id}>
                <Td className="font-medium">{u.full_name ?? "—"}</Td>
                <Td className="text-ink-muted text-xs">{u.email}</Td>
                <Td>
                  <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>
                </Td>
                <Td className="text-ink-muted text-xs">{formatRelative(u.created_at)}</Td>
                <Td>
                  {u.is_blocked ? (
                    <Badge tone="red">Zablokowany</Badge>
                  ) : (
                    <Badge tone="green">Aktywny</Badge>
                  )}
                </Td>
                <Td className="text-right">
                  {u.role !== "admin" && (
                    <form action={u.is_blocked ? unblockUserAction : blockUserAction}>
                      <input type="hidden" name="user_id" value={u.id} />
                      <button className="notion-btn-ghost text-xs">
                        {u.is_blocked ? "Odblokuj" : "Zablokuj"}
                      </button>
                    </form>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
