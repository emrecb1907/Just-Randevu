import type { Appointment, StaffMemberWithProfile } from "@/lib/app-data";
import { cn } from "@/lib/utils";

const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

export function StaffDensityBoard({
  appointments,
  staffMembers,
}: {
  appointments: Appointment[];
  staffMembers: StaffMemberWithProfile[];
}) {
  const visibleStaff = staffMembers.slice(0, Math.max(1, staffMembers.length));
  const gridTemplateColumns = `88px repeat(${Math.max(visibleStaff.length, 1)}, minmax(140px, 1fr))`;

  return (
    <section className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-panel">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Admin Doluluk Görünümü</h2>
        <p className="text-sm text-muted-foreground">
          Seçilen gün için soldan sağa personeller, yukarıdan aşağı saatler.
        </p>
      </div>
      {staffMembers.length === 0 ? (
        <div className="p-4 text-sm text-muted-foreground">
          Bu işletmede aktif personel bulunmuyor.
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns }}
          >
            <div className="border-r border-border p-3 text-xs text-muted-foreground">
              Saat
            </div>
            {visibleStaff.map((staff) => (
              <div
                key={staff.id}
                className="border-r border-border p-3 last:border-r-0"
              >
                <p className="text-sm font-semibold">{staff.name}</p>
                <p className="text-xs text-muted-foreground">{staff.branch}</p>
              </div>
            ))}
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-border last:border-b-0"
              style={{ gridTemplateColumns }}
            >
              <div className="border-r border-border p-3 text-xs text-muted-foreground">
                {hour}
              </div>
              {visibleStaff.map((staff) => {
                const match = appointments.find(
                  (appointment) =>
                    appointment.staffId === staff.id &&
                    appointment.start === hour,
                );
                return (
                  <div
                    key={staff.id}
                    className="min-h-16 border-r border-border p-2 last:border-r-0"
                  >
                    {match ? (
                      <div
                        className={cn(
                          "rounded-2xl border border-primary/20 bg-primary/10 p-2 text-xs text-primary",
                          match.status === "tamamlandı" &&
                            "border-accent bg-accent/15 text-foreground",
                        )}
                      >
                        <p className="font-semibold">{match.customer}</p>
                        <p>{match.service}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
