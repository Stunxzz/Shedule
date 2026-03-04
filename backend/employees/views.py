import os

from rest_framework import viewsets, filters, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from backend import settings
from .models import Employee, Route, Schedule
from .serializers import EmployeeSerializer, RouteSerializer, ScheduleSerializer
from .utils import import_employees_from_csv


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('personal_number')
    serializer_class = EmployeeSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['personal_number', 'first_name', 'last_name', 'route__name']


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    search_fields = ['name']
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], pagination_class=None)
    def all(self, request):
        routes = Route.objects.all()
        serializer = self.get_serializer(routes, many=True)
        return Response(serializer.data)


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['employee__first_name', 'employee__last_name', 'working_place']


class EmployeeImportView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        csv_path = os.path.join(settings.BASE_DIR, "data/employees.csv")
        if not os.path.exists(csv_path):
            return Response({"error": "CSV file not found"}, status=status.HTTP_400_BAD_REQUEST)
        import_employees_from_csv(csv_path)
        return Response({"success": "Employees imported successfully"}, status=status.HTTP_200_OK)


class EmployeeClearView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print('post')
        Employee.objects.all().delete()
        return Response({"success": "All employees cleared"}, status=status.HTTP_200_OK)




class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

    @action(detail=False, methods=['get'], pagination_class=None)
    def all(self, request):
        routes = Route.objects.all()
        serializer = self.get_serializer(routes, many=True)
        return Response(serializer.data)