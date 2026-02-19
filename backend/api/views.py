from django.contrib.auth.models import Group, Permission

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, DjangoModelPermissions
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView

from permissions.serializers import GroupSerializer, PermissionSerializer
from .models import AppUser
from .serializers import RegisterSerializer, ProfileSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'User registered successfully'}, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissions]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [DjangoModelPermissions]


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [DjangoModelPermissions]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "groups": [g.name for g in user.groups.all()],
            "permissions": list(user.get_all_permissions()),
        })