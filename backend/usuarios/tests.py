from django.test import TestCase
from django.contrib.auth.models import User

class UsuarioTestCase(TestCase):
    def test_crear_usuario(self):
        usuario = User.objects.create_user(username="prueba", password="1234")
        self.assertEqual(usuario.username, "prueba")
