from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    
    class Meta:
        db_table = 'roles'
        
    def __str__(self):
        return self.nombre

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre=None, password=None, **extra_fields):
        if not email:
            raise ValueError('El email debe ser proporcionado')
        email = self.normalize_email(email)
        
        # Asignar rol 'usuario' por defecto si no se especifica
        if 'rol' not in extra_fields:
            rol_usuario, _ = Rol.objects.get_or_create(nombre='usuario')
            extra_fields['rol'] = rol_usuario
            
        user = self.model(email=email, nombre=nombre, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        # Asignar rol 'admin' a superusuarios
        rol_admin, _ = Rol.objects.get_or_create(nombre='admin')
        extra_fields['rol'] = rol_admin
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True')
        return self.create_user(email, nombre, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=150)
    contrasena = models.CharField(max_length=200, db_column='contrasena')
    fecha_registro = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, db_column='id_rol')

    # campos necesarios por Django admin
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']
    
    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return f'{self.email} - {self.nombre}'
    
    def save(self, *args, **kwargs):
        # Sincronizar el campo password con contrasena
        if self.password:
            self.contrasena = self.password
        super().save(*args, **kwargs)
