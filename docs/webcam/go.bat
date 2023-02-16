start cmd /c dotnet serve -p 55555
timeout /t 1
"C:\Program Files\Mozilla Firefox\firefox.exe" http://localhost:55555
