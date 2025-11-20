from django.test import TestCase
from django.contrib.auth import get_user_model

class UsuarioTestCase(TestCase):
    def test_crear_usuario(self):
        UserModel = get_user_model()
        usuario = UserModel.objects.create_user(
            email="prueba@example.com",
            nombre="Usuario Prueba",
            password="1234",
        )
        self.assertEqual(usuario.email, "prueba@example.com")
