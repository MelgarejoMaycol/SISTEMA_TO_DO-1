from rest_framework import serializers
from .models import Usuario, Rol
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ('id', 'nombre', 'email', 'password', 'fecha_registro', 'activo')
        read_only_fields = ('id', 'fecha_registro', 'activo')

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Asignar rol 'usuario' por defecto
        rol_usuario, _ = Rol.objects.get_or_create(nombre='usuario')
        validated_data['rol'] = rol_usuario
        
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Añadimos información extra al token
        token['email'] = user.email
        token['nombre'] = user.nombre
        token['rol'] = user.rol.nombre
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['nombre'] = self.user.nombre
        data['email'] = self.user.email
        data['rol'] = self.user.rol.nombre
        return data

