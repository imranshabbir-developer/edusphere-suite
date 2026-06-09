export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  source: "Website" | "Referral" | "Social Media" | "Event" | "Walk-in" | "Email Campaign";
  stage: LeadStage;
  score: number;
  owner: string;
  createdAt: string;
  value: number;
  notes?: string;
}

const programs = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English", "PhD Economics"];
const owners = ["Priya Sharma", "Daniel Reyes", "Alex Morgan", "Jane Doe"];
const sources: Lead["source"][] = ["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"];
const stages: LeadStage[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Ishaan", "Krishna", "Saanvi", "Ananya", "Aadhya", "Aaradhya", "Anika", "Diya", "Ira", "Myra", "Sara", "Kiara", "Liam", "Noah", "Oliver", "Elijah", "Lucas", "Mia", "Sophia", "Isabella", "Charlotte", "Amelia"];
const lastNames = ["Sharma", "Verma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Khan", "Smith", "Johnson", "Brown", "Garcia", "Miller", "Davis", "Lopez"];

function rand<T>(a: T[]) { return a[Math.floor(Math.random() * a.length)]; }

export const leads: Lead[] = Array.from({ length: 48 }).map((_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[(i * 3) % lastNames.length];
  const name = `${first} ${last}`;
  const stage = stages[i % stages.length];
  return {
    id: `LD-${1000 + i}`,
    name,
    email: `${first}.${last}`.toLowerCase() + "@example.com",
    phone: `+1 555 0${100 + i}`,
    program: programs[i % programs.length],
    source: sources[i % sources.length],
    stage,
    score: 40 + ((i * 7) % 60),
    owner: owners[i % owners.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    value: 5000 + (i % 12) * 1500,
    notes: i % 4 === 0 ? "High intent. Follow-up scheduled." : undefined,
  };
});

// silence unused warning
void rand;
