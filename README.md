<h1 align="center" id="title" style="display:flex;align-items:center;justify-content:center;gap:12px;">
 🔎 <span style="font-weight:700;">Jignasa 2.0: A Conversational SIEM Assistant</span> 🔎
</h1>

<p align="center">
  <i>“Your Security Operations Center, in Plain English.”</i>
</p>

<p align="center">
  <img src="https://www.jackhenry.com/hubfs/3.21.22%20Blog%20Image.jpg" alt="Jignasa 2.0 Preview" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.25);">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-Frontend-3776AB?logo=python" alt="Python Badge">
  <img src="https://img.shields.io/badge/Streamlit-UI-FF4B4B?logo=streamlit" alt="Streamlit Badge">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs" alt="Node.js Badge">
  <img src="https://img.shields.io/badge/Elasticsearch-Database-005571?logo=elasticsearch" alt="Elasticsearch Badge">
  <img src="https://img.shields.io/badge/Docker-Deployment-2496ED?logo=docker" alt="Docker Badge">
</p>

---

<div align="center">
  <img src="https://img.shields.io/badge/⚙️_Built_with_Python,_Node.js_&_Elasticsearch_-_Intuitive_and_Powerful-black?style=for-the-badge" alt="Modern Stack Badge">
</div>

---

## 🪄 Overview

**Jignasa 2.0** redefines how security analysts interact with their SIEM (Security Information and Event Management) systems.
It’s not just a dashboard — it’s an **intelligent conversational assistant**, translating plain English questions into powerful, precise database queries.

> ✨ *Empowering security teams to find threats faster by simply asking questions, eliminating the need for complex query languages.*

---

## 🚀 Features

🗣️ **Natural Language Querying**
Ask complex security questions in plain English, like "show failed logins from VPN in the last 24 hours."

⚡ **Instant Summaries & Data Tables**
Receive immediate, human-readable summaries and structured data tables for quick analysis.

⚙️ **Transparent Query Generation**
Inspect the exact Elasticsearch DSL query generated for any question, ensuring trust and auditability for expert analysts.

🧠 **Modular NLP Core**
Flexibly switch between a fast, offline Rule-Based Engine and a powerful, cloud-based Large Language Model (LLM) Adapter.

🚀 **Containerized Deployment**
The entire backend environment (Elasticsearch & Kibana) is managed with Docker, ensuring a consistent and easy-to-deploy setup.

📊 **Automated Reporting (Future Scope)**
Generate daily security briefings or incident reports from a single conversational prompt.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------------------------|------------------------------------------------|
| 🐍 **Python & Streamlit** | Core frontend framework for the interactive UI |
| 🟩 **Node.js & TypeScript** | High-performance backend API for NLP & logic |
| 🗃️ **Elasticsearch** | The SIEM database for storing and querying logs |
| 🧠 **NLP Engine** | Dual parser system (Rule-based & OpenAI Adapter) |
| 🐳 **Docker & Docker Compose**| Containerization for the database environment |

---

## 🧑‍💻 Core Functionality

### 🗣️ The User's Question
- An analyst types a question into the Streamlit web interface.
- The frontend sends the request to the Node.js backend API.

### ⚙️ The Backend's Logic
- The API receives the text and passes it to the active NLP module (either rule-based or LLM).
- The NLP module parses the intent, entities (like IP addresses or usernames), and time ranges.
- This structured data is used to generate a precise Elasticsearch DSL query.

### 📊 The Data's Response
- The DSL query is executed against the Elasticsearch cluster.
- The raw results are formatted into a summary, table, and aggregations, then sent back to the Streamlit UI for display.

---

## 🚀 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/project-jignasa-2.0.git](https://github.com/your-username/project-jignasa-2.0.git)
    cd project-jignasa-2.0
    ```

2.  **Start Backend Services (Database)**
    _This requires Docker Desktop to be running._
    ```bash
    # This will start Elasticsearch and Kibana in the background
    docker-compose up -d
    ```

3.  **Run the Backend Server**
    _Open a new terminal window._
    ```bash
    cd node-backend
    npm install
    npm run start
    ```
    _The backend will be running on `http://localhost:8080`._

4.  **Run the Frontend Application**
    _Open a third terminal window._
    ```bash
    cd streamlit-ui
    # Create a virtual environment (only needed once)
    python -m venv venv
    # Activate the environment (use `source venv/bin/activate` on Mac/Linux)
    .\venv\Scripts\activate
    # Install dependencies
    pip install -r requirements.txt
    # Run the app
    streamlit run app_streamlit.py
    ```

---

## 🧩 Customization Tips

- **Switch NLP Engine**: In the `node-backend/.env` file, set or remove the `OPENAI_API_KEY` variable to toggle between the LLM adapter and the default rule-based engine.
- **Add New Rules**: Modify `node-backend/src/nlp/ruleParser.ts` to add new keywords and map them to event types.
- **Connect to a Real Cluster**: Update the `ELASTIC_URL` and `ELASTIC_API_KEY` in `node-backend/.env` to point to your production Elasticsearch cluster.
- **Adjust Frontend**: Modify `streamlit-ui/app_streamlit.py` to change the user interface, add new charts, or adjust the layout.

---

### 🧠 Example Parser Snippet
Here's a look at the core logic from the simple rule-based parser:

```typescript
// From src/nlp/ruleParser.ts

const KEYWORDS: Record<string, string> = {
  "failed login": "failed_login",
  "malware": "malware",
  "vpn": "vpn",
};

// ... inside the parse method
for (const k of Object.keys(KEYWORDS)) {
  if (lowered.includes(k)) {
    entities.event = KEYWORDS[k];
    break;
  }
}
```

---

## 📜 License

This project is released under the **MIT License** — free to use, modify, and share.  
See the `LICENSE.md` file for details.

---

👤 Author
<p align="center">
  <a href="mailto:dhrubamajumder@proton.me" target="_blank">
    <img src="https://img.shields.io/badge/Email-Dhruba%20Majumder-blue?logo=gmail" alt="Email Badge">
  </a>
  <a href="https://www.linkedin.com/in/iamdhrubamajumder/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Dhruba%20Majumder-blue?logo=linkedin" alt="LinkedIn Badge">
  </a>
  <a href="https://github.com/D-Majumder" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-D--Majumder-black?logo=github" alt="GitHub Badge">
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=00BFA6&height=100&section=footer&text=Empowering%20analysts,%20one%20query%20at%20a%20time.&fontSize=22&fontColor=ffffff&animation=fadeIn" />
</p>

<div align="center">
<img src="https://img.shields.io/badge/🚀_Crafted_for_Smart_India_Hackathon_2025-Innovative_&_Impactful-black?style=for-the-badge" alt="Pure Tech Badge">
</div>
