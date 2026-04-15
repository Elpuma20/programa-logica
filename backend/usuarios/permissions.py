from rest_framework import permissions

class IsDocenteOrAdmin(permissions.BasePermission):
    """
    Permite el acceso si el usuario es Docente o Administrador.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.rol in ['DOCENTE', 'ADMIN'] or request.user.is_staff
