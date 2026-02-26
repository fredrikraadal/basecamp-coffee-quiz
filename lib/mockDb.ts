export type MemberTier = "Trailblazer" | "Explorer" | "Summit";

export interface Member {
  id: string;
  name: string;
  tier: MemberTier;
  points: number;
  personality: string | null;
}

const members: Record<string, Member> = {
  "BC-1001": { id: "BC-1001", name: "Sarah Chen",   tier: "Explorer",    points: 280, personality: null },
  "BC-2042": { id: "BC-2042", name: "Marcus Webb",  tier: "Summit",      points: 612, personality: null },
  "BC-3317": { id: "BC-3317", name: "Priya Nair",   tier: "Trailblazer", points: 45,  personality: null },
  "BC-4891": { id: "BC-4891", name: "Jake Torres",  tier: "Explorer",    points: 334, personality: "bold-adventurer" },
  "BC-5523": { id: "BC-5523", name: "Emma Liu",     tier: "Trailblazer", points: 98,  personality: null },
};

export function getMember(id: string): Member | null {
  return members[id] ?? null;
}

export function savePersonality(id: string, personalityKey: string): Member | null {
  const member = members[id];
  if (!member) return null;
  member.personality = personalityKey;
  member.points += 25;
  return member;
}
