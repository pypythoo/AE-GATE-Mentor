"""
╔══════════════════════════════════════════════════════════════════════════════════╗
║           GATE Aerospace Engineering AI Mentor — Flask + IBM watsonx.ai         ║
║           Powered by Granite Models | Built with ❤ for GATE AE Aspirants        ║
╚══════════════════════════════════════════════════════════════════════════════════╝

PROJECT STRUCTURE:
  app.py                  ← This file (backend + agent config)
  templates/index.html    ← Single-page frontend
  static/css/style.css    ← Custom styles
  static/js/app.js        ← Frontend logic
  .env                    ← Secrets (never commit)
  .env.example            ← Template for .env
  requirements.txt        ← Python dependencies
  README.md               ← Setup & deployment guide
"""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  AGENT INSTRUCTIONS — Customize the mentor's personality and teaching behavior
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGENT_INSTRUCTIONS = {
    # ── Teaching Style ────────────────────────────────────────────────────────
    # Change to: "Socratic" | "Lecture-based" | "Problem-first" | "Feynman"
    "teaching_style": (
        "Use the Feynman technique: explain concepts as if teaching a curious "
        "beginner first, then build up to the rigorous engineering level. "
        "Always connect abstract theory to real aerospace applications."
    ),

    # ── Response Tone ─────────────────────────────────────────────────────────
    # Change to: "strict-professor" | "peer-tutor" | "coach"
    "tone": (
        "Encouraging, patient, and enthusiastic. Celebrate small wins. Never "
        "make the student feel bad for not knowing something."
    ),

    # ── Difficulty Level ──────────────────────────────────────────────────────
    # Change to: "beginner" | "intermediate" | "advanced"
    "difficulty": (
        "Default to GATE-level difficulty. Adjust based on the student's "
        "self-reported level: Beginner -> fundamentals, "
        "Intermediate -> derivations + shortcuts, "
        "Advanced -> tricky edge-cases + previous-year analysis."
    ),

    # ── Explanation Depth ─────────────────────────────────────────────────────
    "explanation_depth": (
        "For conceptual questions: (1) intuitive analogy, "
        "(2) formal definition with governing equations, (3) GATE exam tip. "
        "For numerical problems: show every step with variable definitions, "
        "unit tracking, and a sanity-check at the end."
    ),

    # ── Study Strategy ────────────────────────────────────────────────────────
    "study_strategy": (
        "Follow spaced repetition + interleaved practice. Recommend the "
        "Pomodoro technique (25-min focus / 5-min break). Always end a topic "
        "with 2-3 self-test questions. Suggest previous year GATE questions "
        "whenever relevant."
    ),

    # ── Motivation Messages ───────────────────────────────────────────────────
    "motivation": (
        "Remind students that ISRO, DRDO, HAL, and NAL actively recruit GATE "
        "toppers. Encourage daily 15-minute revision streaks as a habit builder."
    ),

    # ── Safety / Guardrails ───────────────────────────────────────────────────
    "safety_rules": (
        "Only respond to topics related to GATE Aerospace Engineering, "
        "engineering mathematics, study planning, and related academic queries. "
        "Politely redirect off-topic requests. Always explain reasoning rather "
        "than just giving answers."
    ),

    # ── Response Formatting ───────────────────────────────────────────────────
    "formatting_rules": (
        "Use **bold** for key terms and formulas. "
        "Use numbered lists for step-by-step solutions. "
        "End every response with a Quick Tip for GATE exam strategy. "
        "Keep responses 200-400 words unless a full derivation is requested."
    ),

    # ── GATE AE Syllabus ──────────────────────────────────────────────────────
    "syllabus": {
        "Engineering Mathematics": [
            "Linear Algebra", "Calculus", "Differential Equations",
            "Fourier Series", "Laplace Transforms", "Numerical Methods",
            "Probability & Statistics", "Complex Variables",
        ],
        "Flight Mechanics": [
            "Atmosphere Models", "Airspeed & Altitude", "Gliding & Climbing",
            "Range & Endurance", "Takeoff & Landing", "Turning Flight",
            "V-n Diagrams", "Static & Dynamic Stability",
            "Longitudinal Control", "Lateral-Directional Stability",
        ],
        "Aerodynamics": [
            "Basic Fluid Mechanics", "Continuity Equation", "Euler & Bernoulli",
            "Potential Flow", "Vortex Theory", "Airfoil Nomenclature",
            "Thin Airfoil Theory", "Finite Wing Theory", "Prandtl-Lifting Line",
            "Boundary Layer Theory", "Drag & Lift", "Compressible Flow",
            "Shock Waves", "Expansion Fans", "Subsonic/Supersonic Flow",
        ],
        "Propulsion": [
            "Thermodynamics of Propulsion", "Ideal Cycle Analysis",
            "Piston Engines", "Gas Turbine Cycles", "Axial Compressors",
            "Axial Turbines", "Centrifugal Compressors", "Combustion Chambers",
            "Nozzles", "Rocket Propulsion", "Solid & Liquid Propellants",
            "Rocket Performance", "Specific Impulse",
        ],
        "Space Dynamics": [
            "Kepler's Laws", "Orbital Mechanics", "Two-Body Problem",
            "Orbital Maneuvers", "Hohmann Transfer", "Interplanetary Trajectories",
            "Atmospheric Entry", "Escape Velocity", "Satellite Orbits",
        ],
        "Aircraft Structures": [
            "Stress & Strain", "Principal Stresses", "Mohr's Circle",
            "Thin-Walled Structures", "Shear Flow", "Torsion",
            "Bending of Beams", "Buckling", "Fatigue & Fracture",
            "Composite Materials", "Structural Components",
        ],
        "Thermodynamics & Fluid Mechanics": [
            "Laws of Thermodynamics", "Entropy", "Carnot Cycle",
            "Gas Properties", "Isentropic Flow", "Normal Shocks",
            "Oblique Shocks", "Fanno & Rayleigh Flow",
            "Incompressible Flow", "Viscous Effects",
        ],
        "Control Systems": [
            "Transfer Functions", "Block Diagrams", "Signal Flow Graphs",
            "Time Response", "Stability Analysis", "Root Locus",
            "Bode Plots", "Nyquist Criterion", "PID Controllers",
            "State Space Representation", "Controllability & Observability",
        ],
    },

    # ── Safety & Content Rules ────────────────────────────────────────────────
    "safety_rules": [
        "Only answer questions related to GATE AE, Aerospace Engineering, and related academics.",
        "Do not provide answers that encourage academic dishonesty.",
        "Always provide step-by-step reasoning for numerical problems.",
        "If a question is outside scope, politely redirect to GATE AE topics.",
        "Encourage regular breaks and mental health awareness.",
        "Do not make guarantees about specific GATE ranks or scores.",
    ],

    # ── Response Formatting Rules ─────────────────────────────────────────────
    "formatting_rules": [
        "Use clear section headers with emoji for readability.",
        "Format mathematical expressions clearly using text notation.",
        "For MCQs: list options A) B) C) D) then reveal answer after |||.",
        "For numerical: show Given → Find → Formula → Calculation → Answer.",
        "Keep responses focused and actionable.",
        "End responses with an encouraging one-liner when appropriate.",
    ],
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  IMPORTS & APP INIT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import os
import datetime
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  APP INITIALIZATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "gate-ae-mentor-secret-2025")
CORS(app)

# ── watsonx.ai Configuration ──────────────────────────────────────────────────
IBM_API_KEY      = os.getenv("IBM_API_KEY")
WATSONX_URL      = os.getenv("WATSONX_URL", "https://eu-gb.ml.cloud.ibm.com")
WATSONX_PROJECT  = os.getenv("WATSONX_PROJECT_ID")
MODEL_ID         = "meta-llama/llama-3-3-70b-instruct"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  watsonx.ai CLIENT — reads credentials from .env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_model_cache: ModelInference | None = None

def get_model() -> ModelInference:
    """Return (and cache) the IBM Granite ModelInference instance."""
    global _model_cache
    if _model_cache is None:
        api_key    = os.getenv("IBM_API_KEY")
        project_id = os.getenv("WATSONX_PROJECT_ID")
        url        = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
        if not api_key or not project_id:
            raise EnvironmentError(
                "IBM_API_KEY and WATSONX_PROJECT_ID must be set in your .env file."
            )
        credentials = Credentials(url=url, api_key=api_key)
        client = APIClient(credentials)
        _model_cache = ModelInference(
            model_id=MODEL_ID,
            api_client=client,
            project_id=WATSONX_PROJECT,
            params={
                GenParams.DECODING_METHOD:  "greedy",
                GenParams.MAX_NEW_TOKENS:   2048,
                GenParams.MIN_NEW_TOKENS:   10,
                GenParams.TEMPERATURE:      0.7,
                GenParams.REPETITION_PENALTY: 1.1,
            },
        )
    return _model_cache


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SYSTEM PROMPT BUILDER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def build_system_prompt(user_profile: dict | None = None) -> str:
    ins = AGENT_INSTRUCTIONS
    syllabus_text = "\n".join(
        f"  - {subj}: {', '.join(topics)}"
        for subj, topics in ins["syllabus"].items()
    )
    safety = "\n".join(f"  - {r}" for r in ai["safety_rules"])
    formatting = "\n".join(f"  - {r}" for r in ai["formatting_rules"])

    profile_section = ""
    if user_profile:
        profile_section = f"""
📋 STUDENT PROFILE:
  Name: {user_profile.get('name', 'Student')}
  Exam Date: {user_profile.get('exam_date', 'Not set')}
  Daily Study Hours: {user_profile.get('daily_hours', 4)}
  Preparation Level: {user_profile.get('prep_level', 'Intermediate')}
  Weak Subjects: {', '.join(user_profile.get('weak_subjects', [])) or 'Not identified yet'}
  Strong Subjects: {', '.join(user_profile.get('strong_subjects', [])) or 'Not identified yet'}
  Study Goal: {user_profile.get('goal', 'Crack GATE AE with a good rank')}
"""

    return f"""You are {ai['name']}, a {ai['role']}.

{ai['persona']}

🎯 TEACHING CONFIGURATION:
  Teaching Style: {ai['teaching_style']}
  Tone: {ai['tone']}
  Explanation Depth: {ai['explanation_depth']}
  Difficulty Level: {ai['difficulty_level']}

📚 STUDY STRATEGY:
  {ai['study_strategy']}

📖 GATE AE SYLLABUS COVERAGE:
{subjects_list}
{profile_section}
⚠️ SAFETY RULES:
{safety}

📝 RESPONSE FORMATTING:
{formatting}

Always remember: You are coaching a GATE AE aspirant. Every response should move them closer to their goal.
"""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  MAIN INFERENCE FUNCTION  (called by every route)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def query_mentor(user_message: str, chat_history: list, user_profile: dict) -> str:
    """Send a message to IBM Granite and return the reply text."""
    model = get_model()
    system_prompt = build_system_prompt(user_profile)

    history_text = ""
    for turn in chat_history[-6:]:
        role    = turn.get("role", "user")
        content = turn.get("content", "")
        if role == "user":
            history_text += f"\n<|user|>\n{content}"
        else:
            history_text += f"\n<|assistant|>\n{content}"

    prompt = (
        f"<|system|>\n{system_prompt}"
        f"{history_text}"
        f"\n<|user|>\n{user_message}"
        f"\n<|assistant|>\n"
    )
    response = model.generate_text(prompt=prompt)
    return response.strip() if isinstance(response, str) else str(response)


# ═════════════════════════════════════════════════════════════════════════════
#  Quick-action prompt builders
# ═════════════════════════════════════════════════════════════════════════════
def build_study_plan_prompt(profile: dict) -> str:
    return (
        f"Generate a detailed, week-by-week GATE AE study plan for a student with "
        f"the following profile:\n"
        f"- Exam date: {profile.get('exam_date', 'in 3 months')}\n"
        f"- Daily study hours: {profile.get('daily_hours', 4)}\n"
        f"- Current level: {profile.get('level', 'Intermediate')}\n"
        f"- Weak subjects: {', '.join(profile.get('weak_subjects', ['Aerodynamics']))}\n\n"
        "Include: subject-wise time allocation, weekly milestones, revision schedule, "
        "and mock test slots. Format with clear headings and bullet points."
    )


def build_quiz_prompt(subject: str, num_questions: int, difficulty: str) -> str:
    return (
        f"Generate {num_questions} GATE-style MCQs for **{subject}** at **{difficulty}** level.\n\n"
        "For each question provide:\n"
        "1. Question statement\n"
        "2. Four options (A, B, C, D)\n"
        "3. Correct answer\n"
        "4. Detailed explanation (2–3 sentences)\n\n"
        "Use realistic numerical values where applicable. "
        "Mix conceptual and numerical questions."
    )


def build_formula_sheet_prompt(subject: str) -> str:
    return (
        f"Create a comprehensive GATE AE formula sheet for **{subject}**.\n\n"
        "Organise by sub-topics. For each formula include:\n"
        "- The formula in clear notation\n"
        "- Variable definitions\n"
        "- Units (SI)\n"
        "- One-line context / when to use it\n\n"
        "End with 3 common mistakes students make with these formulas."
    )


def build_concept_explanation_prompt(concept: str) -> str:
    return (
        f"Explain the concept of **{concept}** for GATE AE preparation.\n\n"
        "Structure your answer as:\n"
        "1. **Intuitive Analogy** (relate to everyday life)\n"
        "2. **Formal Definition** with governing equations\n"
        "3. **Derivation Outline** (key steps only)\n"
        "4. **GATE Application** — typical question types\n"
        "5. **Common Pitfalls**"
    )


# ═════════════════════════════════════════════════════════════════════════════
#  Routes
# ═════════════════════════════════════════════════════════════════════════════
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()
    chat_history = data.get("history", [])
    user_profile = data.get("profile", {})

    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    try:
        reply = query_mentor(user_message, chat_history, user_profile)
        return jsonify({"reply": reply, "timestamp": _now()})
    except Exception as exc:
        return jsonify({"error": f"AI service error: {str(exc)}"}), 500


@app.route("/api/study-plan", methods=["POST"])
def study_plan():
    profile = request.get_json(silent=True) or {}
    prompt = build_study_plan_prompt(profile)
    try:
        plan = query_mentor(prompt, [], profile)
        return jsonify({"plan": plan, "timestamp": _now()})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/quiz", methods=["POST"])
def quiz():
    data = request.get_json(silent=True) or {}
    subject = data.get("subject", "Aerodynamics")
    num_questions = min(int(data.get("num_questions", 5)), 10)
    difficulty = data.get("difficulty", "Intermediate")
    prompt = build_quiz_prompt(subject, num_questions, difficulty)
    try:
        quiz_content = query_mentor(prompt, [], {})
        return jsonify({"quiz": quiz_content, "subject": subject, "timestamp": _now()})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/formula-sheet", methods=["POST"])
def formula_sheet():
    data = request.get_json(silent=True) or {}
    subject = data.get("subject", "Aerodynamics")
    prompt = build_formula_sheet_prompt(subject)
    try:
        sheet = query_mentor(prompt, [], {})
        return jsonify({"sheet": sheet, "subject": subject, "timestamp": _now()})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/explain", methods=["POST"])
def explain_concept():
    data = request.get_json(silent=True) or {}
    concept = data.get("concept", "").strip()
    if not concept:
        return jsonify({"error": "Concept cannot be empty"}), 400
    prompt = build_concept_explanation_prompt(concept)
    try:
        explanation = query_mentor(prompt, [], {})
        return jsonify({"explanation": explanation, "concept": concept, "timestamp": _now()})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

# ── Performance Analysis ──────────────────────────────────────────────────────
@app.route("/api/analyze-performance", methods=["POST"])
def analyze_performance():
    data    = request.get_json()
    scores  = data.get("scores", {})  # {"Aerodynamics": 65, "Propulsion": 45, ...}
    profile = data.get("profile", {})
    prompt  = (
        f"Analyze this GATE AE student's quiz performance scores (out of 100): {json.dumps(scores)}\n"
        "Provide:\n"
        "1. 📊 Performance Analysis (strong vs weak areas)\n"
        "2. 🎯 Priority Improvement Areas\n"
        "3. 📚 Specific topics to focus on for each weak subject\n"
        "4. ⏱️ Recommended time redistribution\n"
        "5. 💡 Targeted practice strategy\n"
        "6. 📈 Expected improvement timeline\n"
        "Be specific, data-driven, and motivating."
    )
    try:
        response = ask_watsonx(prompt, [], profile)
        return jsonify({"analysis": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Agent Info ────────────────────────────────────────────────────────────────
@app.route("/api/agent-info")
def agent_info():
    """Return public agent configuration (no secrets)."""
    return jsonify({
        "name":        AGENT_INSTRUCTIONS["name"],
        "role":        AGENT_INSTRUCTIONS["role"],
        "subjects":    list(AGENT_INSTRUCTIONS["subjects"].keys()),
        "style":       AGENT_INSTRUCTIONS["teaching_style"],
        "tone":        AGENT_INSTRUCTIONS["tone"],
        "motivation":  AGENT_INSTRUCTIONS["motivation_messages"],
        "model":       MODEL_ID,
    })

# ── Health Check ──────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "timestamp": _now()})


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _now() -> str:
    return datetime.datetime.utcnow().isoformat() + "Z"


# ═════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    print(f"🚀  AeroMentor starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
