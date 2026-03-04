from rest_framework import serializers
from departments.models import Department
from departments.serializers import DepartmentSerializer
from .models import Employee, Stop, Route, Schedule


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['id', 'name', 'order']


class RouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = ['id', 'name', 'stops']


class EmployeeSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        write_only=True
    )

    route = serializers.PrimaryKeyRelatedField(
        queryset=Route.objects.all(),
        allow_null=True,
        required=False,
        write_only=True
    )

    department_detail = DepartmentSerializer(source='department', read_only=True)
    route_detail = RouteSerializer(source='route', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id',
            'personal_number',
            'first_name',
            'last_name',
            'department',
            'route',
            'department_detail',
            'route_detail'
        ]


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'employee', 'date', 'shift', 'working_place', 'created_by']
