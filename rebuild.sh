if [ "$1" == "client" ]; then
	echo "Rebuilding client files and restarting container..!"
    npm run build && docker stop reflections && docker rm reflections && docker build -t reflections . && docker run --name reflections --network br0 -d reflections 
elif [ "$1" == "nocontainer" ]; then
    echo "Starting new container.."
    docker build -t reflections . && docker run --name reflections --network br0 -d reflections
else
	echo "Restarting container..!"
    docker stop reflections && docker rm reflections && docker build -t reflections . && docker run --name reflections --network br0 -d reflections
fi
