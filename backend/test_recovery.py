import os
import django
import sys
from datetime import timedelta

# Setup django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plataforma.settings')
django.setup()

from django.utils import timezone
from usuarios.models import Usuario
from rest_framework.test import APIRequestFactory
from usuarios.views import SolicitarRecuperacionView, ConfirmarRecuperacionView

def run_tests():
    print("=== TEST 1: Solicitar Recuperación (forgot-password) ===")
    email = "jose@gmail.com"
    # Ensure test user exists
    user, created = Usuario.objects.get_or_create(
        correo=email,
        defaults={"cedula": "12345678", "nombres": "Jose", "apellidos": "Test"}
    )
    # Clear any old token
    user.reset_password_token = None
    user.reset_password_expires = None
    user.save()

    factory = APIRequestFactory()
    
    # Request
    request = factory.post('/api/auth/forgot-password/', {'correo': email}, format='json')
    view = SolicitarRecuperacionView.as_view()
    response = view(request)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.data}")
    
    user.refresh_from_db()
    token = user.reset_password_token
    expires = user.reset_password_expires
    
    print(f"Generated Token in DB: {token}")
    print(f"Expiration Time: {expires}")
    
    assert token is not None, "Token was not generated"
    assert expires is not None, "Expiration was not set"
    
    # Expiration is within 15 minutes
    now = timezone.now()
    diff = expires - now
    print(f"Time difference (should be ~15 mins): {diff}")
    assert diff > timedelta(minutes=14) and diff < timedelta(minutes=16), "Expiration time is incorrect"
    
    print("\n=== TEST 2: Confirmar Recuperación (reset-password) ===")
    new_pass = "NewPassword123!"
    request = factory.post('/api/auth/reset-password/', {'token': token, 'new_password': new_pass}, format='json')
    view = ConfirmarRecuperacionView.as_view()
    response = view(request)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.data}")
    
    assert response.status_code == 200, "Password reset failed"
    
    user.refresh_from_db()
    print(f"Token after reset (should be None): {user.reset_password_token}")
    print(f"Expires after reset (should be None): {user.reset_password_expires}")
    
    assert user.reset_password_token is None, "Token was not cleared after use"
    assert user.reset_password_expires is None, "Expiration was not cleared after use"
    
    # Verify password was updated
    assert user.check_password(new_pass), "Password was not updated in user model"
    
    print("\n=== TEST 3: Re-use of token should fail ===")
    request = factory.post('/api/auth/reset-password/', {'token': token, 'new_password': "AnotherPassword"}, format='json')
    response = view(request)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.data}")
    assert response.status_code == 400, "Used token was accepted"
    
    print("\n=== TEST 4: Expired token should fail ===")
    # Setup expired token
    user.reset_password_token = "expired_token_xyz"
    user.reset_password_expires = timezone.now() - timedelta(minutes=1)
    user.save()
    
    request = factory.post('/api/auth/reset-password/', {'token': "expired_token_xyz", 'new_password': "AnotherPassword"}, format='json')
    response = view(request)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.data}")
    assert response.status_code == 400, "Expired token was accepted"
    
    user.refresh_from_db()
    assert user.reset_password_token is None, "Expired token was not cleared after failure"
    
    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
