import csv
from employees.models import Employee, Department, Route
from django.db import transaction


def import_employees_from_csv(file_path):
    """
    Чете CSV файл и създава служители.
    Ако няма Department или Route, ги създава автоматично.
    Опитва първо UTF-8, ако не стане – cp1251 (за кирилица от Windows Excel)
    """
    encodings_to_try = ['utf-8', 'cp1251']

    for enc in encodings_to_try:
        try:
            with open(file_path, newline='', encoding=enc) as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')

                with transaction.atomic():
                    for row in reader:
                        department_name = row['department'].strip()
                        department, _ = Department.objects.get_or_create(name=department_name)

                        # Route
                        route_name = row['route'].strip()
                        route, _ = Route.objects.get_or_create(name=route_name)

                        # Employee
                        personal_number = row['personal_number'].strip()
                        first_name = row['first_name'].strip()
                        last_name = row['last_name'].strip()

                        employee, created = Employee.objects.get_or_create(
                            personal_number=personal_number,
                            defaults={
                                'first_name': first_name,
                                'last_name': last_name,
                                'department': department,
                                'route': route
                            }
                        )

                        if not created:
                            employee.first_name = first_name
                            employee.last_name = last_name
                            employee.department = department
                            employee.route = route
                            employee.save()

            print(f"Импортът завърши успешно! (кодировка: {enc})")
            break  # ако успешно, спираме цикъла
        except UnicodeDecodeError:
            print(f"Грешка при четене с кодировка {enc}, пробваме следващата...")
    else:
        # Ако нито една кодировка не е сработила
        print("Неуспешно четене на CSV. Проверете кодировката на файла.")