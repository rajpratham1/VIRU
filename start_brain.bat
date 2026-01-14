@echo off
set OLLAMA_PATH="%USERPROFILE%\AppData\Local\Programs\Ollama\ollama.exe"

echo ==========================================
echo       VIRU NEURAL CORE (OLLAMA)
echo ==========================================

if not exist %OLLAMA_PATH% (
    echo [ERROR] Could not find Ollama at %OLLAMA_PATH%
    echo Please install Ollama from https://ollama.com
    pause
    exit /b
)

echo [1/3] Starting Inference Server...
start "" %OLLAMA_PATH% serve

echo [2/3] Checking Model (Mistral)...
%OLLAMA_PATH% list

echo [3/3] Loading Neural Network...
echo (This might take a while if downloading for the first time ~4GB)
%OLLAMA_PATH% run mistral

pause
