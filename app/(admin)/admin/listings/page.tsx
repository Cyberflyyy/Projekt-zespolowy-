import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Listing, Profile, Subject } from "@/types/database";
import { formatMoney } from "@/lib/utils/format";
import { toggleAdminListingAction } from "./actions";

type Row = Listing & {
  subjects: Pick<Subject, "name"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

export default async function AdminListingsPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const { data: listings } = await db
    .from("listings")
    .select("*, subjects(name), profiles:profiles!listings_tutor_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .returns<Row[]>();

  return (
    <div>
      <PageHeader eyebrow="Moderacja" title="Oferty" description={`${listings?.length ?? 0} ofert łącznie`} />

      <Table>
        <THead>
          <tr>
            <Th>Tytuł</Th>
            <Th>Korepetytor</Th>
            <Th>Przedmiot</Th>
            <Th>Cena</Th>
            <Th>Status</Th>
            <Th></Th>
          </tr>
        </THead>
        <TBody>
          {(listings ?? []).length === 0 ? (
            <tr><Td colSpan={6}><EmptyState title="Brak ofert" /></Td></tr>
          ) : (
            (listings ?? []).map((l) => (
              <Tr key={l.id}>
                <Td className="font-medium">{l.title}</Td>
                <Td>{l.profiles?.full_name ?? "—"}</Td>
                <Td>{l.subjects?.name ?? "—"}</Td>
                <Td>{formatMoney(l.price, l.currency)}</Td>
                <Td>
                  <Badge tone={l.is_active ? "green" : "neutral"}>
                    {l.is_active ? "Aktywna" : "Nieaktywna"}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <form action={toggleAdminListingAction}>
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="is_active" value={l.is_active ? "false" : "true"} />
                    <button className="notion-btn-ghost text-xs">
                      {l.is_active ? "Wyłącz" : "Włącz"}
                    </button>
                  </form>
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
