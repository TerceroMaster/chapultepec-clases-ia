#!/bin/sh
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  OPENAI_API_KEY: "${OPENAI_API_KEY:-}",
  ELEVENLABS_AGENT_ID: "${ELEVENLABS_AGENT_ID:-agent_7001m60bmxq9f65t5djwwcx49cq3}"
};
EOF

exec nginx -g "daemon off;"
