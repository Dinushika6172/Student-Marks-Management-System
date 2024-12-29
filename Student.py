class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name
        self.marks = []

    def add_marks(self, marks):
        self.marks.extend(marks)

    def calculate_average(self):
        if not self.marks:
            return 0
        return sum(self.marks) / len(self.marks)

    def __str__(self):
        return f"ID: {self.student_id}, Name: {self.name}, Average Marks: {self.calculate_average():.2f}"

def read_students_from_file(filename):
    students = []
    try:
        with open(filename, 'r') as file:
            for line in file:
                student_id, name, *marks = line.strip().split(',')
                student = Student(student_id, name)
                student.add_marks([int(mark) for mark in marks])
                students.append(student)
    except FileNotFoundError:
        print(f"Error: The file '{filename}' does not exist. Please check the filename.")
        return []
    except ValueError as e:
        print(f"Error reading file: {e}")
    return students

def write_students_to_file(filename, students):
    with open(filename, 'w') as file:
        for student in students:
            marks = ','.join(map(str, student.marks))
            file.write(f"{student.student_id},{student.name},{marks}\n")

def show_summary_of_student(filename, student_id):
    students = read_students_from_file(filename)
    for student in students:
        if student.student_id == student_id:
            print(student)
            return
    print(f"Student with ID {student_id} not found.")

def add_new_student(filename, student_id, name):
    with open(filename, 'a') as file:
        file.write(f"{student_id},{name}\n")

def test_handle_file_not_found():
    filename = "students.txt" # Valid file name
    try:
        students = read_students_from_file(filename)
        print("Test Passed: File 'students.txt' found and read successfully.")
    except FileNotFoundError as e:
        print(f"Test Failed: {e}")

def update_student_marks(filename, student_id, new_marks):
    try:
        students = read_students_from_file(filename)
        found = False
        for student in students:
            if student.student_id == student_id:
                student.marks = new_marks
                found = True
                break
        if not found:
            raise IndexError(f"Student with ID {student_id} not found.")
        write_students_to_file(filename, students)
    except ValueError as e:
        print(f"Invalid marks input: {e}")
    except IndexError as e:
        print(e)

def calculate_class_average(students):
    total_marks = sum(mark for student in students for mark in student.marks)
    total_students = len(students)
    return total_marks / total_students if total_students > 0 else 0

def find_top_performing_student(students):
    if not students:
        print("No students available.")
        return None
    top_student = max(students, key=lambda student: student.calculate_average())
    return top_student

def validate_marks_input(mark):
    try:
        mark = int(mark)
        if mark < 0 or mark > 100:
            raise ValueError("Marks must be between 0 and 100.")
        return mark
    except ValueError:
        raise ValueError("Invalid marks input. Marks must be an integer between 0 and 100.")

# Main program
def main():
    filename = "students.txt"
    while True:
        print("\n-- Student Marks Management System --")
        print("1. Add new student")
        print("2. Add or update marks for an existing student")
        print("3. View student summary")
        print("4. Calculate class average")
        print("5. Top performing student")
        print("6. Exit")

        try:
            choice = int(input("Enter your choice (1-6): "))

            if choice == 1:
                student_id = input("Enter student ID: ")
                name = input("Enter student name: ")
                add_new_student(filename, student_id, name)
            elif choice == 2:
                student_id = input("Enter student ID: ")
                try:
                    new_marks = [validate_marks_input(mark) for mark in input("Enter marks separated by commas: ").split(',')]
                    update_student_marks(filename, student_id, new_marks)
                except ValueError as e:
                    print(e)
            elif choice == 3:
                student_id = input("Enter student ID: ")
                show_summary_of_student(filename, student_id)
            elif choice == 4:
                students = read_students_from_file(filename)
                average = calculate_class_average(students)
                print(f"Class average: {average:.2f}")
            elif choice == 5:
                students = read_students_from_file(filename)
                top_student = find_top_performing_student(students)
                if top_student:
                    print("Top performing student:", top_student)
            elif choice == 6:
                break
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Invalid input. Please enter a number between 1 and 6.")

if __name__ == "__main__":
    main()
