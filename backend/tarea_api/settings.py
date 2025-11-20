from datetime import timedelta
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in {'1', 'true', 'yes', 'on'}


def _env_list(name: str, fallback: list[str]) -> list[str]:
    value = os.getenv(name)
    if not value:
        return fallback
    return [item.strip() for item in value.split(',') if item.strip()]


SECRET_KEY = os.getenv('SECRET_KEY', 'clave-super-secreta')
DEBUG = _env_bool('DEBUG', True)

ALLOWED_HOSTS = _env_list(
    'ALLOWED_HOSTS',
    ['localhost', '127.0.0.1', 'api-proyecto-mzbi.onrender.com'],
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Dependencias
    'rest_framework',
    'corsheaders',

    # Apps del proyecto
    'usuarios',
    'tareas',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tarea_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


AUTH_USER_MODEL = 'usuarios.Usuario'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

if _env_bool('USE_SQLITE_FOR_TESTS') or os.getenv('GITHUB_ACTIONS') or os.getenv('CI'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'postgres'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', 'Fernando041611'),
            'HOST': os.getenv('DB_HOST', 'nuevastecnologias.csbqgcma6jn2.us-east-1.rds.amazonaws.com'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }

CORS_ALLOWED_ORIGINS = _env_list(
    'CORS_ALLOWED_ORIGINS',
    [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://api-proyecto-mzbi.onrender.com',
        'https://to-do-topaz-sigma.vercel.app',
    ],
)
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN_REGEXES = _env_list(
    'CORS_ALLOWED_ORIGIN_REGEXES',
    [r'^https://(?:.+\.)?vercel\.app$'],
)

CSRF_TRUSTED_ORIGINS = _env_list(
    'CSRF_TRUSTED_ORIGINS',
    ['https://api-proyecto-mzbi.onrender.com'],
)

LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
