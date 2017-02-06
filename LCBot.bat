@echo off

cd /D %~dp0
echo Current Directory: %~dp0

echo Starting Discord Bot...
node main.js
PAUSE