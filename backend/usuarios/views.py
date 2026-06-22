from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegistroSerializer, LoginSerializer, UsuarioSerializer
from .models import Usuario
from auditoria.models import Bitacora
import random
import string
import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class RegistroView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generar código de verificación
            code = ''.join(random.choices(string.digits, k=6))
            user.verification_code = code
            user.is_verified = False
            user.save()
            
            # Enviar correo con formato profesional
            try:
                subject = 'Verificación de cuenta - EduLógica'
                from_email = settings.DEFAULT_FROM_EMAIL
                to = [user.correo]
                
                # Versión HTML optimizada con diseño limpio
                html_content = f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #2563eb;">Verificación de cuenta - EduLógica</h2>
                    <p>Hola {user.nombres},</p>
                    <p>Tu código de seguridad es:</p>
                    <div style="background: #f3f4f6; padding: 15px; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 10px; color: #2563eb; border: 1px solid #ddd; border-radius: 8px;">
                        {code}
                    </div>
                    <p style="margin-top: 20px; font-size: 13px; color: #666;">Si no solicitaste este código, puedes ignorar este correo.</p>
                </div>
                """
                
                text_content = strip_tags(html_content)
                
                msg = EmailMultiAlternatives(subject, text_content, from_email, to)
                msg.attach_alternative(html_content, "text/html")
                
                # Añadir prioridad para evitar filtros de spam
                msg.extra_headers['X-Priority'] = '1 (Highest)'
                msg.extra_headers['Importance'] = 'High'
                
                # Enviar en un hilo de fondo (asíncronamente) para evitar bloqueos y timeouts
                import threading
                email_thread = threading.Thread(target=msg.send, kwargs={'fail_silently': True})
                email_thread.daemon = True
                email_thread.start()
                
            except Exception as e:
                # La excepción se captura de forma segura para no interrumpir el registro del usuario
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error al iniciar el hilo de correo de verificación a {user.correo}: {e}", exc_info=True)
                import sys
                sys.stderr.write(f"[SMTP ERROR] Error enviando correo a {user.correo}: {str(e)}\n")
            
            return Response({
                'message': 'Usuario registrado. Por favor verifique su correo.',
                'user_id': user.id,
                'email': user.correo,
                'code': code
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerificarCodigoView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        code = request.data.get('code')
        
        try:
            user = Usuario.objects.get(id=user_id, verification_code=code)
            user.is_verified = True
            user.verification_code = "" # Limpiar código
            user.save()
            
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UsuarioSerializer(user).data
            }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'error': 'Código de verificación incorrecto.'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        ip = get_client_ip(request)
        
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            
            # Log Successful Login
            Bitacora.objects.create(
                usuario=user,
                accion='LOGIN',
                nivel='INFO',
                modelo='Seguridad',
                detalle=f"Acceso exitoso al sistema: {user.correo}",
                ip_address=ip
            )
            
            return Response({
                'token': token.key,
                'user': UsuarioSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        # Log Failed Login
        correo = request.data.get('correo', 'Desconocido')
        Bitacora.objects.create(
            usuario=None,
            accion='LOGIN_ERROR',
            nivel='CRITICAL',
            modelo='Seguridad',
            detalle=f"Fallo de atenticación para: {correo}",
            ip_address=ip
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioDetalleView(APIView):
    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListUsuariosView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        usuarios = Usuario.objects.all().order_by('-id')
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

class VerificarUsuarioView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
            usuario.is_verified = not usuario.is_verified
            usuario.save()
            return Response({'status': 'success', 'is_verified': usuario.is_verified})
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class EliminarUsuarioView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def delete(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
            if usuario.is_superuser:
                return Response({'error': 'No se puede eliminar a un administrador principal.'}, status=status.HTTP_403_FORBIDDEN)
            usuario.delete()
            return Response({'status': 'success', 'message': 'Usuario eliminado correctamente.'})
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class CambioPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'La contraseña actual es incorrecta.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Contraseña actualizada correctamente.'})

class SolicitarRecuperacionView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        phone_or_email = request.data.get('phone') or request.data.get('correo')
        if not phone_or_email:
            return Response({'error': 'Proporciona tu teléfono o correo.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from django.db.models import Q
            usuario = Usuario.objects.get(Q(correo__iexact=phone_or_email.strip()) | Q(telefono=phone_or_email.strip()))
            
            # Generar código numérico de 6 dígitos
            code = ''.join(random.choices(string.digits, k=6))
            usuario.reset_code = code
            usuario.reset_code_expires = timezone.now() + timedelta(minutes=10)
            usuario.save()
            
            # Enviar WhatsApp vía Twilio
            import requests
            import os
            
            TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
            TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
            TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER')
            
            if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_NUMBER:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
                
                to_number = usuario.telefono if usuario.telefono.startswith('whatsapp:') else f'whatsapp:{usuario.telefono}'
                from_number = TWILIO_WHATSAPP_NUMBER if TWILIO_WHATSAPP_NUMBER.startswith('whatsapp:') else f'whatsapp:{TWILIO_WHATSAPP_NUMBER}'
                
                payload = {
                    'From': from_number,
                    'To': to_number,
                    'Body': f'Tu código de recuperación para EduLógica es: {code}. Expira en 10 minutos.'
                }
                
                def send_whatsapp(url, payload, auth):
                    try:
                        requests.post(url, data=payload, auth=auth)
                    except Exception as e:
                        import logging
                        logger = logging.getLogger(__name__)
                        logger.error(f"Error enviando WhatsApp: {e}")
                
                import threading
                thread = threading.Thread(target=send_whatsapp, args=(url, payload, (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)))
                thread.daemon = True
                thread.start()
            else:
                import logging
                logger = logging.getLogger(__name__)
                logger.warning("Credenciales de Twilio no configuradas. El mensaje no se enviará.")
                print(f"[TEST LOCAL] Código de recuperación para {usuario.telefono}: {code}")

            return Response({'message': 'Si los datos son correctos, recibirás un mensaje de WhatsApp con el código.'}, status=status.HTTP_200_OK)
            
        except Usuario.DoesNotExist:
            return Response({'error': 'No existe un usuario registrado con este número de teléfono o correo.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            import sys
            sys.stderr.write(f"Error in SolicitarRecuperacionView: {str(e)}\n")
            return Response({'error': 'Error al procesar la solicitud.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConfirmarRecuperacionView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        phone_or_email = request.data.get('phone') or request.data.get('correo')
        code = request.data.get('code')
        new_password = request.data.get('new_password')
        
        if not phone_or_email or not code or not new_password:
            return Response({'error': 'Faltan datos obligatorios (teléfono, código, o nueva contraseña).'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            from django.db.models import Q
            usuario = Usuario.objects.get(Q(correo__iexact=phone_or_email.strip()) | Q(telefono=phone_or_email.strip()))
            
            # Validar código y expiración
            if not usuario.reset_code or usuario.reset_code != str(code).strip():
                return Response({'error': 'El código es inválido.'}, status=status.HTTP_400_BAD_REQUEST)
                
            if usuario.reset_code_expires and usuario.reset_code_expires < timezone.now():
                return Response({'error': 'El código ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Establecer contraseña
            usuario.set_password(new_password)
            usuario.reset_code = None
            usuario.reset_code_expires = None
            # Eliminar tokens anteriores por si acaso
            usuario.reset_password_token = None
            usuario.reset_password_expires = None
            usuario.save()
            
            return Response({'success': 'Tu contraseña ha sido restablecida con éxito.'}, status=status.HTTP_200_OK)
            
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado o código inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import sys
            sys.stderr.write(f"Error in ConfirmarRecuperacionView: {str(e)}\n")
            return Response({'error': 'Error al procesar la solicitud.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminEnviarResetPasswordView(APIView):
    """Permite al admin enviar un enlace de cambio de contraseña al correo del usuario."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
            token = default_token_generator.make_token(usuario)
            uid = urlsafe_base64_encode(force_bytes(usuario.pk))

            # Detectar el origen
            origin = request.headers.get('Origin')
            if not origin:
                origin = "https://edulogica.onrender.com" if not settings.DEBUG else "http://localhost:5173"

            reset_link = f"{origin}/reset-password-confirm/{uid}/{token}"

            subject = 'Cambio de contraseña solicitado - EduLógica'
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
                <h2 style="color: #2563eb; text-align: center;">Cambio de Contraseña</h2>
                <p>Hola <strong>{usuario.nombres}</strong>,</p>
                <p>Un administrador de <strong>EduLógica</strong> ha solicitado un cambio de contraseña para tu cuenta.</p>
                <p>Para establecer tu nueva contraseña, haz clic en el siguiente botón:</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="{reset_link}" style="background: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                        Cambiar Contraseña
                    </a>
                </div>
                <p style="font-size: 14px; color: #666;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                <p style="word-break: break-all; font-size: 12px; color: #2563eb; background: #f8fafc; padding: 10px; border-radius: 6px;">{reset_link}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
                <p style="font-size: 13px; color: #999; text-align: center;">Si no esperabas este correo, contacta a tu administrador.</p>
            </div>
            """

            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [usuario.correo])
            msg.attach_alternative(html_content, "text/html")
            msg.extra_headers['X-Priority'] = '1 (Highest)'
            msg.extra_headers['Importance'] = 'High'

            # Enviar de forma asíncrona para evitar timeouts en producción, pero capturando errores
            def send_async_admin_reset(message, target_email):
                try:
                    message.send(fail_silently=False)
                except Exception as ex:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Error enviando correo de cambio de contraseña admin en segundo plano a {target_email}: {ex}")
                    import sys
                    sys.stderr.write(f"[SMTP ERROR] Fallo al enviar reset admin a {target_email}: {str(ex)}\n")

            import threading
            email_thread = threading.Thread(target=send_async_admin_reset, args=(msg, usuario.correo))
            email_thread.daemon = True
            email_thread.start()

            return Response({
                'status': 'success',
                'message': f'Enlace de cambio de contraseña enviado a {usuario.correo}'
            })
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error al enviar: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
