from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EmployeeViewSet, RouteViewSet, ScheduleViewSet, EmployeeImportView, EmployeeClearView, WeekDaysView, \
    WeekScheduleView, DepartmentEmployeesView, BulkScheduleView, LastDepartmentScheduleView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'schedules', ScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('employees/import/', EmployeeImportView.as_view(), name='employee-import'),
    path('employees/clear/', EmployeeClearView.as_view(), name='employee-clear'),
    path("week-days/", WeekDaysView.as_view()),
    path("week-schedule/", WeekScheduleView.as_view()),
    path("department-employees/", DepartmentEmployeesView.as_view()),
    path("bulk-schedule/", BulkScheduleView.as_view()),
    path("last-schedule/", LastDepartmentScheduleView.as_view()),
]
