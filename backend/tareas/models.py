from django.db import models
from django.utils import timezone
from usuarios.models import Usuario


class Tarea(models.Model):
    CATEGORIA_CHOICES = [
        ('trabajo', 'Trabajo'),
        ('estudio', 'Estudio'),
        ('personal', 'Personal'),
    ]

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En Proceso'),
        ('completada', 'Completada'),
    ]

    REPETICION_CHOICES = [
        ('ninguna', 'No repetir'),
        ('diaria', 'Cada día'),
        ('semanal', 'Cada semana'),
        ('mensual', 'Cada mes'),
        ('personalizada', 'Personalizada'),
    ]

    id_tarea = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateField(blank=True, null=True)
    repeticion = models.CharField(max_length=20, choices=REPETICION_CHOICES, default='ninguna')
    intervalo_repeticion = models.PositiveIntegerField(default=1)
    fecha_fin_repeticion = models.DateField(blank=True, null=True)
    activa = models.BooleanField(default=True)
    creado_por = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        related_name='tareas_creadas',
        db_column='creado_por',
    )

    class Meta:
        db_table = 'tareas'

    def __str__(self):
        return self.titulo


class TareaCompletada(models.Model):
    id = models.AutoField(primary_key=True)
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='ocurrencias_completadas')
    fecha = models.DateField()
    completada_en = models.DateTimeField(default=timezone.now)
    notas = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tareas_completadas'
        unique_together = ('tarea', 'fecha')
        ordering = ['-completada_en']

    def __str__(self):
        return f"{self.tarea.titulo} completada el {self.fecha}"


class TareaEnProceso(models.Model):
    id = models.AutoField(primary_key=True)
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='ocurrencias_en_proceso')
    fecha = models.DateField()
    iniciada_en = models.DateTimeField(default=timezone.now)
    notas = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tareas_en_proceso'
        unique_together = ('tarea', 'fecha')
        ordering = ['-iniciada_en']

    def __str__(self):
        return f"{self.tarea.titulo} en proceso el {self.fecha}"
