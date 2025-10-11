from schema.schemas import QuizRequest, QuizResponse, Question, EvaluationResult
from config import client
from fastapi import HTTPException
from typing import Dict, Any
import json,re,time,math
import uuid

quizzes_db = {}

def clean_json(raw_content: str):
    """Extract valid JSON array from LLM output."""
    raw_content = re.sub(r"```(json)?", "", raw_content).strip("` \n")
    json_match = re.search(r"\[.*\]", raw_content, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
    else:
        json_str = raw_content.strip()
    return json_str


def llm_generate_questions(topic, subtopic, language, num_questions):
    """Helper to call LLM and parse questions."""
    prompt = f"""
    Generate {num_questions} quiz questions for topic '{topic}' and subtopic '{subtopic}'
    in {language}.

    Return ONLY a valid JSON array — no markdown, no explanations.

    Each object must include:
    - id (int)
    - type ("mcq" or "text")
    - question (string)
    - options (list of strings, only for MCQs)
    - correct_answer (index for MCQ, text for text)
    - explanation (string)
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000
    )

    raw_content = response.choices[0].message.content.strip()
    json_str = clean_json(raw_content)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON from LLM. Partial output: {raw_content[:300]}"
        )


def generate_quiz(request: QuizRequest) -> QuizResponse:
    """Generate quiz safely even for large num_questions."""
    try:
        batch_size = 10  
        total_batches = math.ceil(request.num_questions / batch_size)

        all_questions = []
        for batch in range(total_batches):
            remaining = request.num_questions - len(all_questions)
            num_to_generate = min(batch_size, remaining)
            batch_questions = llm_generate_questions(
                request.topic, request.subtopic, request.language, num_to_generate
            )
            for i, q in enumerate(batch_questions):
                q["id"] = len(all_questions) + i + 1
            all_questions.extend(batch_questions)
            time.sleep(0.5)
        quiz_id = f"{request.topic}_{request.subtopic}_{request.difficulty}_{str(uuid.uuid4())[:8]}"
        time_limit = request.num_questions * (
            1 if request.difficulty == "easy"
            else 2 if request.difficulty == "medium"
            else 3
        )
        description = f"Test your knowledge of {request.subtopic} in {request.topic} using {request.language}."

        quiz = QuizResponse(
            quiz_id=quiz_id,
            title=f"{request.topic}: {request.subtopic} in {request.language}",
            description=description,
            questions=[Question(**q) for q in all_questions],
            time_limit=time_limit
        )

        quizzes_db[quiz_id] = quiz
        return quiz

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")


def evaluate_quizzes_with_agent(quiz_id: str, answers: Dict[int, Any]) -> EvaluationResult:
    """Evaluate quiz answers dynamically using an LLM."""
    if quiz_id not in quizzes_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz = quizzes_db[quiz_id]
    try:
        prompt = f"""
        You are an expert teacher. Evaluate the following quiz answers.

        QUIZ QUESTIONS:
        {json.dumps([q.dict() for q in quiz.questions], indent=2)}

        USER ANSWERS:
        {json.dumps(answers, indent=2)}

        Return ONLY a valid JSON object with:
        - score (0–100)
        - correct_answers (int)
        - total_questions (int)
        - feedback (dict mapping question id → feedback string)
        - recommendations (string)
        NO extra text, explanations, or markdown formatting.
        """

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=10000
        )

        raw_output = response.choices[0].message.content.strip()
        cleaned_output = re.sub(r"^```(?:json)?|```$", "", raw_output, flags=re.MULTILINE).strip()
        json_match = re.search(r"\{[\s\S]*\}", cleaned_output)
        if not json_match:
            raise HTTPException(
                status_code=500,
                detail=f"Invalid JSON format in model response: {raw_output[:200]}"
            )

        json_str = json_match.group(0)
        try:
            result_data = json.loads(json_str)
        except json.JSONDecodeError:
            json_str = re.sub(r",\s*}", "}", json_str)
            json_str = re.sub(r",\s*]", "]", json_str)
        return EvaluationResult(**result_data)

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON parsing failed: {str(e)} | Raw: {raw_output[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating quiz: {str(e)}")