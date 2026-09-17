import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Paths setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../medical_data")
DB_PATH = os.path.join(DATA_DIR, "chroma_db")

def ingest_documents():
    print("1. Loading PDFs from allopathy & ayush folders...")
    # Load all PDFs from the parent medical_data folder
    loader = PyPDFDirectoryLoader(DATA_DIR, glob="*/*.pdf")
    docs = loader.load()
    
    if not docs:
        print("❌ Koi PDF nahi mili. Kripya medical_data folders mein PDFs daalein.")
        return

    print(f"2. Splitting {len(docs)} pages into smaller chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(docs)

    print("3. Converting to Vectors and saving to ChromaDB (Free Local)...")
    # HuggingFace ka free offline embedding model
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Save to local chroma_db folder
    Chroma.from_documents(chunks, embeddings, persist_directory=DB_PATH)
    print("✅ Data successfully saved to ChromaDB!")

if __name__ == "__main__":
    ingest_documents()