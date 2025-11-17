#!/bin/bash

echo "=== LMS Frontend Login Test ==="
echo

# Test 1: Check if frontend is serving
echo "1. Testing Frontend Accessibility..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://206.189.46.60/)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend accessible at http://206.189.46.60/"
else
    echo "❌ Frontend not accessible (Status: $FRONTEND_STATUS)"
fi

# Test 2: Check Vite dev server direct access
echo
echo "2. Testing Direct Vite Access..."
VITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://206.189.46.60:5173/)
if [ "$VITE_STATUS" = "200" ]; then
    echo "✅ Vite dev server accessible at http://206.189.46.60:5173/"
else
    echo "❌ Vite dev server not accessible (Status: $VITE_STATUS)"
fi

# Test 3: Test API endpoint from frontend's perspective
echo
echo "3. Testing API from Frontend Perspective..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://206.189.46.60/api/login)
if [ "$API_STATUS" = "405" ] || [ "$API_STATUS" = "422" ]; then
    echo "✅ API endpoint responding (Status: $API_STATUS - expects POST)"
else
    echo "⚠️  API endpoint status: $API_STATUS"
fi

# Test 4: Full login test
echo
echo "4. Testing Complete Login Flow..."
LOGIN_RESPONSE=$(curl -s -X POST http://206.189.46.60/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Origin: http://206.189.46.60" \
  -d '{"email":"admin@lms.local","password":"password"}')

if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
    echo "✅ Login successful with admin@lms.local/password"
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ROLE=$(echo "$LOGIN_RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
    
    echo "   Token: ${TOKEN:0:20}..."
    echo "   Role: $USER_ROLE"
    
    # Test protected route
    echo
    echo "5. Testing Protected Route Access..."
    PROTECTED_RESPONSE=$(curl -s -X GET http://206.189.46.60/api/user \
      -H "Accept: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Origin: http://206.189.46.60")
    
    if echo "$PROTECTED_RESPONSE" | grep -q '"name"'; then
        echo "✅ Protected routes accessible with token"
        USER_NAME=$(echo "$PROTECTED_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        echo "   User: $USER_NAME"
    else
        echo "❌ Protected route access failed"
        echo "   Response: $PROTECTED_RESPONSE"
    fi
    
else
    echo "❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi

echo
echo "=== Frontend Environment Check ==="
echo "6. Checking Frontend API Configuration..."

# Check what API URL the frontend container is using
FRONTEND_API_URL=$(docker exec lms_frontend printenv VITE_API_URL 2>/dev/null)
if [ "$FRONTEND_API_URL" = "http://206.189.46.60/api" ]; then
    echo "✅ Frontend configured with correct API URL: $FRONTEND_API_URL"
else
    echo "❌ Frontend API URL misconfigured: $FRONTEND_API_URL"
    echo "   Expected: http://206.189.46.60/api"
fi

echo
echo "=== Login Instructions ==="
echo "🌐 Open your browser and go to: http://206.189.46.60/"
echo "📝 Login Credentials:"
echo "   Email: admin@lms.local"
echo "   Password: password"
echo
echo "🔧 If login still fails in browser, check browser console for JavaScript errors"
echo "   Press F12 → Console tab to see any error messages"
echo
echo "📱 Alternative URLs to try:"
echo "   Main site: http://206.189.46.60/"
echo "   Direct Vite: http://206.189.46.60:5173/"