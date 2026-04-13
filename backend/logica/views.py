from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from .models import ContenidoLogico
from .serializers import ContenidoLogicoSerializer

class VerificarTablaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Ejemplo: proposition = "p and q", values = [{"p": True, "q": True, "res": True}, ...]
        proposition = request.data.get('proposition')
        rows = request.data.get('rows') # Lista de objetos con valores y respuesta del usuario
        
        if not proposition or not rows:
            return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)
            
        results = []
        all_correct = True
        
        for row in rows:
            # Reemplazar operadores lógicos si es necesario (ej: "->" por " <= ")
            # Para este prototipo, usaremos eval de python con booleanos
            try:
                # Limpiar y preparar la expresión
                expr = proposition.replace('AND', 'and').replace('OR', 'or').replace('NOT', 'not')
                # Manejar implicación p -> q como (not p or q)
                # handle equivalence p <-> q as (p == q)
                
                # Contexto para eval
                context = {k: v for k, v in row.items() if k != 'res'}
                correct_res = eval(expr, {"__builtins__": None}, context)
                
                is_row_correct = (correct_res == row['res'])
                if not is_row_correct:
                    all_correct = False
                
                results.append({
                    "row": row,
                    "correct_res": correct_res,
                    "is_correct": is_row_correct
                })
            except Exception as e:
                return Response({"error": f"Error evaluando: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({
            "all_correct": all_correct,
            "results": results
        })

class ContenidoLogicoViewSet(viewsets.ModelViewSet):
    queryset = ContenidoLogico.objects.all().order_by('-fecha_creacion')
    serializer_class = ContenidoLogicoSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
