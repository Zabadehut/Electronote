@echo off
"C:\Program Files\PostgreSQL\<version>\bin\pg_ctl.exe" -D "..\data" -l "..\logfile" start
REM start.bat
REM Démarrer PostgreSQL
cd /d %~dp0
bin\pg_ctl -D data -l logfile start
