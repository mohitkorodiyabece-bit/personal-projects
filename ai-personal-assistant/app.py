import os

import streamlit as st
from dotenv import load_dotenv
from google import genai
from google.genai import errors, types


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# STREAMLIT PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="AI Personal Assistant",
    page_icon="🤖",
    layout="centered",
)


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

# Current stable Gemini model suitable for text generation.
MODEL_NAME = "gemini-3.6-flash"


# ============================================================
# ASSISTANT MODES
# ============================================================

MODE_PROMPTS = {
    "General Assistant": (
        "You are a helpful, friendly, and knowledgeable general-purpose "
        "assistant. Answer the user's questions clearly, accurately, and "
        "concisely across any topic."
    ),

    "Career Guidance": (
        "You are an expert career guidance counselor. Help the user with "
        "career planning, resume advice, job search strategies, skill "
        "development, and career transitions. Give practical, encouraging, "
        "and specific advice."
    ),

    "Travel Planner": (
        "You are an experienced travel planner. Help the user plan trips, "
        "including destinations, itineraries, budgeting, packing tips, "
        "local attractions, transportation, and accommodation based on "
        "their preferences."
    ),

    "Interview Assistant": (
        "You are a professional interview coach. Help the user prepare "
        "for job interviews with practice questions, sample answers, "
        "constructive feedback, and strategies for behavioral, technical, "
        "and situational interviews."
    ),
}


# ============================================================
# SESSION STATE
# ============================================================

if "messages" not in st.session_state:
    st.session_state.messages = []

if "mode" not in st.session_state:
    st.session_state.mode = "General Assistant"

if "system_prompt" not in st.session_state:
    st.session_state.system_prompt = MODE_PROMPTS["General Assistant"]


# ============================================================
# MODE CHANGE HANDLER
# ============================================================

def on_mode_change():
    st.session_state.system_prompt = MODE_PROMPTS[
        st.session_state.mode
    ]


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:
    st.header("⚙️ Settings")

    st.selectbox(
        "Assistant Mode",
        options=list(MODE_PROMPTS.keys()),
        key="mode",
        on_change=on_mode_change,
    )

    st.text_area(
        "System Prompt (Personality)",
        key="system_prompt",
        height=180,
    )

    st.divider()

    if st.button(
        "Clear Chat History",
        use_container_width=True,
    ):
        st.session_state.messages = []
        st.rerun()


# ============================================================
# PAGE HEADER
# ============================================================

st.title("🤖 AI Personal Assistant")
st.caption("Powered by Google Gemini")


# ============================================================
# GET GEMINI API KEY
# ============================================================

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    st.error(
        "GEMINI_API_KEY is missing. "
        "Please add it to your .env file."
    )
    st.stop()


# ============================================================
# INITIALIZE GEMINI CLIENT
# ============================================================

try:
    client = genai.Client(api_key=api_key)

except Exception as e:
    st.error(f"Failed to initialize Gemini client: {e}")
    st.stop()


# ============================================================
# DISPLAY CHAT HISTORY
# ============================================================

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# ============================================================
# CHAT INPUT
# ============================================================

with st.form(
    key="chat_form",
    clear_on_submit=True,
):

    user_input = st.text_input(
        "Type your message:"
    )

    submitted = st.form_submit_button("Send")


# ============================================================
# PROCESS USER MESSAGE
# ============================================================

if submitted:

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

    if not user_input or not user_input.strip():

        st.warning(
            "Please enter a message before sending."
        )

    else:

        user_input = user_input.strip()

        # ----------------------------------------------------
        # Add user message to session history
        # ----------------------------------------------------

        st.session_state.messages.append(
            {
                "role": "user",
                "content": user_input,
            }
        )

        # ----------------------------------------------------
        # Convert Streamlit history to Gemini format
        # ----------------------------------------------------

        contents = []

        for message in st.session_state.messages:

            role = (
                "user"
                if message["role"] == "user"
                else "model"
            )

            contents.append(
                types.Content(
                    role=role,
                    parts=[
                        types.Part.from_text(
                            text=message["content"]
                        )
                    ],
                )
            )

        # ----------------------------------------------------
        # Send request to Gemini
        # ----------------------------------------------------

        try:

            with st.spinner("Thinking..."):

                response = client.models.generate_content(
                    model=MODEL_NAME,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=(
                            st.session_state.system_prompt
                        ),
                    ),
                )

            # ------------------------------------------------
            # Get response text
            # ------------------------------------------------

            if response and response.text:

                reply_text = response.text

            else:

                reply_text = (
                    "I could not generate a response. "
                    "Please try again."
                )

        # ----------------------------------------------------
        # Gemini API errors
        # ----------------------------------------------------

        except errors.APIError as e:

            reply_text = (
                f"API request failed: {e.message}"
            )

        # ----------------------------------------------------
        # Other unexpected errors
        # ----------------------------------------------------

        except Exception as e:

            reply_text = (
                f"An unexpected error occurred: {e}"
            )

        # ----------------------------------------------------
        # Save assistant response
        # ----------------------------------------------------

        st.session_state.messages.append(
            {
                "role": "assistant",
                "content": reply_text,
            }
        )

        # ----------------------------------------------------
        # Refresh UI
        # ----------------------------------------------------

        st.rerun()