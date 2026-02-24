from django.contrib.auth.models import Group, Permission
from rest_framework.parsers import MultiPartParser, FormParser

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
    queryset = AppUser.objects.all().order_by('first_name')
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissions]
    search_fields = ['first_name', 'email']


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [DjangoModelPermissions]
    search_fields = ['name']


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.order_by("content_type__app_label", "codename")
    serializer_class = PermissionSerializer
    permission_classes = [DjangoModelPermissions]
    pagination_class = None


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "groups": [g.name for g in user.groups.all()],
            "department": user.department.name if user.department else None,
            "email": user.email,
            "avatar": user.avatar.url if user.avatar else None,
        })

    def put(self, request):
        user = request.user
        data = request.data

        # Разрешени полета за редакция
        allowed_fields = ["first_name", "last_name", "avatar", 'email']

        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        user.save()

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "groups": [g.name for g in user.groups.all()],
            "department": user.department.name if user.department else None,
            "email": user.email,
            "avatar": user.avatar.url if user.avatar else None,
        }, status=status.HTTP_200_OK)