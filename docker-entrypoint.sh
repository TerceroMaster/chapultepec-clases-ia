#!/bin/sh
CLEAN_OPENAI_KEY=$(printf '%s' "${OPENAI_API_KEY:-}" | tr -d ' \t\r\n')
CLEAN_ELEVEN_ID=$(printf '%s' "${ELEVENLABS_AGENT_ID:-}" | tr -d ' \t\r\n')

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  OPENAI_API_KEY: "${CLEAN_OPENAI_KEY}",
  ELEVENLABS_AGENT_ID: "${CLEAN_ELEVEN_ID}"
};
EOF

exec nginx -g "daemon off;"
