import os

from django.db.models import Max
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta
from backend import settings
from .models import Employee, Route, Schedule
from .serializers import EmployeeSerializer, RouteSerializer, ScheduleSerializer
from .utils import import_employees_from_csv


class WeekDaysView(APIView):
    def get(self, request):
        week = int(request.query_params.get('week'))
        year = int(request.query_params.get('year'))
        first_day = datetime.strptime(f"{year}-W{week}-1", "%G-W%V-%u")
        days = []
        for i in range(7):
            day = first_day + timedelta(days=i)
            days.append({
                "date": day.date(),
                "day": day.strftime("%A"),
                "label": day.strftime("%d.%m")
            })
        return Response(days)


class WeekScheduleView(APIView):

    def get(self, request):

        week = int(request.query_params.get("week"))
        year = int(request.query_params.get("year"))
        department_id = request.query_params.get("department")

        first_day = datetime.strptime(f"{year}-W{week}-1", "%G-W%V-%u")
        last_day = first_day + timedelta(days=6)

        schedules = Schedule.objects.select_related("employee").filter(
            employee__department_id=department_id,
            date__range=[first_day, last_day]
        )

        serializer = ScheduleSerializer(schedules, many=True)

        return Response(serializer.data)

class LastDepartmentScheduleView(APIView):

    def get(self, request):

        department_id = request.query_params.get("department")

        last_date = Schedule.objects.filter(
            employee__department_id=department_id
        ).aggregate(Max("date"))["date__max"]

        if not last_date:
            return Response({"week": None, "year": None})

        iso = last_date.isocalendar()

        return Response({
            "week": iso.week,
            "year": iso.year
        })

class DepartmentEmployeesView(APIView):

    def get(self, request):
        employees = Employee.objects.filter(
            department=request.user.department
        )
        data = [
            {
                "id": emp.id,
                "name": f"{emp.first_name} {emp.last_name}",
                "personal_number": emp.personal_number,
            }
            for emp in employees
        ]

        return Response(data)


class BulkScheduleView(APIView):

    def post(self, request):
        print(request.data)
        for item in request.data:
            Schedule.objects.update_or_create(
                employee_id=item["employee"],
                date=item["date"],
                defaults={
                    "shift": item["shift"],
                    "working_place": item.get("working_place"),
                    "created_by": request.user
                }
            )
        return Response({"status": "ok"})


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




