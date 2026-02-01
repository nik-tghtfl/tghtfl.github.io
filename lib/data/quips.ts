import { Quip, QuipResponse } from "@/types"

export const mockQuips: Quip[] = [
  {
    id: "1",
    title: "Q1 Tool Satisfaction",
    description:
      "We're evaluating our tool stack for Q2. What's working and what isn't?",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: "active",
    created_by: "admin-1",
    responses: 12,
  },
  {
    id: "2",
    title: "Remote Work Feedback",
    description: "How is the hybrid work model working for you?",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: "active",
    created_by: "admin-1",
    responses: 8,
  },
  {
    id: "3",
    title: "Office Snack Preferences",
    description: "Help us stock the kitchen with snacks you actually want!",
    created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), // 17 days ago
    deadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: "closed",
    created_by: "admin-1",
    responses: 24,
  },
]

export const mockQuipResponses: QuipResponse[] = [
  {
    id: "1",
    quip_id: "1",
    response:
      "Jira is really slowing us down. The interface is clunky and searches take forever. We should consider switching to Linear.",
    department: "Engineering",
    user_id: "user-1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    sentiment: "negative",
  },
  {
    id: "2",
    quip_id: "1",
    response:
      "Love Notion for docs! But we have too many tools that overlap. Can we consolidate?",
    department: "Product",
    user_id: "user-2",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    sentiment: "neutral",
  },
  {
    id: "3",
    quip_id: "1",
    response:
      "Figma has been amazing for collaboration. The dev mode makes handoffs so much smoother.",
    department: "Design",
    user_id: "user-3",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive",
  },
  {
    id: "4",
    quip_id: "1",
    response:
      "Our CRM is outdated and missing key integrations. It's costing us deals.",
    department: "Sales",
    user_id: "user-4",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    sentiment: "negative",
  },
  {
    id: "5",
    quip_id: "1",
    response:
      "Slack is great but we have too many channels. Information gets lost easily.",
    department: "Marketing",
    user_id: "user-5",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    sentiment: "neutral",
  },
  {
    id: "6",
    quip_id: "2",
    response:
      "Working from home 3 days a week has been perfect for my productivity and work-life balance.",
    department: "Engineering",
    user_id: "user-1",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    sentiment: "positive",
  },
  {
    id: "7",
    quip_id: "2",
    response:
      "I miss the spontaneous conversations that happen in the office. Hybrid feels isolating sometimes.",
    department: "Design",
    user_id: "user-3",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    sentiment: "negative",
  },
]
