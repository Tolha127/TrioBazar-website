@echo off
echo ====================================
echo  TrioBazar Production Build Script
echo ====================================
echo.
echo This script will prepare the TrioBazar website for production deployment.
echo.

REM Navigate to client directory
cd client

REM Install or update dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo Error installing client dependencies.
  exit /b %ERRORLEVEL%
)

REM Create optimized production build
echo.
echo Creating production build...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error creating production build.
  exit /b %ERRORLEVEL%
)

REM Navigate back to root
cd ..

REM Install server dependencies
echo.
echo Installing server dependencies...
cd server
call npm install --only=production
if %ERRORLEVEL% neq 0 (
  echo Error installing server dependencies.
  exit /b %ERRORLEVEL%
)

REM Navigate back to root
cd ..

echo.
echo ====================================
echo Production build completed successfully!
echo ====================================
echo.
echo The production-ready files are located in:
echo - Client: ./client/build
echo - Server: ./server
echo.
echo Deploy these files to your production environment.
echo.
echo To start the application in production mode:
echo 1. Set the NODE_ENV environment variable to "production"
echo 2. Run "node server/server.js"
echo.

pause
