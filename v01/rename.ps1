# rename-to-ts.ps1
Get-ChildItem -Recurse -Filter *.js | Rename-Item -NewName { $_.Name -replace '\.js$', '.ts' }
Get-ChildItem -Recurse -Filter *.jsx | Rename-Item -NewName { $_.Name -replace '\.jsx$', '.tsx' }