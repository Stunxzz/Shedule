from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EmployeeViewSet, RouteViewSet, ScheduleViewSet, EmployeeImportView, EmployeeClearView

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'schedules', ScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('employees/import/', EmployeeImportView.as_view(), name='employee-import'),
    path('employees/clear/', EmployeeClearView.as_view(), name='employee-clear'),
]