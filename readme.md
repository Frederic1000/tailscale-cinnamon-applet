# Tailscale Cinnamon applet

This applet allows seeing Tailscale state in the Cinnamon taskbar.

States are: down, up, up with exit node.

The user can change state from the applet.

The exit not is to be declared in the .env file.

## Installation in Linux Mint Cinnamon

1. Install the depedencies
sudo apt install yad jq

2. Copy the applet files in:  
```/usr/share/cinnamon/applets/tailscale@$USER```  
Or, if you want an installation for the current user only, in:  
```$HOME/.local/share/cinnamon/applets/tailscale@$USER```

3. Edit the .env file:  
```EXITNODE=name-of-your-tailscale-exit-node-machine```

4. Restart Cinnamon:  
Alt+F2 -> enter the command: r

5. Add the applet in the taskbar:  
Right click on the taskbar -> Applets
