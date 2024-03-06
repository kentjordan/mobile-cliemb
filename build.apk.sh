# Gerate Keystore
keytool -genkey -v \
    -keystore cliemb-key.keystore \
    -alias cliemb \
    -keyalg RSA \
    -keysize 2048 \
    -validity 99999

# Build APK
java -jar .\bundletool-all-1.15.6.jar build-apks \
    --bundle=app.aab \
    --output=app.apks \
    --mode=universal \
    --ks=cliemb-key.keystore \
    --ks-key-alias=cliemb