const Applet = imports.ui.applet;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

class TailscaleApplet extends Applet.TextIconApplet {
    constructor(metadata, orientation, panelHeight, instanceId) {
        super(orientation, panelHeight, instanceId);

        this.set_applet_label("");
        this.set_applet_tooltip("Tailscale");

        this._updateState();
        this._startTimer();
        this.appletDir = metadata.path;
    }

    on_applet_clicked() {
        this._updateState();
        Util.spawn_async( ["bash", "-c", `${this.appletDir}/tailscale-gui.sh`],
        () => {
                this._updateState();
              }
        );
    }

    _updateState() {
        Util.spawn_async(
            ["bash", "-c", "tailscale status --peers=false --json 2>/dev/null"],
            (json) => {
                if (!json || json.trim() === "") {
                    this.set_applet_icon_name("network-offline");
                    this.set_applet_tooltip("Tailscale : DOWN");
                    return;
                }

                let data;
                try {
                    data = JSON.parse(json);
                } catch (e) {
                    //this.set_applet_icon_name("network-offline");
                    let exitIcon = `${this.appletDir}/icons/network.png`;
                    this.set_applet_icon_path(exitIcon);
                    this.set_applet_tooltip("Tailscale : DOWN");
                    return;
                }

                if (data.Self && data.Self.Online === true) {
                    if (data.ExitNodeStatus) {
                        let exitIcon = `${this.appletDir}/icons/network-exit-node.png`;
                        this.set_applet_icon_path(exitIcon);
                        this.set_applet_tooltip("Tailscale : UP via Exit Node");
                    } else {
                        //this.set_applet_icon_name("network-vpn");
                        let exitIcon = `${this.appletDir}/icons/network-vpn.png`;
                        this.set_applet_icon_path(exitIcon);
                        this.set_applet_tooltip("Tailscale : UP without Exit Node");
                    }
                } else {
                    let exitIcon = `${this.appletDir}/icons/network.png`;
                    this.set_applet_icon_path(exitIcon);
                    this.set_applet_tooltip("Tailscale : DOWN");
                }
            }
        );
    }



    _startTimer() {
        // refresh state every 60s
        this._timer = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            60,
            () => {
                this._updateState();
                return true;
            }
        );
    }
}

function main(metadata, orientation, panelHeight, instanceId) {
    return new TailscaleApplet(metadata, orientation, panelHeight, instanceId);
}
