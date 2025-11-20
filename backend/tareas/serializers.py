from rest_framework import serializers

from .models import Tarea
from .utils import obtener_proxima_ocurrencia


class TareaSerializer(serializers.ModelSerializer):
	proxima_ocurrencia = serializers.SerializerMethodField()

	class Meta:
		model = Tarea
		fields = [
			'id_tarea',
			'titulo',
			'descripcion',
			'categoria',
			'estado',
			'fecha_creacion',
			'fecha_entrega',
			'repeticion',
			'intervalo_repeticion',
			'fecha_fin_repeticion',
			'activa',
			'creado_por',
			'proxima_ocurrencia',
		]
		read_only_fields = ['id_tarea', 'fecha_creacion', 'creado_por']

	def get_proxima_ocurrencia(self, obj):
		fecha = obtener_proxima_ocurrencia(obj)
		return fecha.isoformat() if fecha else None

	def validate(self, attrs):
		datos = super().validate(attrs)

		if not self.instance:
			datos['estado'] = 'pendiente'

		repeticion = datos.get('repeticion') or (self.instance.repeticion if self.instance else 'ninguna')

		if repeticion != 'ninguna':
			fecha_inicio = datos.get('fecha_entrega') or (self.instance.fecha_entrega if self.instance else None)
			intervalo = datos.get('intervalo_repeticion') or (self.instance.intervalo_repeticion if self.instance else 1)

			if not fecha_inicio:
				raise serializers.ValidationError({
					'fecha_entrega': 'Las tareas recurrentes requieren una fecha de inicio.'
				})

			if intervalo < 1:
				raise serializers.ValidationError({
					'intervalo_repeticion': 'El intervalo de repetición debe ser al menos 1.'
				})

			fecha_fin = datos.get('fecha_fin_repeticion')
			if fecha_fin and fecha_fin < fecha_inicio:
				raise serializers.ValidationError({
					'fecha_fin_repeticion': 'La fecha de fin debe ser posterior a la fecha de inicio.'
				})
		else:
			datos['intervalo_repeticion'] = datos.get('intervalo_repeticion', 1)
			datos['fecha_fin_repeticion'] = datos.get('fecha_fin_repeticion') or None

		return datos

	def create(self, validated_data):
		return super().create(validated_data)

	def update(self, instance, validated_data):
		if 'estado' in validated_data and instance.repeticion != 'ninguna':
			# El estado de tareas recurrentes se gestiona por ocurrencia individual
			validated_data.pop('estado')

		return super().update(instance, validated_data)

