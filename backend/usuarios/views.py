from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegistroSerializer, LoginSerializer, UsuarioSerializer
from .models import Usuario
from auditoria.models import Bitacora

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
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UsuarioSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class RecuperarPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        correo = request.data.get('correo')
        cedula = request.data.get('cedula')
        new_password = request.data.get('new_password')

        try:
            usuario = Usuario.objects.get(correo=correo, cedula=cedula)
            usuario.set_password(new_password)
            usuario.save()
            return Response({'success': 'Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.'})
        except Usuario.DoesNotExist:
            return Response({'error': 'No se encontró un usuario con esos datos.'}, status=status.HTTP_404_NOT_FOUND)
