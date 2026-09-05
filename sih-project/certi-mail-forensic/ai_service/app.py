from fastapi import FastAPI
from pydantic import BaseModel
from nlp_processor import EmailForensicAnalyzer

app = FastAPI(title="CertiMail AI Engine")
analyzer = EmailForensicAnalyzer()

class EmailPayload(BaseModel):
    raw_text: str

@app.post("/analyze")
async def analyze_email(payload: EmailPayload):
    report = analyzer.analyze(payload.raw_text)
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)