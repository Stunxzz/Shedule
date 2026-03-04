from django.db import models
from api.models import AppUser
from departments.models import Department


class Route(models.Model):
    name = models.CharField(max_length=50, unique=True)  # напр. "Маршрут 1"
    class Meta:
        db_table = 'route'
    def __str__(self):
        return self.name


class Stop(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="stops")
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('route', 'order')
        ordering = ['order']
        db_table = 'stop'

    def __str__(self):
        return f"{self.route.name} - {self.name}"


class Employee(models.Model):
    personal_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'employees'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.personal_number})"


class Shift(models.TextChoices):
    SHIFT_1 = '1', 'Първа'
    SHIFT_2 = '2', 'Втора'
    SHIFT_3 = '3', 'Нощна'
    SHIFT_4 = 'H', 'Отпуска'  # H = Holiday / отпуска
    SHIFT_5 = "S", 'Болничен'  # S = Sick / болничен


class Schedule(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    shift = models.CharField(max_length=1, choices=Shift.choices)
    working_place = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.ForeignKey(AppUser, on_delete=models.SET_NULL,blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'date')
        db_table = 'schedule'

    def __str__(self):
        return f"{self.employee} - {self.date} - {self.shift} - {self.working_place or 'N/A'}"
