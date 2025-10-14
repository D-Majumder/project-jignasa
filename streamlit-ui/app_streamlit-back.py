import streamlit as st
import requests
import pandas as pd
import json
from datetime import datetime

# --- Page Configuration ---
st.set_page_config(
    page_title="Project Jignasa 2.0",
    page_icon="🔎",
    layout="wide"
)

# --- Backend API URL ---
API_URL = "http://127.0.0.1:8080/api/query"

# --- Helper function ---
def run_query(question):
    st.session_state.messages.append({"role": "user", "content": question})
    with st.spinner("Analyzing with SIEM backend..."):
        try:
            payload = {"text": question, "sessionId": st.session_state.session_id}
            resp = requests.post(API_URL, json=payload, timeout=30)
            data = resp.json()
        except Exception as e:
            st.session_state.messages.append(
                {"role": "assistant", "content": f"⚠️ Connection error: {e}"}
            )
            return

    parsed = data.get("parsed")
    dsl = data.get("dsl")
    meta = data.get("meta")
    out = data.get("out") or {}

    summary = out.get("text") or f"Found {len(out.get('rows', []))} results."
    table = out.get("rows", [])
    aggs = out.get("agg", {})

    assistant_content = {
        "summary": summary,
        "data": table,
        "aggregations": aggs,
        "parsed": parsed,
        "dsl": dsl,
        "meta": meta,
    }
    st.session_state.messages.append({"role": "assistant", "content": assistant_content})

# --- Session init ---
if "messages" not in st.session_state:
    st.session_state.messages = []
if "session_id" not in st.session_state:
    st.session_state.session_id = f"session_{datetime.now().isoformat()}"

# --- Sidebar ---
with st.sidebar:
    st.title("Project Jignasa 2.0 🔎")
    if st.button("🧹 Clear Chat"):
        st.session_state.messages = []
        st.session_state.session_id = f"session_{datetime.now().isoformat()}"
        st.rerun()

    if st.session_state.messages:
        st.download_button(
            "💾 Export Chat",
            data=json.dumps(st.session_state.messages, indent=2),
            file_name=f"chat_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
        )

# --- Main chat ---
st.header("Ask Your SIEM Assistant")

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        if isinstance(msg["content"], dict):
            c = msg["content"]
            if c.get("summary"):
                st.markdown(c["summary"])
            if c.get("data"):
                st.dataframe(pd.DataFrame(c["data"]), use_container_width=True)
            if c.get("aggregations"):
                with st.expander("Aggregations"):
                    st.json(c["aggregations"])
            with st.expander("Technical details"):
                st.json({"parsed": c.get("parsed"), "dsl": c.get("dsl"), "meta": c.get("meta")})
        else:
            st.markdown(msg["content"])

# Example prompts
st.markdown("### Try an example:")
col1, col2, col3 = st.columns(3)
prompt = None
with col1:
    if st.button("List failed logins"): prompt = "List all failed login attempts"
with col2:
    if st.button("VPN events"): prompt = "Show VPN-related events"
with col3:
    if st.button("Malware detections"): prompt = "Show malware detections in last 7 days"

if user_input := st.chat_input("Ask a question or follow-up..."):
    prompt = user_input

if prompt:
    run_query(prompt)
    st.rerun()
