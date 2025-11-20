from django.urls import path
from .views import RegistroAPIView, MyTokenObtainPairView, PerfilAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegistroAPIView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', PerfilAPIView.as_view(), name='perfil'),
]
