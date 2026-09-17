import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

CURRENT_DIR = os.path.dirname(__file__)
DB_DIRECTORY = os.path.join(CURRENT_DIR, "chroma_db")

def search_medical_guidelines(query: str, k: int = 2):
    if not os.path.exists(DB_DIRECTORY):
        return "No local medical guidelines indexed yet."
    
    try:
        print("🔄 Loading embeddings and querying ChromaDB...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector_store = Chroma(persist_directory=DB_DIRECTORY, embedding_function=embeddings)
        
        results = vector_store.similarity_search(query, k=k)
        context = "\n".join([doc.page_content for doc in results])
        return context if context else "No matching guidelines found."
    except Exception as e:
        print(f"RAG search error: {e}")
        return "Error querying guidelines."