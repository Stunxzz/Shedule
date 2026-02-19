from rest_framework import serializers
from django.contrib.auth.models import Group, Permission

from api.models import AppUser


class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Permission.objects.all()
    )

    class Meta:
        model = Group
        fields = ["id", "name", "permissions"]


class AddUserToGroupSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=AppUser.objects.all()
    )

    def save(self, **kwargs):
        group = self.context['group']
        user = self.validated_data['user']
        group.user_set.add(user)
        return user


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "name", "codename"]
