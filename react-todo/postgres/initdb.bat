@echo off
"C:\Program Files\PostgreSQL\<version>\bin\initdb.exe" -D "..\data"
REM initdb.bat
REM Initialisation de PostgreSQL
cd /d %~dp0

REM Initialiser la base de données
bin\initdb -D data
