from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from usuarios.models import Usuario, Rol
from .models import Tarea
from datetime import date, timedelta


class TareaModelTestCase(TestCase):
    def setUp(self):
        # Crear el rol de usuario
        self.rol_usuario, _ = Rol.objects.get_or_create(nombre='usuario')
        
        # Crear el usuario usando el modelo personalizado
        self.usuario = Usuario.objects.create_user(
            email='test@example.com',
            nombre='Test User',
            password='testpass123'
        )

    def test_crear_tarea(self):
        """Test para verificar que se puede crear una tarea correctamente"""
        tarea = Tarea.objects.create(
            titulo="Tarea de prueba",
            descripcion="Esta es una descripción de prueba",
            categoria="trabajo",
            estado="pendiente",
            creado_por=self.usuario
        )
        self.assertEqual(tarea.titulo, "Tarea de prueba")
        self.assertEqual(tarea.categoria, "trabajo")
        self.assertEqual(tarea.estado, "pendiente")
        self.assertEqual(tarea.creado_por, self.usuario)

    def test_tarea_sin_descripcion(self):
        """Test para verificar que una tarea puede crearse sin descripción"""
        tarea = Tarea.objects.create(
            titulo="Tarea sin descripción",
            categoria="personal",
            creado_por=self.usuario
        )
        self.assertIsNone(tarea.descripcion)

    def test_tarea_con_fecha_entrega(self):
        """Test para verificar que se puede asignar fecha de entrega"""
        fecha_futura = date.today() + timedelta(days=7)
        tarea = Tarea.objects.create(
            titulo="Tarea con fecha",
            categoria="estudio",
            fecha_entrega=fecha_futura,
            creado_por=self.usuario
        )
        self.assertEqual(tarea.fecha_entrega, fecha_futura)

    def test_tarea_con_repeticion(self):
        """Test para verificar las opciones de repetición"""
        tarea = Tarea.objects.create(
            titulo="Tarea repetitiva",
            categoria="trabajo",
            repeticion="semanal",
            creado_por=self.usuario
        )
        self.assertEqual(tarea.repeticion, "semanal")


class TareaAPITestCase(APITestCase):
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

    def test_listar_tareas(self):
        """Test para verificar que se pueden listar las tareas del usuario"""
        Tarea.objects.create(
            titulo="Tarea 1",
            categoria="trabajo",
            creado_por=self.usuario
        )
        Tarea.objects.create(
            titulo="Tarea 2",
            categoria="personal",
            creado_por=self.usuario
        )
        
        response = self.client.get('/api/tareas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_crear_tarea_via_api(self):
        """Test para verificar que se puede crear una tarea vía API"""
        data = {
            'titulo': 'Nueva tarea API',
            'descripcion': 'Descripción de la tarea',
            'categoria': 'trabajo',
            'estado': 'pendiente'
        }
        response = self.client.post('/api/tareas/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().titulo, 'Nueva tarea API')

    def test_actualizar_tarea(self):
        """Test para verificar que se puede actualizar una tarea"""
        tarea = Tarea.objects.create(
            titulo="Tarea original",
            categoria="trabajo",
            creado_por=self.usuario
        )
        
        data = {
            'titulo': 'Tarea actualizada',
            'categoria': 'personal',
            'estado': 'en_proceso'
        }
        response = self.client.patch(f'/api/tareas/{tarea.id_tarea}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        tarea.refresh_from_db()
        self.assertEqual(tarea.titulo, 'Tarea actualizada')
        self.assertEqual(tarea.estado, 'en_proceso')

    def test_eliminar_tarea(self):
        """Test para verificar que se puede eliminar una tarea"""
        tarea = Tarea.objects.create(
            titulo="Tarea a eliminar",
            categoria="trabajo",
            creado_por=self.usuario
        )
        
        response = self.client.delete(f'/api/tareas/{tarea.id_tarea}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tarea.objects.count(), 0)

    def test_estadisticas_tareas(self):
        """Test para verificar el endpoint de estadísticas"""
        Tarea.objects.create(titulo="T1", categoria="trabajo", estado="pendiente", creado_por=self.usuario)
        Tarea.objects.create(titulo="T2", categoria="trabajo", estado="pendiente", creado_por=self.usuario)
        Tarea.objects.create(titulo="T3", categoria="trabajo", estado="en_proceso", creado_por=self.usuario)
        Tarea.objects.create(titulo="T4", categoria="trabajo", estado="completada", creado_por=self.usuario)
        
        response = self.client.get('/api/tareas/estadisticas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['pendientes'], 2)
        self.assertEqual(response.data['en_proceso'], 1)
        self.assertEqual(response.data['completadas'], 1)
        self.assertEqual(response.data['total'], 4)

    def test_usuario_solo_ve_sus_tareas(self):
        """Test para verificar que un usuario solo ve sus propias tareas"""
        # Crear otro usuario
        otro_usuario = Usuario.objects.create_user(
            email='otro@example.com',
            nombre='Otro Usuario',
            password='pass123'
        )
        
        # Crear tareas para ambos usuarios
        Tarea.objects.create(titulo="Mi tarea", categoria="trabajo", creado_por=self.usuario)
        Tarea.objects.create(titulo="Tarea ajena", categoria="trabajo", creado_por=otro_usuario)
        
        # Verificar que el usuario solo ve su tarea
        response = self.client.get('/api/tareas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], 'Mi tarea')

    def test_crear_tarea_sin_autenticacion(self):
        """Test para verificar que no se puede crear tarea sin autenticación"""
        self.client.force_authenticate(user=None)
        data = {
            'titulo': 'Tarea sin auth',
            'categoria': 'trabajo'
        }
        response = self.client.post('/api/tareas/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
