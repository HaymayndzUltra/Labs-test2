from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="Complete Scaffold Demo API", version="1.0.0")

security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    email: str

# Mock users for demo
users_db = [
    User(id=1, username="admin", email="admin@example.com"),
    User(id=2, username="user", email="user@example.com")
]

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Simple mock auth - in real app, validate JWT token
    if credentials.credentials != "valid-token":
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return users_db[0]

@app.get("/")
async def root():
    return {"message": "Complete Scaffold Demo API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "complete-scaffold-demo"}

@app.get("/api/v1/health")
async def health_v1():
    return {"status": "ok", "version": "v1"}

@app.get("/openapi.json")
async def get_openapi():
    return app.openapi()

@app.post("/api/v1/auth/login")
async def login(request: LoginRequest):
    if not request.username or not request.password:
        raise HTTPException(status_code=422, detail="Username and password required")
    
    # Mock validation
    if request.username == "admin" and request.password == "password":
        return {"access_token": "valid-token", "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/v1/users")
async def get_users(current_user: User = Depends(get_current_user)):
    return {"users": users_db}

@app.get("/users")
async def get_users_alt(current_user: User = Depends(get_current_user)):
    return {"users": users_db}

@app.get("/api/v1/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
