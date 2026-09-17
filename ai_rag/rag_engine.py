import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "../medical_data/chroma_db")

# 1. Initialize Groq Llama 3 (Fastest LLM)
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama3-70b-8192", # Llama 3 70B is best for complex medical reasoning
    temperature=0.1 # Low temperature so AI doesn't hallucinate
)

# 2. Connect to local ChromaDB
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 3. Create SIH Specific Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are ArogyaKiosk's AI Medical Engine. 
    Use the following retrieved context from official medical guidelines to assist the doctor.
    CRITICAL: Always check for cross-medicine interactions between Ayurveda and Allopathic medicines mentioned in the patient's data.
    Keep the summary short (under 100 words) and list alerts clearly.
    
    Context: {context}"""),
    ("human", "Patient Data: {patient_query}")
])

def generate_medical_summary(patient_data: str):
    """
    FastAPI endpoint se call hoga. Retrieves docs and generates summary.
    """
    # A. Find relevant pages from PDFs
    docs = retriever.invoke(patient_data)
    context_text = "\n\n".join([doc.page_content for doc in docs])
    
    # B. Ask Groq Llama 3
    chain = prompt | llm
    response = chain.invoke({
        "context": context_text,
        "patient_query": patient_data
    })
    
    return response.content