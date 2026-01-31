# Quippi

**Quippi cuts waste by listening to your employees.**

Quippi is an **employee intelligence gathering platform** built during the **AI Beavers Hackathon Hamburg**.  
It helps companies uncover hidden inefficiencies by collecting anonymous employee feedback, detecting recurring patterns, and turning them into actionable insights for leadership.

---

## 🚨 Problem Statement

**We kill bullshit processes.**

Most organizations are weighed down by **duplicate, outdated, or inefficient processes**.  
They slow teams down, burn money, and frustrate employees — yet leadership often doesn’t see them.

Why?
- Employees experience the pain daily but don’t have a safe way to speak up
- Feedback is scattered, ignored, or never analyzed properly
- Inefficiencies hide in plain sight across teams and departments

As a result, companies keep running the same broken processes — simply because no one connects the dots.

---

## 🚀 Elevator Pitch

Companies waste time and money because broken processes go unnoticed.  
Quippi gathers **anonymous employee feedback**, analyzes it with AI, and highlights **what’s not working and why**.

Leaders use Quippi to:
- Identify inefficient or duplicated workflows
- Reduce unnecessary spending
- Improve operational efficiency
- Make faster, better decisions based on real employee insights

---

## 🧠 What Quippi Does

- Collects **anonymous employee feedback**
- Focuses on **qualitative, free-text input**
- Uses AI to **cluster themes and detect patterns**
- Produces **management-ready summaries instead of raw data**
- Ensures **DSGVO- and Betriebsrat-compliant anonymity**

---

## 🛠️ Tech Stack & Tools

- **Claude & ChatGPT** – Planning, ideation, and structuring
- **Gemini** – Thematic analysis and AI-powered summaries
- **Cursor** – Frontend & backend development
- **Google Sheets** – Data exploration and prototyping
- **n8n** – Backend automations and workflows

---

## 🧩 Architecture (High-Level)

1. Employees submit anonymous qualitative feedback  
2. Data flows through backend automations (n8n)  
3. AI models cluster themes and summarize insights  
4. Results are visualized and exported for decision-makers  

---

## 🗺️ Product Roadmap (MoSCoW Prioritization)

### ✅ MUST HAVE

Core features required for trust, legality, and usefulness.

- **Anonymous data collection**  
  Honest feedback only works with real anonymity

- **Qualitative (free-text) questions**  
  Process problems can’t be solved with checkboxes

- **Automatic AI-based theme clustering**  
  Manual analysis does not scale

- **Multilingual analysis**  
  Employees have different language skills

- **Clear AI-generated summaries per theme**  
  Management needs clarity, not raw data

- **Visualized theme analysis**  
  Improves understanding and management buy-in

- **Anonymous example quotes per theme**  
  Builds trust and transparency

- **Access to anonymized raw data**  
  Enables verification and credibility

- **Minimum response threshold**  
  Required for DSGVO and Betriebsrat compliance

- **K-Anonymity**  
  Ensures individuals cannot be identified, even indirectly

- **Role- and access-based permissions**  
  Required for larger and enterprise organizations

- **EU / Germany-based hosting**  
  Mandatory for many companies (e.g. automotive industry)

- **Exports**
  - PDF
  - CSV
  - Excel  
  For internal sharing and documentation

---

### 🟢 SHOULD HAVE

Important for adoption, scalability, and enterprise readiness.

- Survey templates for efficiency & process analysis
- Evaluation by department / location
- Before / after comparisons over time
- Manual editing of AI-generated themes
- Aggregated sentiment per theme (for prioritization)
- Works council (Betriebsrat) information package
- Employee onboarding & participation info package
- Import of existing survey data
- Integrations into existing enterprise systems

---

### 🟡 COULD HAVE

Nice-to-have features that extend the platform.

- Integration with process mining tools
- AI-generated action recommendations
- Slack / MS Teams integrations
- Action & task tracking for follow-up measures

---

### 🚫 WILL NOT HAVE

Explicitly out of scope by design.

- **Person-level analytics**  
  Violates anonymity principles and would be blocked by works councils

- **Real-time monitoring**  
  Feels like surveillance and undermines trust

---

## 👥 Team

**Team Lead**  
- Niklas Knezevic — [nik@taughtful.com](mailto:nik@taughtful.com)

Trivia & background:
- Creative Director
- A big Swiftie
- Has a "Platinum" trophy in Overcooked 2
- Experience with AI: Regular user of Claude incl. "Projects", Perplexity, Canva


**Team Member**  
- Phil Karg — [phil@taughtful.com](mailto:phil@taughtful.com)
- Project Manager for a SaaS company in e-learning

Trivia & background:
- Is in the market for an ExCel tattoo
- Learns Bhahasa Malay
- Experience with AI: Building customGPTs incl. Make.com automations - last undertaking, passing Clickup tasks to Slack channels
- Regularly uses the Google Suite/Workspace, ChatGPT (wants to drop it for Gemini), Miro, Make.com (N8N looks interesting, but I don't have a paid plan)

In short, we are non-technical, but are taking part to challenge ourselves and get as far as we can get.

---

## 🏁 Hackathon Context

- **Event:** AI Beavers Hackathon Hamburg  
- **Status:** Hackathon MVP / Proof of Concept  

---

## 📄 License

Created as part of a hackathon project.  
License to be defined.

---

## 🙌 Acknowledgements

A resounding Dankeschön to the AI Beavers Hackathon Hamburg organizers and sponsors for this event!
