cd /home/ec2-user # 切換到您的應用程式程式碼所在的目錄
rm -rf myapp # 刪除舊的檔案
mkdir myapp
unzip -o -q app.zip -d myapp  # 解壓縮 
# pm2 start dist/app-bundle.js # 用 pm2 執行腳本