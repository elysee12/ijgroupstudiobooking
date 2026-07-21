@echo off
echo Installing new dependencies for dashboard features...
echo.

echo Installing qrcode and pdfkit...
call npm install qrcode pdfkit

echo.
echo Installing TypeScript type definitions...
call npm install --save-dev @types/multer

echo.
echo Done! All dependencies installed.
echo.
echo Now you can start the backend server with: npm run start:dev
pause
