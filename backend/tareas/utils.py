from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterable, Optional

from dateutil.relativedelta import relativedelta

from .models import Tarea


MAX_OCCURRENCIAS_SEGURIDAD = 1000


@dataclass(frozen=True)
class Ocurrencia:
    tarea: Tarea
    fecha: date


def es_tarea_recurrente(tarea: Tarea) -> bool:
    return tarea.repeticion != 'ninguna'


def obtener_siguiente_fecha(tarea: Tarea, fecha_actual: date) -> Optional[date]:
    intervalo = tarea.intervalo_repeticion or 1

    if tarea.repeticion == 'diaria':
        return fecha_actual + timedelta(days=intervalo)
    if tarea.repeticion == 'semanal':
        return fecha_actual + timedelta(weeks=intervalo)
    if tarea.repeticion == 'mensual':
        return fecha_actual + relativedelta(months=intervalo)
    if tarea.repeticion == 'personalizada':
        return fecha_actual + timedelta(days=intervalo)

    return None


def generar_ocurrencias_en_rango(
    tarea: Tarea,
    fecha_inicio: date,
    fecha_fin: date,
) -> Iterable[date]:
    """Genera las fechas de ocurrencia de una tarea entre dos fechas inclusive."""
    if not tarea.fecha_entrega:
        return []

    limite_superior = fecha_fin
    if tarea.fecha_fin_repeticion and tarea.fecha_fin_repeticion < limite_superior:
        limite_superior = tarea.fecha_fin_repeticion

    if limite_superior < fecha_inicio:
        return []

    if tarea.repeticion == 'ninguna':
        if tarea.fecha_entrega < fecha_inicio or tarea.fecha_entrega > limite_superior:
            return []
        return [tarea.fecha_entrega]

    fechas = []
    actual = tarea.fecha_entrega
    contador = 0

    while actual and actual < fecha_inicio and contador < MAX_OCCURRENCIAS_SEGURIDAD:
        actual = obtener_siguiente_fecha(tarea, actual)
        contador += 1

    while (
        actual
        and actual <= limite_superior
        and contador < MAX_OCCURRENCIAS_SEGURIDAD
    ):
        if actual >= fecha_inicio:
            fechas.append(actual)
        actual = obtener_siguiente_fecha(tarea, actual)
        contador += 1

    return fechas


def obtener_proxima_ocurrencia(tarea: Tarea, referencia: Optional[date] = None) -> Optional[date]:
    if not tarea.fecha_entrega:
        return None

    referencia = referencia or date.today()

    if tarea.repeticion == 'ninguna':
        return tarea.fecha_entrega if tarea.fecha_entrega >= referencia else None

    actual = tarea.fecha_entrega
    contador = 0

    while actual and contador < MAX_OCCURRENCIAS_SEGURIDAD:
        if tarea.fecha_fin_repeticion and actual > tarea.fecha_fin_repeticion:
            return None
        if actual >= referencia:
            return actual
        actual = obtener_siguiente_fecha(tarea, actual)
        contador += 1

    return None


def fecha_corresponde_a_tarea(tarea: Tarea, fecha: date) -> bool:
    if not tarea.fecha_entrega:
        return False

    if tarea.fecha_fin_repeticion and fecha > tarea.fecha_fin_repeticion:
        return False

    if tarea.repeticion == 'ninguna':
        return tarea.fecha_entrega == fecha

    if fecha < tarea.fecha_entrega:
        return False

    actual = tarea.fecha_entrega
    contador = 0

    while actual and contador < MAX_OCCURRENCIAS_SEGURIDAD:
        if actual == fecha:
            return True
        if actual > fecha:
            return False
        actual = obtener_siguiente_fecha(tarea, actual)
        contador += 1

    return False
