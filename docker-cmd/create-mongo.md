docker run -d \
  --name mktgsquad-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret123 \
  -e MONGO_INITDB_DATABASE=mktgsquad_db \
  -v mktgsquad-data:/data/db \
  --restart unless-stopped \
  mongo:7


# .env.local
MONGODB_URI=mongodb://admin:secret123@localhost:27017/mktgsquad_db?authSource=admin


# ตรวจสอบว่า container ทำงาน:
docker ps
docker logs mktgsquad-mongo


# เข้า MongoDB shell:
docker exec -it mktgsquad-mongo mongosh -u admin -p secret123 --authenticationDatabase admin