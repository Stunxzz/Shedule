from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    GroupViewSet,
    PermissionViewSet,
    RegisterView,
    ProfileView, CurrentUserView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- Router за CRUD ViewSets ---
router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"groups", GroupViewSet)
router.register(r"permissions", PermissionViewSet)

urlpatterns = [
    # JWT + Register + Profile
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("me/", CurrentUserView.as_view(), name="current-user"),

    # CRUD endpoints от Router
    path("", include(router.urls)),
]
