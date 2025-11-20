from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from usuarios.models import Usuario, Rol


class AsignacionesTestCase(TestCase):
    def setUp(self):
        # Crear el rol de usuario
        self.rol_usuario, _ = Rol.objects.get_or_create(nombre='usuario')
        
        # Crear el usuario usando el modelo personalizado
        self.usuario = Usuario.objects.create_user(
            email='test@example.com',
            nombre='Test User',
            password='testpass123'
        )

    def test_placeholder(self):
        """Test placeholder para asignaciones - implementar cuando se cree el modelo"""
        self.assertTrue(True)


class AsignacionesAPITestCase(APITestCase):
    def setUp(self):
        # Crear el rol de usuario
        self.rol_usuario, _ = Rol.objects.get_or_create(nombre='usuario')
        
        # Crear el usuario usando el modelo personalizado
        self.usuario = Usuario.objects.create_user(
            email='test@example.com',
            nombre='Test User',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.usuario)

    def test_placeholder_api(self):
        """Test placeholder API para asignaciones - implementar cuando se defina el endpoint"""
        self.assertTrue(True)
