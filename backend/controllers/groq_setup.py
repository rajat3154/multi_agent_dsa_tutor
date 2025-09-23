import logging
from config import client,GROQ_MODEL
def query_groq(prompt:str):
      if not client:
            raise Exception("GROQ client not initialized.Check your API Key")
      try:
            response=client.chat.completions.create(
                  model=GROQ_MODEL,
                  messages=[{"role":"user","content":prompt}],
                  temperature=0.7,
                  max_tokens=4000
            )
            return response.choices[0].message.content
      except Exception as e:
            logging.error(f"Error querying GROQ API : {str(e)}")