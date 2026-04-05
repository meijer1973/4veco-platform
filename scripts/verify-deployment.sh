#!/bin/bash
# verify-deployment.sh — Check that GitHub Pages site is live after push.
# Usage: bash scripts/verify-deployment.sh

SITE_URL="https://meijer1973.github.io/economie-vwo4-m3/"
MAX_RETRIES=10
RETRY_DELAY=15

echo "Verifying deployment at: $SITE_URL"
echo ""

for i in $(seq 1 $MAX_RETRIES); do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
    if [ "$STATUS" = "200" ]; then
        echo "✓ Site is live (HTTP $STATUS)"
        # Verify key shared resources are accessible
        CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}shared/quiz.css")
        ENGINE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}shared/quiz-engine.js")
        UI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}shared/quiz-ui.js")

        ALL_OK=true
        if [ "$CSS_STATUS" = "200" ]; then
            echo "✓ shared/quiz.css accessible"
        else
            echo "✗ shared/quiz.css returned HTTP $CSS_STATUS"
            ALL_OK=false
        fi
        if [ "$ENGINE_STATUS" = "200" ]; then
            echo "✓ shared/quiz-engine.js accessible"
        else
            echo "✗ shared/quiz-engine.js returned HTTP $ENGINE_STATUS"
            ALL_OK=false
        fi
        if [ "$UI_STATUS" = "200" ]; then
            echo "✓ shared/quiz-ui.js accessible"
        else
            echo "✗ shared/quiz-ui.js returned HTTP $UI_STATUS"
            ALL_OK=false
        fi

        if [ "$ALL_OK" = true ]; then
            echo ""
            echo "✓ Deployment verified successfully."
            exit 0
        else
            echo ""
            echo "✗ Some shared resources are not accessible yet. Retrying..."
        fi
    else
        echo "  Attempt $i/$MAX_RETRIES — HTTP $STATUS — retrying in ${RETRY_DELAY}s..."
    fi
    sleep $RETRY_DELAY
done

echo ""
echo "✗ Deployment verification failed after $MAX_RETRIES attempts."
exit 1
