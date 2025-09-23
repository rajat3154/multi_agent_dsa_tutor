from controllers.groq_setup import query_groq
def teacher_agent(concept:str,language:str="python",difficulty:str="beginner")->str:
      """Generate a Markdown-formatted explanation for a DSA concept using the Teacher Agent"""
      prompt=f"""
      Explain the Data Structures and Algorithms concept '{concept}' in simple terms
      Target audience : {difficulty} level
      Programming Language {language}
      Include:
      1.A clear Definition
      2.How it works
      3.A practical example with code snippet in {language}
      4.3 key points to remember
      5.Real world applications

      Format your response with clear headings for each section using Markdown.
      Use ## for main headings and ### for subheadings.
      Provide code examples in code blocks with proper syntax highlighting for {language}
      """
      try:
            response=query_groq(prompt)
            return response
      except Exception as e:
            return f"#Error generating explaination\n\nUnable to generate explaination due to :{str(e)}" 
