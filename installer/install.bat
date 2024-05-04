@echo off
setlocal

REM Check if Ollama, Git, and Node.js are installed
where ollama >nul 2>nul
if errorlevel 1 (
    echo Ollama is required but not installed. Please install it from https://ollama.com/download.
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo Git is required but not installed. Please install it.
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required but not installed. Please install it from https://nodejs.org/.
    exit /b 1
)

REM Prompt for configuration details
set /p BOT_TOKEN=Enter your Discord bot token:
set /p CHANNEL_ID=Enter your Discord channel ID:
set /p ADMIN_ID=Enter your Discord admin user ID:

REM Clone the repository
git clone https://github.com/LeonhardTissen/discordAIChars.git

REM Change into the directory
cd discordAIChars

REM Install dependencies
npm install

REM Create .env file and populate with provided values
echo BOT_TOKEN=%BOT_TOKEN% > .env
echo CHANNEL_ID=%CHANNEL_ID% >> .env
echo ADMIN_ID=%ADMIN_ID% >> .env

REM Prompt for the desired base model (default is dolphin-llama3)
set /p BASE_MODEL=Enter the base model (default: dolphin-llama3):
set BASE_MODEL=%BASE_MODEL:dolphin-llama3=%
set BASE_MODEL=%BASE_MODEL:-=dolphin-llama3%

REM Download the specified model using Ollama
ollama pull %BASE_MODEL%

REM Run the bot
node main

endlocal
