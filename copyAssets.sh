#!/usr/bin/env bash
rm -f ./src/main/webapp/assetPacks/desktop/sounds/*.*;
rm -f ./src/main/webapp/assetPacks/mobile/sounds/*.*;
rm -f ./src/main/webapp/assetPacks/tablet/sounds/*.*;

rm -f ./src/main/webapp/assetPacks/desktop/splash/*.*;
rm -f ./src/main/webapp/assetPacks/mobile/splash/*.*;
rm -f ./src/main/webapp/assetPacks/tablet/splash/*.*;

rm -f ./src/main/webapp/assetPacks/desktop/spine/*.*;
rm -f ./src/main/webapp/assetPacks/mobile/spine/*.*;
rm -f ./src/main/webapp/assetPacks/tablet/spine/*.*;

rm -f ./src/main/webapp/assetPacks/desktop/fonts/*.*;
rm -f ./src/main/webapp/assetPacks/mobile/fonts/*.*;
rm -f ./src/main/webapp/assetPacks/tablet/fonts/*.*;

cp -f ./src/audio/*.json ./src/main/webapp/assetPacks/desktop/sounds;
cp -f ./src/audio/*.ogg ./src/main/webapp/assetPacks/desktop/sounds;
cp -f ./src/audio/*.m4a ./src/main/webapp/assetPacks/desktop/sounds;
cp -f ./src/audio/*.mp3 ./src/main/webapp/assetPacks/desktop/sounds;
cp -f ./src/audio/*.json ./src/main/webapp/assetPacks/mobile/sounds;
cp -f ./src/audio/*.ogg ./src/main/webapp/assetPacks/mobile/sounds;
cp -f ./src/audio/*.m4a ./src/main/webapp/assetPacks/mobile/sounds;
cp -f ./src/audio/*.mp3 ./src/main/webapp/assetPacks/mobile/sounds;
cp -f ./src/audio/*.json ./src/main/webapp/assetPacks/tablet/sounds;
cp -f ./src/audio/*.ogg ./src/main/webapp/assetPacks/tablet/sounds;
cp -f ./src/audio/*.m4a ./src/main/webapp/assetPacks/tablet/sounds;
cp -f ./src/audio/*.mp3 ./src/main/webapp/assetPacks/tablet/sounds;

cp -f ./src/main/webapp/assetPacks/mobile/sounds/*.*;
cp -f ./src/main/webapp/assetPacks/tablet/sounds/*.*;

cp -f ./src/art/splash/loaderImage.png ./src/main/webapp/assetPacks/desktop/splash/loaderImage.png;
cp -f ./src/art/splash/loaderImage.png ./src/main/webapp/assetPacks/mobile/splash/loaderImage.png;
cp -f ./src/art/splash/loaderImage.png ./src/main/webapp/assetPacks/tablet/splash/loaderImage.png;

cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/desktop/splash/landscape_background.png;
cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/mobile/splash/landscape_background.png;
cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/tablet/splash/landscape_background.png;
cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/desktop/images/landscape_background.png;
cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/mobile/images/landscape_background.png;
cp -f ./src/art/splash/landscape_background.png ./src/main/webapp/assetPacks/tablet/images/landscape_background.png;

cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/desktop/splash/portrait_background.png;
cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/mobile/splash/portrait_background.png;
cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/tablet/splash/portrait_background.png;
cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/desktop/images/portrait_background.png;
cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/mobile/images/portrait_background.png;
cp -f ./src/art/splash/portrait_background.png ./src/main/webapp/assetPacks/tablet/images/portrait_background.png;


cp -f ./src/art/spine/*.* ./src/main/webapp/assetPacks/desktop/spine;
cp -f ./src/art/spine/*.* ./src/main/webapp/assetPacks/mobile/spine;
cp -f ./src/art/spine/*.* ./src/main/webapp/assetPacks/tablet/spine;

cp -f ./src/art/fonts/*.* ./src/main/webapp/assetPacks/desktop/fonts;
cp -f ./src/art/fonts/*.* ./src/main/webapp/assetPacks/mobile/fonts;
cp -f ./src/art/fonts/*.* ./src/main/webapp/assetPacks/tablet/fonts;

for x in src/art/i18n/spine/*/**; 
do 
    str=$x;
    dir=src/main/webapp/i18n/${str:19}/assetPacks/;
    mkdir -p ${dir}desktop/spine;
    mkdir -p ${dir}mobile/spine;
    mkdir -p ${dir}tablet/spine;
    cp -fr $x/* ${dir}desktop/spine;
    cp -fr $x/* ${dir}mobile/spine;
    cp -fr $x/* ${dir}tablet/spine;
done

for x in src/art/i18n/splash/*/**;
do 
    str=$x;
    dir=src/main/webapp/i18n/${str:19}/assetPacks/;
    mkdir -p ${dir}desktop/splash;
    mkdir -p ${dir}mobile/splash;
    mkdir -p ${dir}tablet/splash;
    cp -f $x/* ${dir}desktop/splash;
    cp -f $x/* ${dir}mobile/splash;
    cp -f $x/* ${dir}tablet/splash;
done

#uncomment to OVERWRITE all locale configs and game.jsons
for x in src/main/webapp/i18n/*/**;
do
    if [[ $x != src/main/webapp/i18n/default/default ]]; 
    then
        while true;
        do
            read -p "overwrite $x/config.json?" yn
            case $yn in
                [Yy]* ) cp src/main/webapp/i18n/default/default/config.json $x/config.json; break;;
                [Nn]* ) break;;
                [Cc]* ) exit;;
                * ) echo "Please answer yes, no, or cancel.";;
            esac
        done
        while true;
        do
            read -p "overwrite $x/game.json?" yn
            case $yn in
                [Yy]* ) cp src/main/webapp/i18n/default/default/game.json $x/game.json; break;;
                [Nn]* ) break;;
                [Cc]* ) exit;;
                * ) echo "Please answer yes, no, or cancel.";;
            esac
        done
        while true;
        do
            read -p "overwrite $x/splash.json?" yn
            case $yn in
                [Yy]* ) cp src/main/webapp/i18n/default/default/splash.json $x/splash.json; break;;
                [Nn]* ) break;;
                [Cc]* ) exit;;
                * ) echo "Please answer yes, no, or cancel.";;
            esac
        done
    fi
done