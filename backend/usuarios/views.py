from rest_framework import generics, permissions
from .serializers import RegistroSerializer, MyTokenObtainPairSerializer
from .models import Usuario
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

class RegistroAPIView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class PerfilAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "nombre": user.nombre,
            "email": user.email,
            "fecha_registro": user.fecha_registro,
            "activo": user.activo,
            "rol": user.rol.nombre,
        }
        return Response(data)
