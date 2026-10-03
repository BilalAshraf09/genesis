#!/bin/bash
cd "/Users/bilalashraf/Documents/GitHub/genesis" || exit
echo "Adding files to git..."
git add .
echo "Committing changes..."
git commit -m "Update Genesis Living Atlas: tactical 2D map, UI Toolkit HUD, and action order rail"
echo "Pushing to remote origin main..."
git push origin main
echo "Done!"
