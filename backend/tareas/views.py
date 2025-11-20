from datetime import date
from typing import Dict, Iterable, List

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tarea, TareaCompletada, TareaEnProceso
from .serializers import TareaSerializer
from .utils import (
	es_tarea_recurrente,
	fecha_corresponde_a_tarea,
	generar_ocurrencias_en_rango,
)


class TareaViewSet(viewsets.ModelViewSet):
	serializer_class = TareaSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return (
			Tarea.objects.filter(creado_por=self.request.user, activa=True)
			.order_by('-fecha_creacion')
		)

	def perform_create(self, serializer):
		serializer.save(creado_por=self.request.user)

	@action(detail=False, methods=['get'])
	def estadisticas(self, request):
		queryset = self.get_queryset()

		pendientes = queryset.filter(estado='pendiente', repeticion='ninguna').count()
		en_proceso = queryset.filter(estado='en_proceso', repeticion='ninguna').count()
		completadas = queryset.filter(estado='completada', repeticion='ninguna').count()

		hoy = date.today()
		tareas_recurrentes = queryset.exclude(repeticion='ninguna')
		if tareas_recurrentes.exists():
			estados_recurrentes = self._mapas_estados(list(tareas_recurrentes), hoy, hoy)
			for tarea in tareas_recurrentes:
				key = (tarea.id_tarea, hoy)
				if key in estados_recurrentes['completadas']:
					completadas += 1
				elif key in estados_recurrentes['en_proceso']:
					en_proceso += 1
				else:
					pendientes += 1

		return Response(
			{
				'pendientes': pendientes,
				'en_proceso': en_proceso,
				'completadas': completadas,
				'total': queryset.count(),
			}
		)

	@action(detail=False, methods=['get'])
	def calendario(self, request):
		fecha_inicio_str = request.query_params.get('fecha_inicio')
		fecha_fin_str = request.query_params.get('fecha_fin')

		if not fecha_inicio_str or not fecha_fin_str:
			return Response(
				{'error': 'Se requieren los parámetros fecha_inicio y fecha_fin'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			fecha_inicio = date.fromisoformat(fecha_inicio_str)
			fecha_fin = date.fromisoformat(fecha_fin_str)
		except ValueError:
			return Response(
				{'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		tareas_usuario = list(self.get_queryset())
		mapas = self._mapas_estados(tareas_usuario, fecha_inicio, fecha_fin)

		instancias = self._generar_payload_ocurrencias(
			tareas_usuario, fecha_inicio, fecha_fin, mapas
		)

		tareas_normales = [
			tarea
			for tarea in tareas_usuario
			if tarea.repeticion == 'ninguna'
			and tarea.fecha_entrega
			and fecha_inicio <= tarea.fecha_entrega <= fecha_fin
		]

		instancias.sort(key=lambda item: (item['fecha_instancia'], item['tarea_id']))

		return Response(
			{
				'instancias_recurrentes': instancias,
				'tareas_normales': TareaSerializer(tareas_normales, many=True).data,
			}
		)

	@action(detail=False, methods=['get'], url_path='ocurrencias_por_fecha')
	def ocurrencias_por_fecha(self, request):
		fecha_str = request.query_params.get('fecha', date.today().isoformat())
		try:
			fecha = date.fromisoformat(fecha_str)
		except ValueError:
			return Response(
				{'error': 'Formato de fecha inválido'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		tareas_usuario = list(self.get_queryset())
		mapas = self._mapas_estados(tareas_usuario, fecha, fecha)
		instancias = self._generar_payload_ocurrencias(tareas_usuario, fecha, fecha, mapas)

		return Response(instancias)

	@action(detail=False, methods=['get'], url_path='ocurrencias_rango')
	def ocurrencias_rango(self, request):
		fecha_inicio_str = request.query_params.get('fecha_inicio', date.today().isoformat())
		fecha_fin_str = request.query_params.get('fecha_fin', date.today().isoformat())

		try:
			fecha_inicio = date.fromisoformat(fecha_inicio_str)
			fecha_fin = date.fromisoformat(fecha_fin_str)
		except ValueError:
			return Response(
				{'error': 'Formato de fecha inválido'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		if fecha_fin < fecha_inicio:
			return Response(
				{'error': 'La fecha_fin debe ser igual o posterior a fecha_inicio'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		tareas_usuario = list(self.get_queryset())
		mapas = self._mapas_estados(tareas_usuario, fecha_inicio, fecha_fin)
		instancias = self._generar_payload_ocurrencias(
			tareas_usuario, fecha_inicio, fecha_fin, mapas
		)

		instancias.sort(key=lambda item: (item['fecha_instancia'], item['tarea_id']))
		return Response(instancias)

	@action(detail=False, methods=['get'], url_path='ocurrencias_hoy')
	def ocurrencias_hoy(self, request):
		hoy = date.today()
		tareas_usuario = list(self.get_queryset())
		mapas = self._mapas_estados(tareas_usuario, hoy, hoy)
		instancias = self._generar_payload_ocurrencias(tareas_usuario, hoy, hoy, mapas)

		pendientes = [
			instancia
			for instancia in instancias
			if instancia['estado'] in {'pendiente', 'en_proceso'}
		]

		pendientes.sort(key=lambda item: (item['estado'], item['fecha_instancia']))
		return Response(pendientes)

	@action(detail=False, methods=['post'], url_path='actualizar_ocurrencia')
	def actualizar_ocurrencia(self, request):
		tarea_id = request.data.get('tarea_id')
		fecha_str = request.data.get('fecha')
		nuevo_estado = request.data.get('estado')
		notas = request.data.get('notas', '')

		if not tarea_id or not fecha_str or not nuevo_estado:
			return Response(
				{'error': 'Se requieren tarea_id, fecha y estado'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			fecha = date.fromisoformat(fecha_str)
		except ValueError:
			return Response(
				{'error': 'Formato de fecha inválido'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			tarea = self.get_queryset().get(id_tarea=tarea_id)
		except Tarea.DoesNotExist:
			return Response(
				{'error': 'Tarea no encontrada'},
				status=status.HTTP_404_NOT_FOUND,
			)

		if not fecha_corresponde_a_tarea(tarea, fecha):
			return Response(
				{'error': 'La fecha no corresponde a la recurrencia de la tarea.'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		if nuevo_estado not in {'pendiente', 'en_proceso', 'completada'}:
			return Response(
				{'error': 'Estado inválido'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		TareaCompletada.objects.filter(tarea=tarea, fecha=fecha).delete()
		TareaEnProceso.objects.filter(tarea=tarea, fecha=fecha).delete()

		if nuevo_estado == 'completada':
			TareaCompletada.objects.create(tarea=tarea, fecha=fecha, notas=notas or None)
			if tarea.repeticion == 'ninguna':
				tarea.estado = 'completada'
				tarea.save(update_fields=['estado'])
		elif nuevo_estado == 'en_proceso':
			TareaEnProceso.objects.create(tarea=tarea, fecha=fecha, notas=notas or None)
			if tarea.repeticion == 'ninguna':
				tarea.estado = 'en_proceso'
				tarea.save(update_fields=['estado'])
		else:
			if tarea.repeticion == 'ninguna':
				tarea.estado = 'pendiente'
				tarea.save(update_fields=['estado'])

		mapas = self._mapas_estados([tarea], fecha, fecha)
		ocurrencia = self._generar_payload_ocurrencias([tarea], fecha, fecha, mapas)
		respuesta = ocurrencia[0] if ocurrencia else {}

		return Response(
			{'mensaje': 'Estado de ocurrencia actualizado', 'ocurrencia': respuesta}
		)

	def _mapas_estados(
		self, tareas: List[Tarea], fecha_inicio: date, fecha_fin: date
	) -> Dict[str, Dict]:
		if not tareas:
			return {'completadas': {}, 'en_proceso': {}}

		ids = [t.id_tarea for t in tareas]

		completadas = {
			(item.tarea_id, item.fecha): item
			for item in TareaCompletada.objects.filter(
				tarea_id__in=ids, fecha__gte=fecha_inicio, fecha__lte=fecha_fin
			)
		}
		en_proceso = {
			(item.tarea_id, item.fecha): item
			for item in TareaEnProceso.objects.filter(
				tarea_id__in=ids, fecha__gte=fecha_inicio, fecha__lte=fecha_fin
			)
		}

		return {'completadas': completadas, 'en_proceso': en_proceso}

	def _generar_payload_ocurrencias(
		self,
		tareas: Iterable[Tarea],
		fecha_inicio: date,
		fecha_fin: date,
		mapas_estados: Dict[str, Dict],
	) -> List[Dict]:
		instancias: List[Dict] = []

		for tarea in tareas:
			if tarea.repeticion == 'ninguna' and tarea.fecha_entrega:
				if fecha_inicio <= tarea.fecha_entrega <= fecha_fin:
					instancias.append(
						self._serializar_ocurrencia(
							tarea,
							tarea.fecha_entrega,
							mapas_estados,
						)
					)
				continue

			if not es_tarea_recurrente(tarea):
				continue

			for fecha in generar_ocurrencias_en_rango(tarea, fecha_inicio, fecha_fin):
				instancias.append(
					self._serializar_ocurrencia(tarea, fecha, mapas_estados)
				)

		return instancias

	def _serializar_ocurrencia(
		self, tarea: Tarea, fecha: date, mapas_estados: Dict[str, Dict]
	) -> Dict:
		key = (tarea.id_tarea, fecha)
		completada = mapas_estados['completadas'].get(key)
		en_proceso = mapas_estados['en_proceso'].get(key)

		estado = 'pendiente'
		marca_tiempo = None
		notas = None

		if completada:
			estado = 'completada'
			marca_tiempo = completada.completada_en.isoformat()
			notas = completada.notas
		elif en_proceso:
			estado = 'en_proceso'
			marca_tiempo = en_proceso.iniciada_en.isoformat()
			notas = en_proceso.notas
		elif tarea.repeticion == 'ninguna':
			estado = tarea.estado

		return {
			'id_instancia': f"{tarea.id_tarea}-{fecha.isoformat()}",
			'tarea_id': tarea.id_tarea,
			'tarea_titulo': tarea.titulo,
			'tarea_descripcion': tarea.descripcion,
			'tarea_categoria': tarea.categoria,
			'tarea_repeticion': tarea.repeticion,
			'fecha_instancia': fecha.isoformat(),
			'estado': estado,
			'completada_en': marca_tiempo,
			'notas': notas,
		}
