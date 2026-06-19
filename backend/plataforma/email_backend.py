import requests
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

class ResendEmailBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        if not email_messages:
            return 0
        
        sent_count = 0
        api_key = getattr(settings, 'RESEND_API_KEY', '')
        
        if not api_key:
            print("Warning: RESEND_API_KEY is not configured in settings.py")
            return 0
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        for message in email_messages:
            # Extract HTML alternative if present
            html_content = ""
            if hasattr(message, 'alternatives') and message.alternatives:
                for alt_content, alt_mime in message.alternatives:
                    if alt_mime == 'text/html':
                        html_content = alt_content
                        break
            
            # Resend onboarding domain default email: onboarding@resend.dev
            # Note: If from_email is using a custom domain but not verified yet in Resend,
            # we should fallback or let it try onboarding@resend.dev
            from_email = message.from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', 'onboarding@resend.dev')
            
            # If the user is using the free onboarding plan, the sender MUST be onboarding@resend.dev
            # We can check if the domain is verified or just keep it dynamic.
            # Usually Resend allows onboarding@resend.dev for unverified testing.
            if "onboarding@resend.dev" in from_email or "example.com" in from_email or "gmail.com" in from_email:
                # Gmail or default domains are not allowed as sender domains on Resend unless verified,
                # so we force onboarding@resend.dev for testing.
                from_email = "onboarding@resend.dev"
            
            payload = {
                "from": from_email,
                "to": message.to,
                "subject": message.subject,
                "text": message.body,
            }
            if html_content:
                payload["html"] = html_content
                
            try:
                response = requests.post(
                    "https://api.resend.com/emails",
                    headers=headers,
                    json=payload,
                    timeout=10
                )
                if response.status_code in [200, 201]:
                    sent_count += 1
                else:
                    print(f"Resend HTTP error: {response.status_code} - {response.text}")
            except Exception as e:
                print(f"Exception sending via Resend API: {e}")
                
        return sent_count
