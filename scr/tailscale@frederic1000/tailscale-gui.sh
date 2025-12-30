#!/bin/bash
#!/bin/bash

# get Tailscale exit node from .env file
cd "$(dirname "$0")"
source .env

# Detect Tailscale state: UP or DOWN
if tailscale status >/dev/null 2>&1; then
    # Detect exit node
    if tailscale status --peers=false --json | grep ExitNodeStatus>/dev/null 2>&1; then
        STATE="🟢 Tailscale is UP with Exit Node"
    else
        STATE="🟠️ Tailscale is UP without Exit Node"
    fi
else
    STATE="🔴 Tailscale is DOWN"
fi

# Check that Tailscale is installed
if ! command -v tailscale >/dev/null 2>&1; then
    yad --error --text="Tailscale is not installed."
    exit 1
fi

ACTION=$(yad --width=300 --height=110 \
    --title="Tailscale GUI" \
    --text="$STATE\n\nChose an action" \
    --button="Run Tailscale without exit node":1 \
    --button="Run via Exit Node $EXITNODE":2 \
    --button="Stop Tailscale":3 \
    --button="Exit":0 \
    )

case $? in
    1)
        pkexec tailscale up --reset --accept-routes
        ;;
    2)
        pkexec tailscale up --exit-node="$EXITNODE" --exit-node-allow-lan-access=true --accept-routes
        ;;
    3)
        pkexec tailscale down
        ;;
    *)
        exit 0
        ;;
esac
