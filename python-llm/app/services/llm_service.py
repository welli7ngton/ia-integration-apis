from os import getenv
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        load_dotenv()
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=getenv("HF_TOKEN"),
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, language: str = "en", max_chars: int = 200) -> str:
        """
        Resume um texto fornecido usando o modelo LLM e LangChain.

        Args:
            text (str): O texto a ser resumido.
            language (str): O idioma desejado para o resumo. Exemplo: "en" para inglês, "pt" para português "es" para espanhol.
            max_chars (int): quantidade de caracteres máxima no resumo.

        Returns:
            str: O resumo gerado no idioma solicitado.
        """

        prompt_template = PromptTemplate(
            input_variables=["text", "language", "max_chars"],
            template="Briefly transcribe the following text in the language {language}: {text} and with a maximum number of characters: {max_chars} without returning data about the text.",
        )

        prompt = prompt_template.format(text=text, language=language, max_chars=max_chars)

        response = self.llm.invoke(prompt)

        return response
